"use client";

import { useState, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrencyStore } from "@/lib/currency-store";
import type { CategoryWithChildren } from "@/lib/products";

interface SidebarFiltersProps {
  categoryTree: CategoryWithChildren[];
  priceRange: { min: number; max: number };
  /** Called after applying a filter (e.g. to close mobile off-canvas) */
  onApply?: () => void;
}

function containsSlug(node: CategoryWithChildren, slug: string): boolean {
  if (node.slug === slug) return true;
  return node.children.some((c) => containsSlug(c, slug));
}

function CategoryItem({
  category,
  currentCategory,
  setCategory,
}: {
  category: CategoryWithChildren;
  currentCategory: string;
  setCategory: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = category.children.length > 0;
  const value = category.slug;
  const active = currentCategory === value;
  const isParentOfActive = hasChildren && containsSlug(category, currentCategory);

  // Auto-expand if this category or a descendant is active
  useEffect(() => {
    if (active || isParentOfActive) setExpanded(true);
  }, [active, isParentOfActive]);

  return (
    <li>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setCategory(value)}
          className={`flex-1 text-left py-1.5 ${
            active ? "font-semibold text-text" : "text-muted hover:text-text"
          }`}
        >
          {category.name}
        </button>
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="p-0.5 text-muted hover:text-text shrink-0"
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${expanded ? "rotate-90" : ""}`}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ) : null}
      </div>
      {hasChildren && expanded && (
        <ul className="ml-5 mt-0.5 space-y-0.5 border-l border-border pl-3">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              currentCategory={currentCategory}
              setCategory={setCategory}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function SidebarFilters({ categoryTree, priceRange, onApply }: SidebarFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  useCurrencyStore((s) => s.currency);
  const formatPriceCompact = useCurrencyStore((s) => s.formatPriceCompact);
  const currentCategory = searchParams.get("category") ?? "";
  const minFromQuery = searchParams.get("minPrice");
  const maxFromQuery = searchParams.get("maxPrice");

  const absoluteMin = Math.floor(priceRange.min);
  const absoluteMax = Math.ceil(priceRange.max);

  const currentMin =
    minFromQuery !== null && !Number.isNaN(Number(minFromQuery))
      ? Math.max(absoluteMin, Math.min(Number(minFromQuery), absoluteMax))
      : absoluteMin;
  const currentMax =
    maxFromQuery !== null && !Number.isNaN(Number(maxFromQuery))
      ? Math.min(absoluteMax, Math.max(Number(maxFromQuery), absoluteMin))
      : absoluteMax;

  const [priceValue, setPriceValue] = useState<[number, number]>([currentMin, currentMax]);

  // Keep local slider state in sync with URL params
  useEffect(() => {
    setPriceValue([currentMin, currentMax]);
  }, [currentMin, currentMax]);

  function setCategory(value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === currentCategory) next.delete("category");
    else next.set("category", value);
    next.delete("page");
    router.push(`/products?${next.toString()}`, { scroll: false });
    onApply?.();
  }

  function setPriceRange(min: number, max: number) {
    const next = new URLSearchParams(searchParams.toString());
    const clampedMin = Math.max(absoluteMin, Math.min(min, max));
    const clampedMax = Math.min(absoluteMax, Math.max(max, clampedMin));

    if (clampedMin <= absoluteMin) {
      next.delete("minPrice");
    } else {
      next.set("minPrice", String(clampedMin));
    }

    if (clampedMax >= absoluteMax) {
      next.delete("maxPrice");
    } else {
      next.set("maxPrice", String(clampedMax));
    }

    next.delete("page");
    router.push(`/products?${next.toString()}`, { scroll: false });
    onApply?.();
  }

  return (
    <aside className="space-y-8">
      {/* Categories */}
      <div>
        <h2 className="font-sans text-xs font-semibold uppercase tracking-wide text-muted mb-3">
          Categories
        </h2>
        <ul className="space-y-1 font-sans text-sm">
          {categoryTree.map((cat) => (
            <CategoryItem
              key={cat.id}
              category={cat}
              currentCategory={currentCategory}
              setCategory={setCategory}
            />
          ))}
        </ul>
      </div>

      {/* Price filter */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-sans text-sm font-semibold text-text">Price</h2>
          <span className="font-sans text-xs text-muted">
            {formatPriceCompact(priceValue[0])} – {formatPriceCompact(priceValue[1])}
          </span>
        </div>
        {/* Radix dual-thumb slider */}
        <Slider.Root
          className="relative flex items-center w-full h-6"
          min={absoluteMin}
          max={absoluteMax}
          step={1}
          value={priceValue}
          onValueChange={(val) => {
            if (!Array.isArray(val) || val.length !== 2) return;
            setPriceValue([val[0], val[1]]);
          }}
          onValueCommit={(val) => {
            if (!Array.isArray(val) || val.length !== 2) return;
            setPriceRange(val[0], val[1]);
          }}
          aria-label="Price range"
        >
          <Slider.Track className="relative h-[4px] w-full rounded-full bg-[#e5e7eb]">
            <Slider.Range className="absolute h-[4px] rounded-full bg-[#7546ff]" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 rounded-full border-2 border-[#7546ff] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7546ff]/40" />
          <Slider.Thumb className="block w-4 h-4 rounded-full border-2 border-[#7546ff] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7546ff]/40" />
        </Slider.Root>
      </div>
    </aside>
  );
}

