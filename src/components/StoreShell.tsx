"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartToast from "@/components/CartToast";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import { BreadcrumbLabelProvider } from "@/components/BreadcrumbContext";

export default function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  const marketingRoutes = ["/", "/about", "/blog", "/faq", "/contact"];
  const isMarketing = marketingRoutes.includes(pathname);

  const isEcommerce =
    pathname.startsWith("/products") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/wishlist");

  const showBreadcrumb =
    isEcommerce || pathname.startsWith("/blog/");

  const headerVariant = isMarketing ? "transparent" : "solid";

  return (
    <BreadcrumbLabelProvider>
      <Header variant={headerVariant} />
      {showBreadcrumb && <BreadcrumbBar />}
      <main className={`flex-1 ${isEcommerce ? "bg-[#F7F7F7]" : ""}`}>{children}</main>
      <Footer />
      <CartToast />
    </BreadcrumbLabelProvider>
  );
}
