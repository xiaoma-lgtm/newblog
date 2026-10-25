import NotFoundContent from "@/components/NotFoundContent";

/**
 * 前台路由段 404 边界：文章详情页 notFound()（客户端导航等场景）就近渲染，
 * 位于 (public) 布局内，因此带顶部导航和页脚。
 * 直接 HTTP 请求的 404 状态码由 src/proxy.ts 在渲染前保证。
 */
export default function NotFound() {
  return <NotFoundContent />;
}
