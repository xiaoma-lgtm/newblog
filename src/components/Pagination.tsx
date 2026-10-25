import Link from "next/link";

/** 页码窗口：页数多时折叠为 首页…当前±1…末页 */
function pageItems(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const nums = [...new Set([1, totalPages, page - 1, page, page + 1])]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);
  const items: (number | "...")[] = [];
  let prev = 0;
  for (const n of nums) {
    if (n - prev > 1) items.push("...");
    items.push(n);
    prev = n;
  }
  return items;
}

const navClass =
  "flex h-9 min-w-9 items-center justify-center rounded-md border border-black/10 px-3 text-sm transition-colors hover:border-black/30 dark:border-white/15 dark:hover:border-white/40";
const disabledClass = `${navClass} cursor-default text-zinc-400 dark:text-zinc-600`;

export default function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => (p === 1 ? "/" : `/?page=${p}`);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="分页">
      {page > 1 ? (
        <Link href={href(page - 1)} className={navClass}>
          上一页
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          上一页
        </span>
      )}
      {pageItems(page, totalPages).map((item, i) =>
        item === "..." ? (
          <span key={`e${i}`} className="px-1 text-zinc-400">
            …
          </span>
        ) : item === page ? (
          <span key={item} className={`${navClass} border-blue-600 font-semibold text-blue-600 dark:border-blue-400 dark:text-blue-400`} aria-current="page">
            {item}
          </span>
        ) : (
          <Link key={item} href={href(item)} className={navClass}>
            {item}
          </Link>
        )
      )}
      {page < totalPages ? (
        <Link href={href(page + 1)} className={navClass}>
          下一页
        </Link>
      ) : (
        <span className={disabledClass} aria-disabled="true">
          下一页
        </span>
      )}
    </nav>
  );
}
