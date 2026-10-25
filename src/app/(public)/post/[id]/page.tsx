import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDate, getPublishedPostById, parseTags } from "@/lib/posts";

// 详情页读取数据库和 params，按请求渲染
export const instant = false;

/** 解析并校验 URL 中的文章 id */
function parseId(raw: string): number | null {
  const id = Number.parseInt(raw, 10);
  return Number.isNaN(id) || id < 1 ? null : id;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const postId = parseId(id);
  const post = postId === null ? null : await getPublishedPostById(postId);
  return { title: post ? post.title : "文章不存在" };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = parseId(id);
  // 文章不存在或是草稿时，一律按 404 处理。
  // 直接请求的 404 状态码由 proxy.ts 在渲染前保证（流式后 notFound() 状态码为 200），
  // 这里的 notFound() 兜底客户端导航等场景，渲染 (public) 段的 404 边界。
  const post = postId === null ? null : await getPublishedPostById(postId);
  if (!post) notFound();

  const tags = parseTags(post.tags);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <Link
        href="/"
        className="text-sm text-zinc-500 transition-colors hover:text-foreground"
      >
        ← 返回首页
      </Link>

      <article className="mt-6">
        <header className="border-b border-black/10 pb-6 dark:border-white/10">
          <h1 className="text-3xl font-bold leading-snug tracking-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500">
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
        </header>

        <div className="prose prose-zinc mt-8 max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
