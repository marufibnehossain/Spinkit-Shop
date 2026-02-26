"use client";

import { useState, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useRouter, useSearchParams } from "next/navigation";

interface SidebarFiltersProps {
  categories: { id: string; name: string; slug?: string }[];
  priceRange: { min: number; max: number };
}

export default function SidebarFilters({ categories, priceRange }: SidebarFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") ?? "all";
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
    if (value === "all") next.delete("category");
    else next.set("category", value);
    router.push(`/products?${next.toString()}`, { scroll: false });
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

    router.push(`/products?${next.toString()}`, { scroll: false });
  }

  return (
    <aside className="space-y-8">
      {/* Categories */}
      <div>
        <h2 className="font-sans text-xs font-semibold uppercase tracking-wide text-muted mb-3">
          Categories
        </h2>
        <ul className="space-y-1 font-sans text-sm">
          <li>
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`w-full text-left py-1.5 ${
                currentCategory === "all"
                  ? "font-semibold text-text"
                  : "text-muted hover:text-text"
              }`}
            >
              All
            </button>
          </li>
          {categories.map((cat) => {
            const value = cat.slug ?? cat.id;
            const active = currentCategory === value;
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => setCategory(value)}
                  className={`w-full text-left py-1.5 ${
                    active ? "font-semibold text-text" : "text-muted hover:text-text"
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price filter */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-sans text-sm font-semibold text-text">Price</h2>
          <span className="font-sans text-xs text-muted">
            €{priceValue[0]} – €{priceValue[1]}
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
            <Slider.Range className="absolute h-[4px] rounded-full bg-[#2563eb]" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 rounded-full border-2 border-[#2563eb] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40" />
          <Slider.Thumb className="block w-4 h-4 rounded-full border-2 border-[#2563eb] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40" />
        </Slider.Root>
      </div>
    </aside>
  );
}

