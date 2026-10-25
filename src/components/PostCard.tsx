import Link from "next/link";
import type { Post } from "@prisma/client";
import { formatDate, parseTags } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  const tags = parseTags(post.tags);

  return (
    <article className="py-6">
      <Link href={`/post/${post.id}`} className="group block">
        <h2 className="text-xl font-semibold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {post.title}
        </h2>
        {post.summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {post.summary}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
          <time>{formatDate(post.createdAt)}</time>
          {post.category && <span>{post.category}</span>}
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}
