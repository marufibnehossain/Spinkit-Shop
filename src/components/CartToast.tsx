"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartToastStore } from "@/lib/cart-toast-store";
import FormatPrice from "./FormatPrice";

export default function CartToast() {
  const { isOpen, item, hideToast } = useCartToastStore();

  useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(() => {
      hideToast();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [isOpen, hideToast]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] max-w-sm w-full px-4">
      <div className="flex items-center gap-3 rounded-none border border-border bg-white shadow-lg px-3 py-3">
        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-sage-1 border border-border shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-xs text-muted uppercase tracking-wide">
            Added to cart
          </p>
          <p className="font-sans text-sm font-medium text-text truncate">
            {item.name}
          </p>
          <p className="font-sans text-xs text-muted">
            <FormatPrice price={item.price} />
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            onClick={hideToast}
            className="font-sans text-xs text-muted hover:text-text"
            aria-label="Close"
          >
            ×
          </button>
          <Link
            href="/cart"
            className="font-sans text-xs font-medium text-sage-dark bg-[#CFFF40] px-2.5 py-1 rounded-none hover:opacity-90"
          >
            View cart
          </Link>
        </div>
      </div>
    </div>
  );
}

