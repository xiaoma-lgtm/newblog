import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { getPublishedPostsPage } from "@/lib/posts";

// 首页读取数据库和 searchParams，按请求渲染
export const instant = false;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const pageNum = Number.parseInt(pageParam ?? "1", 10);
  const requestedPage = Number.isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  const { posts, total, totalPages, page } =
    await getPublishedPostsPage(requestedPage);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">最新文章</h1>
      <p className="mt-2 text-sm text-zinc-500">共 {total} 篇</p>

      {posts.length === 0 ? (
        <div className="mt-20 text-center text-zinc-500">
          还没有文章，敬请期待。
        </div>
      ) : (
        <div className="mt-8 flex flex-col divide-y divide-black/5 dark:divide-white/10">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <div className="mt-10">
        <Pagination page={page} totalPages={totalPages} />
      </div>
    </main>
  );
}
