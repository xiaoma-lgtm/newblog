import NotFoundContent from "@/components/NotFoundContent";

/**
 * 根级 404 页（两处触发）：
 * - 未匹配任何路由的 URL（如 /xyz）
 * - Proxy 将草稿/不存在的文章请求重写到未匹配路径
 * 渲染在根布局内（不含前台导航），因此页面自带返回首页入口。
 */
export default function NotFound() {
  return <NotFoundContent />;
}
