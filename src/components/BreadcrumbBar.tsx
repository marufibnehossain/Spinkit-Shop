"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBreadcrumbLabel } from "@/components/BreadcrumbContext";

const LABELS: Record<string, string> = {
  "/products": "Shop All",
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/checkout/success": "Order complete",
  "/wishlist": "Wishlist",
};

export default function BreadcrumbBar() {
  const pathname = usePathname() || "/";
  const breadcrumbLabel = useBreadcrumbLabel();

  const isBlog = pathname === "/blog" || pathname.startsWith("/blog/");
  const isSingleBlogPost = pathname.startsWith("/blog/") && pathname !== "/blog";

  let label = LABELS[pathname] ?? "Shop";
  if (pathname.startsWith("/product/")) {
    label = "Product details";
  } else if (isBlog && !breadcrumbLabel) {
    label = "Blogs";
  }

  return (
    <nav className="border-b border-border bg-[#E9E6E3]" aria-label="Breadcrumb">
      <div className="mx-auto max-w-[1315px] px-4 md:px-6 w-full">
        <div className="flex items-center gap-2 py-3 text-sm font-sans text-muted flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-text"
          >
            <span aria-hidden>←</span>
            <span>Home</span>
          </Link>
          <span className="mx-1">/</span>
          {pathname === "/products" && !breadcrumbLabel ? (
            <span className="text-text">Shop</span>
          ) : pathname === "/products" && breadcrumbLabel ? (
            <>
              <Link href="/products" className="hover:text-text">
                Shop
              </Link>
              <span className="mx-1">/</span>
              <span className="text-text truncate max-w-[200px] md:max-w-none" title={breadcrumbLabel}>
                {breadcrumbLabel}
              </span>
            </>
          ) : pathname !== "/products" ? (
            <>
              <Link href="/products" className="hover:text-text">
                Shop
              </Link>
              <span className="mx-1">/</span>
              {isSingleBlogPost && breadcrumbLabel ? (
                <>
                  <Link href="/blog" className="hover:text-text">
                    Blogs
                  </Link>
                  <span className="mx-1">/</span>
                  <span className="text-text truncate max-w-[200px] md:max-w-none" title={breadcrumbLabel}>
                    {breadcrumbLabel}
                  </span>
                </>
              ) : (
                <span className="text-text">{label}</span>
              )}
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

