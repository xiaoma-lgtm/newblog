"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type PostFormProps = {
  /** 编辑时传入原文，新增时为 undefined */
  initial?: {
    id: number;
    title: string;
    summary: string;
    content: string;
    category: string;
    tags: string[];
    status: string;
  };
};

const inputClass =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none transition-colors focus:border-blue-600 dark:border-white/20";

export default function PostForm({ initial }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(", "));
  const [content, setContent] = useState(initial?.content ?? "");
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!title.trim()) {
      setError("标题不能为空");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const tags = tagsText
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const url = initial ? `/api/posts/${initial.id}` : "/api/posts";
      const res = await fetch(url, {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, summary, category, tags, content, status }),
      });
      if (res.ok) {
        router.push("/admin/posts");
        router.refresh();
      } else {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error ?? "保存失败，请稍后重试");
      }
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">标题 *</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={inputClass}
          placeholder="文章标题"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">摘要</span>
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className={inputClass}
          placeholder="一句话介绍这篇文章（显示在首页卡片上）"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">分类</span>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
            placeholder="如：技术 / 生活"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">标签</span>
          <input
            type="text"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            className={inputClass}
            placeholder="用逗号分隔，如：前端, 教程"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">正文（Markdown）</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          className={`${inputClass} font-mono text-xs leading-6`}
          placeholder={"支持 Markdown 语法：\n# 标题\n**加粗**、[链接](https://...)、代码块等"}
        />
      </label>

      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium">状态</span>
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            name="status"
            value="draft"
            checked={status === "draft"}
            onChange={() => setStatus("draft")}
          />
          草稿（前台不可见）
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            name="status"
            value="published"
            checked={status === "published"}
            onChange={() => setStatus("published")}
          />
          发布（前台可见）
        </label>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {submitting ? "保存中…" : "保存"}
        </button>
        <Link
          href="/admin/posts"
          className="rounded-md border border-black/10 px-5 py-2 text-sm transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/40"
        >
          取消
        </Link>
      </div>
    </form>
  );
}
