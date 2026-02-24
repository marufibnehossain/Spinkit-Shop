"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface SidebarFiltersProps {
  categories: { id: string; name: string; slug?: string }[];
}

export default function SidebarFilters({ categories }: SidebarFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") ?? "all";

  function setCategory(value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === "all") next.delete("category");
    else next.set("category", value);
    router.push(`/products?${next.toString()}`);
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

      {/* Additional filters: headings only for now */}
      {["Manufacturer", "Promotion", "Type", "Usage", "Price"].map((label) => (
        <div key={label} className="border-t border-border pt-4">
          <button
            type="button"
            className="w-full flex items-center justify-between font-sans text-sm text-text hover:text-muted"
            aria-label={`${label} filter`}
          >
            <span>{label}</span>
            <span aria-hidden>+</span>
          </button>
        </div>
      ))}
    </aside>
  );
}

