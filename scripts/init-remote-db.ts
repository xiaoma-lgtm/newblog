/**
 * 初始化远端 libSQL 数据库（Turso）：
 * - 读取 .env.turso（gitignored，不在仓库中）的 DATABASE_URL / TURSO_AUTH_TOKEN
 * - 执行建表 DDL（由 `npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script` 生成）
 * - 建表后可用 `npx prisma db seed` 写入示例文章（seed 前同样需要注入上述两个环境变量）
 */
import { createClient } from "@libsql/client";

process.loadEnvFile(".env.turso");

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const DDL = `
CREATE TABLE IF NOT EXISTS "posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT '',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
`;

async function main() {
  if (!url || !authToken) {
    console.error("缺少 .env.turso 文件或其中的 DATABASE_URL / TURSO_AUTH_TOKEN");
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  await client.execute(DDL);
  console.log("建表完成：posts");

  const rs = await client.execute("SELECT count(*) AS n FROM posts");
  console.log("posts 当前行数：", rs.rows[0]?.n);

  client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
