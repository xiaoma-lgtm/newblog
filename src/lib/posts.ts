import type { Post } from "@prisma/client";
import { prisma } from "@/lib/db";

/** 首页每页文章数 */
export const PAGE_SIZE = 5;

/** 解析数据库中 JSON 字符串形式的标签数组 */
export function parseTags(json: string): string[] {
  try {
    const value: unknown = JSON.parse(json);
    return Array.isArray(value)
      ? value.filter((t): t is string => typeof t === "string")
      : [];
  } catch {
    return [];
  }
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 前台：按发布时间倒序分页获取"已发布"文章（草稿不可见） */
export async function getPublishedPostsPage(page: number) {
  const where = { status: "published" };
  const total = await prisma.post.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (safePage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });
  return { posts, total, totalPages, page: safePage };
}

/** 前台：按 id 获取"已发布"文章，草稿或不存在的返回 null */
export async function getPublishedPostById(id: number): Promise<Post | null> {
  const post = await prisma.post.findUnique({ where: { id } });
  return post && post.status === "published" ? post : null;
}

// ===== 后台管理 =====

export type PostInput = {
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  status: string;
};

/** 校验并规范化接口请求体，返回 null 表示不合法（标题必填） */
export function parsePostInput(body: unknown): PostInput | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const title = typeof b.title === "string" ? b.title.trim() : "";
  if (!title) return null;

  let status = typeof b.status === "string" ? b.status : "draft";
  if (status !== "draft" && status !== "published") status = "draft";

  let tags: string[] = [];
  if (Array.isArray(b.tags)) {
    tags = b.tags
      .filter((t): t is string => typeof t === "string")
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && t.length <= 20)
      .slice(0, 10);
  }

  return {
    title,
    summary: typeof b.summary === "string" ? b.summary.trim() : "",
    content: typeof b.content === "string" ? b.content : "",
    category: typeof b.category === "string" ? b.category.trim() : "",
    tags,
    status,
  };
}

/** 后台：全部文章（含草稿），按创建时间倒序 */
export async function getAllPosts(): Promise<Post[]> {
  return prisma.post.findMany({ orderBy: { createdAt: "desc" } });
}

/** 后台：按 id 获取文章（含草稿） */
export async function getPostById(id: number): Promise<Post | null> {
  return prisma.post.findUnique({ where: { id } });
}

export async function createPost(input: PostInput): Promise<Post> {
  return prisma.post.create({
    data: {
      title: input.title,
      summary: input.summary,
      content: input.content,
      category: input.category,
      tags: JSON.stringify(input.tags),
      status: input.status,
    },
  });
}

export async function updatePost(id: number, input: PostInput): Promise<Post> {
  return prisma.post.update({
    where: { id },
    data: {
      title: input.title,
      summary: input.summary,
      content: input.content,
      category: input.category,
      tags: JSON.stringify(input.tags),
      status: input.status,
    },
  });
}

export async function deletePost(id: number): Promise<void> {
  await prisma.post.delete({ where: { id } });
}
