import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  deletePost,
  getPostById,
  parsePostInput,
  updatePost,
  type PostInput,
} from "@/lib/posts";

function parseId(raw: string): number | null {
  const id = Number.parseInt(raw, 10);
  return Number.isNaN(id) || id < 1 ? null : id;
}

/** 后台：编辑文章 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { id } = await params;
  const postId = parseId(id);
  if (postId === null) {
    return NextResponse.json({ error: "无效的文章 id" }, { status: 400 });
  }
  if (!(await getPostById(postId))) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }
  let input: PostInput | null;
  try {
    input = parsePostInput(await request.json());
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
  if (!input) {
    return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
  }
  const post = await updatePost(postId, input);
  return NextResponse.json({ id: post.id });
}

/** 后台：删除文章 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { id } = await params;
  const postId = parseId(id);
  if (postId === null) {
    return NextResponse.json({ error: "无效的文章 id" }, { status: 400 });
  }
  if (!(await getPostById(postId))) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }
  await deletePost(postId);
  return NextResponse.json({ ok: true });
}
