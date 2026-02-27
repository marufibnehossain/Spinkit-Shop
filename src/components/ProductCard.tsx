"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Product } from "@/lib/data";
import RatingStars from "./RatingStars";
import FormatPrice from "./FormatPrice";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import WishlistHeartIcon from "@/components/WishlistHeartIcon";
import { useCartToastStore } from "@/lib/cart-toast-store";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "featured" | "newArrivals" | "bestSellers";
}

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { data: session } = useSession();
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const showToast = useCartToastStore((s) => s.showToast);
  const img = product.images[0] ?? "/images/placeholder.svg";
  const isFeatured = variant === "featured";
  const isNewArrivals = variant === "newArrivals";
  const isBestSellers = variant === "bestSellers";

  const outOfStock = product.trackInventory === true && product.stock <= 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: img,
      },
      1
    );
    showToast({
      name: product.name,
      price: product.price,
      image: img,
    });
  }

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const item = { productId: product.id, slug: product.slug, name: product.name, price: product.price, image: img };
    const adding = !isInWishlist;
    toggleWishlist(item);
    if (session) {
      try {
        if (adding) {
          await fetch("/api/account/wishlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id }) });
        } else {
          await fetch(`/api/account/wishlist?productId=${encodeURIComponent(product.id)}`, { method: "DELETE" });
        }
      } catch (_) {}
    }
  }

  // Default card style matches the New Arrivals lime design
  const useLimeCard = isNewArrivals || variant === "default";

  if (useLimeCard) {
    return (
      <article className="group rounded-none overflow-hidden bg-[#E9EBDD] shadow-[0_0_12px_rgba(0,0,0,0.06)]">
        <Link href={`/product/${product.slug}`} className="block">
          {/* Image area: light background, 310/320 aspect, no padding */}
          <div className="relative aspect-[310/320] overflow-hidden rounded-none bg-[#F7F7F0]">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWishlist(e);
              }}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <WishlistHeartIcon filled={isInWishlist} size={20} className="text-[#2A2B2A]" />
            </button>
            <Image
              src={img}
              alt={product.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          {/* Lime footer: name, price, bag icon */}
          <div className="flex items-center justify-between gap-3 bg-[#D6FC45] p-3 rounded-none">
            <div className="min-w-0 flex-1">
              <h3 className="font-sans text-sm font-normal text-text truncate">
                {product.name}
              </h3>
              <p className="font-sans text-base font-bold text-text mt-0.5">
                <FormatPrice price={product.price} compact />
              </p>
            </div>
            {outOfStock ? (
              <span className="shrink-0 font-sans text-sm font-medium text-muted">Out of stock</span>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(e);
                }}
                className="shrink-0 p-2 text-text hover:opacity-80 transition-opacity rounded-none"
                aria-label="Add to cart"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </button>
            )}
          </div>
        </Link>
      </article>
    );
  }

  if (isBestSellers) {
    return (
      <article className="rounded-none overflow-hidden flex flex-col h-full shadow-[0_0_12px_rgba(0,0,0,0.06)]">
        <Link href={`/product/${product.slug}`} className="block flex-1 flex flex-col">
          <div className="relative aspect-square w-full overflow-hidden bg-[#f7f7f2]">
            <Image
              src={img}
              alt={product.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
          <div className="px-4 py-4 text-left bg-[#f7f7f2] min-w-0">
            <h3 className="font-sans font-bold text-text text-base truncate" title={product.name}>
              {product.name}
            </h3>
            <p className="font-sans text-sm text-muted mt-1">Starting at</p>
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              <span className="font-sans font-bold text-text text-base">
                <FormatPrice price={product.price} compact />
              </span>
              {outOfStock && (
                <span className="font-sans text-sm font-medium text-muted">Out of stock</span>
              )}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group shadow-[0_0_12px_rgba(0,0,0,0.06)]">
      <Link href={`/product/${product.slug}`} className="block">
        {/* Upper section: light sage green background, product image */}
        <div
          className={`relative aspect-[3/4] overflow-hidden transition-colors ${
            isFeatured
              ? "bg-sage-1 border border-sage-2 rounded-none"
              : "bg-sage-1 border border-border rounded-none border-b-0 group-hover:border-text/20"
          }`}
        >
          <button
            type="button"
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center hover:bg-gray-50 transition-colors pointer-events-auto"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <WishlistHeartIcon filled={isInWishlist} size={20} className="text-[#2A2B2A]" />
          </button>
          {/* Badges: Sale, New, Bestseller */}
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
            {product.compareAt != null && product.compareAt > product.price && (
              <span className="rounded bg-red-600 px-2 py-0.5 font-sans text-xs font-medium text-white">
                Sale
              </span>
            )}
            {product.badge === "NEW" && (
              <span className="rounded bg-sage-dark px-2 py-0.5 font-sans text-xs font-medium text-white">
                New
              </span>
            )}
            {product.badge === "BESTSELLER" && (
              <span className="rounded bg-amber-600 px-2 py-0.5 font-sans text-xs font-medium text-white">
                Bestseller
              </span>
            )}
          </div>
          <Image
            src={img}
            alt={product.name}
            fill
            className="object-contain object-center p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Add to cart overlay – visible on hover; Out of stock when applicable */}
          {outOfStock ? (
            <div className="absolute inset-0 z-10 flex items-end p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="w-full rounded-lg border border-border bg-bg/90 px-5 py-2.5 font-sans text-sm font-medium text-muted text-center">
                Out of stock
              </span>
            </div>
          ) : (
            <div
              className="absolute inset-0 z-10 flex items-end p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none"
              aria-hidden
            >
              <button
                type="button"
                onClick={handleAddToCart}
                className="pointer-events-auto w-full rounded-lg border border-border bg-bg px-5 py-2.5 font-sans text-sm font-medium text-text shadow hover:bg-surface hover:border-text/30 transition-colors"
              >
                Add to cart
              </button>
            </div>
          )}
        </div>
        {/* Lower section: light background, name, price, rating */}
        <div
          className={`rounded-none border border-t-0 px-4 py-3 ${
            isFeatured
              ? "bg-surface border-sage-2 border-x border-b"
              : "bg-surface border-border border-x border-b group-hover:border-text/20"
          }`}
        >
          {isFeatured && product.productCode && (
            <p className="font-sans text-xs text-muted mb-0.5">{product.productCode}</p>
          )}
          <h3 className="font-sans text-sm font-medium text-text uppercase tracking-wide">
            {product.name}
          </h3>
            <div className="mt-1 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-base font-medium text-text">
                <FormatPrice price={product.price} compact />
              </span>
              {product.compareAt != null && (
                <span className="font-sans text-sm text-muted line-through">
                  <FormatPrice price={product.compareAt} compact />
                </span>
              )}
            </div>
            <RatingStars
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          </div>
        </div>
      </Link>
    </article>
  );
}
