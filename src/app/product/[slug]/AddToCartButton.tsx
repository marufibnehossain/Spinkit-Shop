"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Product, ProductVariation } from "@/lib/data";
import { getStockLabel } from "@/lib/data";
import { useCartStore } from "@/lib/cart-store";
import { useCurrencyStore } from "@/lib/currency-store";
import { useCartToastStore } from "@/lib/cart-toast-store";
import QuantityStepper from "@/components/QuantityStepper";
import Button from "@/components/Button";

interface AddToCartButtonProps {
  product: Product;
  selectedVariation?: ProductVariation | null;
  selectedAttributes?: Record<string, string>;
  /** When true, hide the "In stock" / "X left" label (e.g. when shown above) */
  hideStockLabel?: boolean;
}

const UNLIMITED_STOCK = 999999;

export default function AddToCartButton({ product, selectedVariation, selectedAttributes, hideStockLabel }: AddToCartButtonProps) {
  useCurrencyStore((s) => s.currency);
  const formatPrice = useCurrencyStore((s) => s.formatPrice);
  const hasVariations = (product.attributes?.length ?? 0) > 0 && (product.variations?.length ?? 0) > 0;
  const mustSelectVariation = hasVariations && !selectedVariation;
  const currentPrice = selectedVariation?.price ?? product.price;
  const unlimitedStock = product.trackInventory !== true;
  const variationStock = selectedVariation?.stock ?? 0;
  const isVariationUnlimited = variationStock >= UNLIMITED_STOCK;
  const effectiveUnlimited = unlimitedStock || (hasVariations && isVariationUnlimited);
  const currentStock = effectiveUnlimited ? 999 : (selectedVariation?.stock ?? product.stock);
  const currentImages = selectedVariation?.images ?? product.images;
  const maxQty = effectiveUnlimited ? 999 : Math.max(0, currentStock);
  const [quantity, setQuantity] = useState(() => Math.min(1, maxQty));
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useCartToastStore((s) => s.showToast);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQuantity((q) => Math.min(q, maxQty));
  }, [maxQty]);

  function handleAdd() {
    if (mustSelectVariation) return;
    if (!effectiveUnlimited && currentStock <= 0) return;
    const qty = effectiveUnlimited ? quantity : Math.min(quantity, currentStock);
    const variationName = selectedVariation && selectedAttributes
      ? `${product.name} (${Object.values(selectedAttributes).join(", ")})`
      : product.name;
    const image = currentImages[0] ?? product.images[0] ?? "/images/placeholder.svg";
    addItem({
      productId: product.id,
      slug: product.slug,
      name: variationName,
      price: currentPrice,
      image,
      variationId: selectedVariation?.id,
      attributes: selectedAttributes,
    }, qty);
    showToast({ name: variationName, price: currentPrice, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  }

  const outOfStock = mustSelectVariation || (!effectiveUnlimited && currentStock <= 0);
  const stockLabel = effectiveUnlimited ? "In stock" : getStockLabel(currentStock);

  return (
    <div className="flex flex-1 min-w-0 flex-wrap items-center gap-3">
      {!outOfStock && !mustSelectVariation && (
        <QuantityStepper
          value={quantity}
          onChange={(v) => setQuantity(Math.min(Math.max(1, v), maxQty))}
          min={1}
          max={maxQty}
        />
      )}
      {added ? (
        <Link
          href="/cart"
          className="inline-flex items-center justify-center gap-2 font-sans text-sm md:text-base font-medium tracking-wide h-11 flex-1 min-w-0 !bg-[#D0F198] border border-[#D0F198] text-text hover:bg-[#D8FF70] rounded-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage-2 focus:ring-offset-2"
        >
          View cart
        </Link>
      ) : (
        <Button
          onClick={handleAdd}
          variant="primary"
          arrow={false}
          disabled={outOfStock}
          className="h-11 flex-1 min-w-0 !bg-[#D0F198] border border-[#D0F198] text-sm md:text-base font-medium hover:bg-[#D8FF70]"
        >
          {mustSelectVariation
            ? "Please select options"
            : outOfStock
              ? "Out of stock"
              : `Add to Cart - ${formatPrice(currentPrice)}`}
        </Button>
      )}
      {!hideStockLabel && (
        <span
          className={`font-sans text-sm ${outOfStock ? "text-red-600" : stockLabel === "Low stock" ? "text-amber-600" : "text-muted"}`}
        >
          {outOfStock ? "Out of stock" : stockLabel === "Low stock" ? `${currentStock} left` : "In stock"}
        </span>
      )}
    </div>
  );
}
