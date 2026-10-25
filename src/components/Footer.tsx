import { connection } from "next/server";

export default async function Footer() {
  // 页脚含当前年份，标记为按请求渲染（避免构建期固化）
  await connection();

  return (
    <footer className="mt-auto border-t border-black/10 py-6 text-center text-sm text-zinc-500 dark:border-white/10">
      © {new Date().getFullYear()} MyBlog · 用 Next.js 构建的个人博客
    </footer>
  );
}
