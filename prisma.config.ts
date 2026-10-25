import { defineConfig } from "prisma/config";

// Prisma 7 不再自动加载 .env，这里手动加载（Node 20.12+ 原生支持）
process.loadEnvFile();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
