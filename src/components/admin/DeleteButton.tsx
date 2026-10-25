"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else if (res.status === 401) {
        router.push("/admin/login");
      } else {
        setConfirming(false);
        window.alert("删除失败，请稍后重试");
      }
    } catch {
      setConfirming(false);
      window.alert("网络错误，请稍后重试");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm text-red-500 transition-colors hover:text-red-600"
      >
        删除
      </button>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setConfirming(false)}
          role="dialog"
          aria-modal="true"
          aria-label="删除确认"
        >
          <div
            className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-950"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold">确认删除？</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              即将删除文章《{title}》，此操作不可恢复。
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-md border border-black/10 px-4 py-2 text-sm transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/40"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={pending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50"
              >
                {pending ? "删除中…" : "确认删除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
