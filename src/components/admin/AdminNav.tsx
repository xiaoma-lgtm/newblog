"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "仪表盘" },
  { href: "/admin/posts", label: "文章管理" },
];

export default function AdminNav() {
  const pathname = usePathname();

  const linkClass = (href: string) => {
    // /admin 只精确匹配；/admin/posts 及其子页面（new/edit）都算选中
    const active =
      href === "/admin" ? pathname === href : pathname.startsWith(href);
    return active
      ? "font-semibold text-foreground"
      : "text-zinc-500 transition-colors hover:text-foreground";
  };

  return (
    <aside className="flex shrink-0 items-center gap-1 border-b border-black/10 bg-zinc-50 px-4 py-2 text-sm md:w-48 md:flex-col md:items-stretch md:gap-1 md:border-b-0 md:border-r md:px-3 md:py-4 dark:border-white/10 dark:bg-zinc-950">
      <Link href="/admin" className="mb-0 px-2 py-1.5 text-base font-bold md:mb-4">
        MyBlog 后台
      </Link>
      <nav className="flex gap-1 md:flex-col">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-md px-2 py-1.5 ${linkClass(l.href)}`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
