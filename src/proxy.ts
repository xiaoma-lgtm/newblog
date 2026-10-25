import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * /post/:id 请求时发布状态检查：
 * 草稿或不存在的文章在页面渲染前直接 404。
 * 之所以放在 Proxy：流式渲染开始后 notFound() 的状态码会保持 200
 * （Next 16 文档明确此行为），无法满足 PRD「草稿链接也返回 404」。
 * 这里只做轻量单行查询，慢逻辑仍在页面层。
 *
 * 两种数据源按 DATABASE_URL 分流（懒加载，避免把本地驱动打进云端 bundle）：
 * - file: 开头（本地开发）→ node:sqlite 只读连接
 * - 其余（Turso 等远端 libSQL）→ @libsql/client/web（纯 HTTP，边缘/Node 运行时均可用）
 */
type StatusStore = {
  isPublished(id: number): Promise<boolean>;
};

let store: StatusStore | null = null;

async function getStatusStore(): Promise<StatusStore> {
  if (store) return store;
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

  if (url.startsWith("file:")) {
    const { DatabaseSync } = await import("node:sqlite");
    const db = new DatabaseSync(url.slice("file:".length), { readOnly: true });
    store = {
      async isPublished(id) {
        try {
          const row = db
            .prepare("SELECT status FROM posts WHERE id = ?")
            .get(id) as { status?: string } | undefined;
          return row?.status === "published";
        } catch {
          // 数据库文件缺失等异常按不存在处理，走 404
          return false;
        }
      },
    };
    return store;
  }

  const { createClient } = await import("@libsql/client/web");
  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  store = {
    async isPublished(id) {
      try {
        const rs = await client.execute({
          sql: "SELECT status FROM posts WHERE id = ?",
          args: [id],
        });
        return rs.rows[0]?.status === "published";
      } catch {
        return false;
      }
    },
  };
  return store;
}

/**
 * 路由守卫（两段职责）：
 * - /post/:id：草稿/不存在 → 重写到未匹配路径，由根级 not-found 返回 404（URL 不变）
 * - /admin/*：未登录访问（登录页除外）→ 302 跳转登录页；已登录访问登录页 → 302 跳转仪表盘
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/post")) {
    const seg = pathname.slice("/post".length); // "" 或 "/123"
    const id = /^\/\d+$/.test(seg) ? Number.parseInt(seg.slice(1), 10) : 0;
    if (id < 1 || !(await (await getStatusStore()).isPublished(id))) {
      return NextResponse.rewrite(new URL("/__not_found__", request.url));
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const loggedIn = token ? await verifySessionToken(token) : false;

  if (pathname === "/admin/login") {
    if (loggedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!loggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/post/:path*", "/admin/:path*"],
};
