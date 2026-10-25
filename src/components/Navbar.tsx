"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "首页" },
  { href: "/about", label: "关于我" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    pathname === href
      ? "font-semibold text-foreground"
      : "text-zinc-500 transition-colors hover:text-foreground";

  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-black/85">
      <nav className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold" onClick={() => setOpen(false)}>
          MyBlog
        </Link>
        {/* 桌面端导航 */}
        <div className="hidden gap-6 text-sm sm:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </div>
        {/* 手机端汉堡按钮 */}
        <button
          type="button"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-black/5 sm:hidden dark:text-zinc-300 dark:hover:bg-white/10"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </nav>
      {/* 手机端下拉菜单 */}
      {open && (
        <div className="flex flex-col gap-2 border-t border-black/10 px-4 py-3 text-sm sm:hidden dark:border-white/10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={linkClass(l.href)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
