import Link from "next/link";

/** 404 页共享 UI：根级 not-found（未匹配 URL / Proxy 重写）与前台 not-found 复用 */
export default function NotFoundContent() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-6xl font-bold text-zinc-300 dark:text-zinc-700">404</p>
      <h1 className="mt-4 text-xl font-semibold">页面不存在</h1>
      <p className="mt-2 text-sm text-zinc-500">
        你访问的文章可能已被删除，或链接有误。
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
      >
        返回首页
      </Link>
    </main>
  );
}
