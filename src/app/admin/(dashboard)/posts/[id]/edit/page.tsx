import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { getPostById, parseTags } from "@/lib/posts";

export const metadata = { title: "编辑文章" };

function parseId(raw: string): number | null {
  const id = Number.parseInt(raw, 10);
  return Number.isNaN(id) || id < 1 ? null : id;
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = parseId(id);
  const post = postId === null ? null : await getPostById(postId);
  if (!post) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-2xl font-bold">编辑文章</h1>
      <div className="mt-6">
        <PostForm
          initial={{
            id: post.id,
            title: post.title,
            summary: post.summary,
            content: post.content,
            category: post.category,
            tags: parseTags(post.tags),
            status: post.status,
          }}
        />
      </div>
    </div>
  );
}
