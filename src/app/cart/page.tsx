"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { useCurrencyStore } from "@/lib/currency-store";
import QuantityStepper from "@/components/QuantityStepper";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  useCurrencyStore((s) => s.currency);
  const formatPrice = useCurrencyStore((s) => s.formatPrice);
  const subtotal = getSubtotal();
  const shippingEstimate = subtotal >= 50 ? 0 : 9.99;
  const total = subtotal + shippingEstimate;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center px-4 py-16">
        <h1 className="font-sans text-2xl font-medium text-text mb-2">Your cart is empty</h1>
        <p className="font-sans text-muted mb-8 text-center max-w-sm">
          Add something you love and come back here when you're ready.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 rounded-none bg-[#CFFF40] text-sage-dark px-6 py-3 font-sans text-sm font-medium hover:opacity-90"
        >
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <div className="max-w-[1315px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="font-sans text-2xl md:text-3xl font-bold text-text mb-8">
          Cart
        </h1>
        <div className="grid lg:grid-cols-11 gap-8 lg:gap-10">
          {/* Left: Cart items in white card */}
          <div className="lg:col-span-7">
            <div className="p-6 md:p-8 rounded-lg border border-[#7c7d7c]">
              <ul className="divide-y divide-[#7c7d7c]">
                {items.map((item, index) => (
                  <li
                    key={`${item.productId}-${item.variationId || index}`}
                    className="py-6 flex gap-4 md:gap-6 first:pt-0 last:pb-0"
                  >
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-lg overflow-hidden bg-[#f5f5f5] border border-[#e5e5e5]"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-sans font-medium text-text hover:text-muted"
                      >
                        {item.name}
                      </Link>
                      <p className="font-sans text-sm text-muted mt-0.5">
                        {formatPrice(item.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(q) => updateQuantity(item.productId, q, item.variationId)}
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.variationId)}
                          className="font-sans text-sm text-muted hover:text-text underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-sans font-medium text-text">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Summary card - same style as checkout */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-none border border-[#e0ddd9] p-6">
              <h2 className="font-sans text-lg font-bold text-text mb-4">
                Summary
              </h2>
              <div className="space-y-2 font-sans text-sm border-t border-[#d0cdc9] pt-4">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span>{formatPrice(shippingEstimate)}</span>
                </div>
                <div className="flex justify-between font-bold text-text pt-2 border-t border-[#d0cdc9]">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              {subtotal < 50 && (
                <p className="font-sans text-xs text-muted mt-2">
                  Add {formatPrice(50 - subtotal)} more for free shipping.
                </p>
              )}
              <Link
                href="/checkout"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-none bg-[#D0F198] text-[#2A2B2A] py-3.5 font-sans text-sm font-bold hover:opacity-90"
              >
                Proceed to checkout
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/products"
                className="block text-center font-sans text-sm text-muted hover:text-text mt-4"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
