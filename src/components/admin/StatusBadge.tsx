export default function StatusBadge({ status }: { status: string }) {
  return status === "published" ? (
    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-950 dark:text-green-400">
      已发布
    </span>
  ) : (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-400">
      草稿
    </span>
  );
}
