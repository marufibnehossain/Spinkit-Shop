"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  "/products": "Shop All",
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/checkout/success": "Order complete",
};

export default function BreadcrumbBar() {
  const pathname = usePathname() || "/";

  let label = LABELS[pathname] ?? "Shop";
  if (pathname.startsWith("/product/")) {
    label = "Product details";
  }

  return (
    <div className="border-b border-border bg-[#E9E6E3]">
      <div className="mx-auto max-w-[1315px] px-4 md:px-6 w-full">
        <div className="flex items-center gap-2 py-3 text-sm font-sans text-muted">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 hover:text-text"
          >
            <span aria-hidden>←</span>
            <span>Back</span>
          </Link>
          <span className="mx-1">/</span>
          <Link href="/" className="hover:text-text">
            Home
          </Link>
          <span className="mx-1">/</span>
          <span className="text-text">{label}</span>
        </div>
      </div>
    </div>
  );
}

