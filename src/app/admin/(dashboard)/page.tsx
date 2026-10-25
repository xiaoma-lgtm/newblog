import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/posts";

export const metadata = { title: "仪表盘" };

export default async function AdminDashboardPage() {
  const [total, published, drafts, recent] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "published" } }),
    prisma.post.count({ where: { status: "draft" } }),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, status: true, createdAt: true },
    }),
  ]);

  const stats = [
    { label: "文章总数", value: total },
    { label: "已发布", value: published },
    { label: "草稿", value: drafts },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="text-2xl font-bold">仪表盘</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-black/10 p-5 dark:border-white/10"
          >
            <p className="text-sm text-zinc-500">{s.label}</p>
            <p className="mt-2 text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">最近文章</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
          {recent.length === 0 ? (
            <p className="p-5 text-sm text-zinc-500">还没有文章</p>
          ) : (
            <ul className="divide-y divide-black/5 dark:divide-white/10">
              {recent.map((post) => (
                <li
                  key={post.id}
                  className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
                >
                  <span className="truncate">{post.title}</span>
                  <span className="flex shrink-0 items-center gap-3 text-xs text-zinc-500">
                    {post.status === "published" ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700 dark:bg-green-950 dark:text-green-400">
                        已发布
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                        草稿
                      </span>
                    )}
                    {formatDate(post.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
