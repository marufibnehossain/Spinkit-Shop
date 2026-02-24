"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartToast from "@/components/CartToast";
import BreadcrumbBar from "@/components/BreadcrumbBar";

export default function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  const marketingRoutes = ["/", "/about", "/faq", "/contact"];
  const isMarketing = marketingRoutes.includes(pathname);

  const isEcommerce =
    pathname.startsWith("/products") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/cart") ||
    pathname.startsWith("/checkout");

  const headerVariant = isMarketing ? "transparent" : "solid";

  return (
    <>
      <Header variant={headerVariant} />
      {isEcommerce && <BreadcrumbBar />}
      <main className={`flex-1 ${isEcommerce ? "bg-[#F7F7F7]" : ""}`}>{children}</main>
      <Footer />
      <CartToast />
    </>
  );
}
