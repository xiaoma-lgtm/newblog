import { SignJWT, jwtVerify } from "jose";

/**
 * 会话签发与校验（Edge 安全，middleware 与 Node 环境通用）
 * 会话内容：签名 JWT，存于 httpOnly Cookie 中
 */

export const SESSION_COOKIE = "myblog_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 天

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("缺少 SESSION_SECRET 环境变量");
  return new TextEncoder().encode(secret);
}

/** 登录成功后签发会话令牌 */
export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

/** 校验会话令牌，无效（伪造/过期）返回 false */
export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}
