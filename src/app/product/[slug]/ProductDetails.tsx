"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import type { Product, ProductVariation } from "@/lib/data";
import RatingStars from "@/components/RatingStars";
import Accordion from "@/components/Accordion";
import VariationSelector from "./VariationSelector";
import AddToCartButton from "./AddToCartButton";
import FormatPrice from "@/components/FormatPrice";
import { useWishlistStore } from "@/lib/wishlist-store";
import WishlistHeartIcon from "@/components/WishlistHeartIcon";

interface ProductDetailsProps {
  product: Product;
  selectedVariation?: ProductVariation | null;
  selectedAttributes?: Record<string, string>;
  onVariationChange?: (variation: ProductVariation | null, attrs: Record<string, string>) => void;
}

export default function ProductDetails({
  product,
  selectedVariation: externalVariation,
  selectedAttributes: externalAttributes,
  onVariationChange,
}: ProductDetailsProps) {
  const [internalVariation, setInternalVariation] = useState<ProductVariation | null>(null);
  const [internalAttributes, setInternalAttributes] = useState<Record<string, string>>({});

  const selectedVariation = externalVariation ?? internalVariation;
  const selectedAttributes = externalAttributes ?? internalAttributes;
  const { data: session } = useSession();
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const img = product.images[0] ?? "/images/placeholder.svg";

  async function handleWishlist() {
    const item = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: img,
    };
    const adding = !isInWishlist;
    toggleWishlist(item);
    if (session) {
      try {
        if (adding) {
          await fetch("/api/account/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.id }),
          });
        } else {
          await fetch(
            `/api/account/wishlist?productId=${encodeURIComponent(product.id)}`,
            { method: "DELETE" }
          );
        }
      } catch (_) {}
    }
  }

  function handleVariationChange(variation: ProductVariation | null, attrs: Record<string, string>) {
    if (onVariationChange) {
      onVariationChange(variation, attrs);
    } else {
      setInternalVariation(variation);
      setInternalAttributes(attrs);
    }
  }

  const currentPrice = selectedVariation?.price ?? product.price;
  const unlimitedStock = product.trackInventory !== true;
  const currentStock = unlimitedStock ? 999 : (selectedVariation?.stock ?? product.stock);

  const accordionItems = [
    {
      title: "Description",
      content: product.longDesc ?? product.shortDesc,
    },
    {
      title: "More information",
      content:
        product.ingredients || product.howToUse
          ? [product.ingredients, product.howToUse].filter(Boolean).join("\n\n")
          : product.attributes?.length
            ? product.attributes.map((a) => `${a.name}: ${a.values.join(", ")}`).join("\n\n")
            : "For detailed specifications, sizing advice, or help choosing the right setup, get in touch with our team and we'll be happy to help.",
    },
    {
      title: "Materials & care",
      content:
        "Store your equipment in a dry place away from direct sunlight. Clean surfaces with a soft, slightly damp cloth and avoid harsh chemicals to keep performance consistent.",
    },
  ];

  const urgentStock = !unlimitedStock && currentStock > 0 && currentStock <= 5;
  const stockText = unlimitedStock
    ? "In stock"
    : currentStock === 0
      ? "Out of stock"
      : urgentStock
        ? `Only ${currentStock} stocks left`
        : "In stock";

  return (
    <div className="lg:sticky lg:top-24">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {product.category && (
          <span className="inline-flex items-center rounded px-2.5 py-0.5 bg-[#CFFF40] font-sans text-[11px] font-medium uppercase tracking-[0.08em] text-text">
            {product.category.replace(/-/g, " ")}
          </span>
        )}
        {product.productCode && (
          <p className="font-sans text-[11px] text-muted mt-0.5">{product.productCode}</p>
        )}
      </div>
      <h1 className="font-sans text-2xl md:text-3xl font-medium text-text">
        {product.name}
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        {product.reviewCount > 0 && (
          <span className="font-sans text-xs text-muted">
            {product.reviewCount} review{product.reviewCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      <p className="mt-3 font-sans text-2xl md:text-3xl font-semibold text-text">
        <FormatPrice price={currentPrice} />
      </p>
      {product.compareAt != null && (
        <p className="mt-1 font-sans text-sm text-muted line-through">
          <FormatPrice price={product.compareAt} />
        </p>
      )}
      <p
        className={`mt-1 flex items-center gap-2 font-sans text-sm ${
          unlimitedStock || currentStock > 5
            ? "text-muted"
            : currentStock === 0
              ? "text-red-600"
              : "text-amber-600"
        }`}
      >
        {currentStock > 0 && (
          <span
            className="inline-block h-2 w-2 rounded-full bg-black"
            aria-hidden
          />
        )}
        {stockText}
      </p>
      <p className="mt-4 font-sans text-muted leading-relaxed text-sm">
        {product.shortDesc}
      </p>

      <div className="mt-5 pt-4 border-t border-border space-y-4">
        {product.attributes && product.attributes.length > 0 && product.variations && product.variations.length > 0 ? (
          <>
            <VariationSelector
              attributes={product.attributes}
              variations={product.variations}
              basePrice={product.price}
              baseImages={product.images.length ? product.images : ["/images/placeholder.svg"]}
              onVariationChange={handleVariationChange}
            />
            <div>
              <p className="font-sans text-sm font-medium text-text mb-2">Quantity</p>
              <div className="flex w-full items-center gap-3">
                <AddToCartButton
                  product={product}
                  selectedVariation={selectedVariation}
                  selectedAttributes={selectedAttributes}
                  hideStockLabel
                />
                <button
                  type="button"
                  onClick={handleWishlist}
                  className="h-11 w-11 shrink-0 rounded-lg border border-border bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <WishlistHeartIcon filled={isInWishlist} size={20} className="text-[#2A2B2A]" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="font-sans text-sm font-medium text-text mb-2">Quantity</p>
            <div className="flex w-full items-center gap-3">
              <AddToCartButton product={product} hideStockLabel />
              <button
                type="button"
                onClick={handleWishlist}
                className="h-11 w-11 shrink-0 rounded-lg border border-border bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <WishlistHeartIcon filled={isInWishlist} size={20} className="text-[#2A2B2A]" />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-6">
        <Accordion items={accordionItems} />
      </div>
    </div>
  );
}
