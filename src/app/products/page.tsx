import Link from "next/link";
import { Suspense } from "react";
import { getProducts } from "@/lib/products";
import { categories } from "@/lib/data";
import type { Product } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import ProductsClient from "./ProductsClient";
import SidebarFilters from "./SidebarFilters";
import FiltersOffCanvas from "./FiltersOffCanvas";
import Pagination from "@/components/Pagination";

const PRODUCTS_PER_PAGE = 12;

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams?: { category?: string; sort?: string; minPrice?: string; maxPrice?: string; page?: string };
}

function sortProducts(items: Product[], sort?: string) {
  if (!sort) return items;
  const list = [...items];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
      return list; // server already returns by createdAt DESC
    case "rating":
      return list.sort((a, b) => b.rating - a.rating);
    default:
      return list;
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categorySlug = searchParams?.category ?? null;
  const allProducts = await getProducts();
  const baseFiltered =
    categorySlug && categorySlug !== "all"
      ? allProducts.filter((p) => p.category === categorySlug)
      : allProducts;

  const allPrices = allProducts.map((p) => p.price);
  const baseMinPrice = allPrices.length ? Math.min(...allPrices) : 0;
  const baseMaxPrice = allPrices.length ? Math.max(...allPrices) : 0;

  const minPriceParam = searchParams?.minPrice ? Number(searchParams.minPrice) : NaN;
  const maxPriceParam = searchParams?.maxPrice ? Number(searchParams.maxPrice) : NaN;

  const effectiveMin = !Number.isNaN(minPriceParam) ? Math.max(baseMinPrice, minPriceParam) : baseMinPrice;
  const effectiveMax = !Number.isNaN(maxPriceParam) ? Math.min(baseMaxPrice, maxPriceParam) : baseMaxPrice;

  const priceFiltered =
    allPrices.length === 0
      ? baseFiltered
      : baseFiltered.filter((p) => p.price >= effectiveMin && p.price <= effectiveMax);

  const sorted = sortProducts(priceFiltered, searchParams?.sort);
  const total = sorted.length;
  const pageParam = searchParams?.page ? Math.max(1, parseInt(searchParams.page, 10) || 1) : 1;
  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(pageParam, totalPages);
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = sorted.slice(start, start + PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen">
      {/* Main content: sidebar + (results bar + grid) */}
      <section className="py-[50px]">
        <div className="mx-auto max-w-[1315px] px-4 md:px-6 grid grid-cols-1 gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Sidebar — hidden on mobile, shown in off-canvas */}
          <div className="hidden lg:block">
            <h1 className="font-display text-xl md:text-2xl font-medium text-text mb-6">
              Shop All
            </h1>
            <Suspense fallback={<div className="h-40 animate-pulse bg-[#f0f0f0] rounded" />}>
              <SidebarFilters
                categories={categories}
                priceRange={{ min: baseMinPrice, max: baseMaxPrice }}
              />
            </Suspense>
          </div>
          <div>
            {/* Results bar: Shop All (mobile) + Filters button (mobile) + count + sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3 flex-wrap min-w-0">
                <Suspense fallback={<div className="h-10 w-20 bg-[#f0f0f0] rounded animate-pulse" />}>
                  <FiltersOffCanvas
                    categories={categories}
                    priceRange={{ min: baseMinPrice, max: baseMaxPrice }}
                  />
                </Suspense>
                <span className="font-sans text-sm text-muted hidden lg:inline">
                  {total > 0
                    ? `Showing ${start + 1}–${Math.min(start + PRODUCTS_PER_PAGE, total)} of ${total} Result${total !== 1 ? "s" : ""}`
                    : "No results"}
                </span>
              </div>
              <Suspense fallback={<div className="h-10 w-24 bg-[#f0f0f0] rounded animate-pulse" />}>
                <ProductsClient sort={searchParams?.sort} />
              </Suspense>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Suspense fallback={<div className="h-10 mt-10" />}>
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </Suspense>
            {sorted.length === 0 && (
              <div className="text-center py-16">
                <p className="font-sans text-muted">No products match this filter.</p>
                <Link
                  href="/products"
                  className="font-sans text-sage-dark hover:underline mt-2 inline-block"
                >
                  View all products
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
