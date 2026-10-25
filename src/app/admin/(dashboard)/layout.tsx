import { redirect } from "next/navigation";
import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "管理后台", template: "%s · 管理后台" },
};

// 后台页面校验登录会话（cookies），按请求渲染
export const instant = false;

/**
 * 后台守卫布局：仅包裹仪表盘、文章管理等需登录的页面。
 * 注意：登录页 /admin/login 不在此布局内，避免重定向死循环。
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 双保险之一：页面层拦截（另一层在各 API 路由内部校验）
  if (!(await getSession())) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-black/10 px-4 md:px-6 dark:border-white/10">
          <span className="text-sm text-zinc-500">欢迎回来 👋</span>
          <LogoutButton />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
