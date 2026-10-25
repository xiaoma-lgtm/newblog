import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { getAllPosts, formatDate } from "@/lib/posts";

export const metadata = { title: "文章管理" };

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
        >
          + 新增文章
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
        {posts.length === 0 ? (
          <p className="p-8 text-center text-sm text-zinc-500">
            还没有文章，点击右上角"新增文章"开始写作吧。
          </p>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-black/10 text-left text-xs text-zinc-500 dark:border-white/10">
                <th className="px-4 py-3 font-medium">标题</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">分类</th>
                <th className="px-4 py-3 font-medium">发布时间</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/10">
              {posts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.03]">
                  <td className="max-w-xs truncate px-4 py-3">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {post.category || "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-sm text-zinc-600 transition-colors hover:text-foreground dark:text-zinc-400"
                      >
                        编辑
                      </Link>
                      <DeleteButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
