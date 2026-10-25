import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createPost,
  getAllPosts,
  parsePostInput,
  parseTags,
  type PostInput,
} from "@/lib/posts";

/** 后台：文章列表（含草稿） */
export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const posts = await getAllPosts();
  return NextResponse.json(
    posts.map((p) => ({ ...p, tags: parseTags(p.tags) }))
  );
}

/** 后台：新增文章 */
export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
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
  const post = await createPost(input);
  return NextResponse.json({ id: post.id }, { status: 201 });
}
