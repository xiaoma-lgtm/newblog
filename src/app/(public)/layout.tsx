import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/** 前台布局：顶部导航 + 内容 + 页脚 */
export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {/* Navbar 使用 usePathname、Footer 使用 connection()，
          都是运行时数据，包 Suspense 以便静态页预渲染 */}
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      {children}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
