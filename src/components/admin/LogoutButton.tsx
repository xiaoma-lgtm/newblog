"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    if (pending) return;
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className="rounded-md border border-black/10 px-3 py-1.5 text-sm transition-colors hover:border-red-500 hover:text-red-500 disabled:opacity-50 dark:border-white/15"
    >
      {pending ? "退出中…" : "退出登录"}
    </button>
  );
}
