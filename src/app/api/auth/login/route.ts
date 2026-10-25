import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import { createSessionToken } from "@/lib/session";

export async function POST(request: Request) {
  let username = "";
  let password = "";
  try {
    const body: unknown = await request.json();
    if (body && typeof body === "object") {
      const b = body as Record<string, unknown>;
      username = typeof b.username === "string" ? b.username : "";
      password = typeof b.password === "string" ? b.password : "";
    }
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminUsername || !adminPasswordHash) {
    return NextResponse.json(
      { error: "服务端未配置管理员账号，请检查 .env" },
      { status: 500 }
    );
  }

  const passwordOk = await bcrypt.compare(password, adminPasswordHash);
  if (username !== adminUsername || !passwordOk) {
    return NextResponse.json({ error: "账号或密码错误" }, { status: 401 });
  }

  const token = await createSessionToken();
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
