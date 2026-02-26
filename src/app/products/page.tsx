import Link from "next/link";
import { getProducts, getCategories } from "@/lib/products";
import { categories } from "@/lib/data";
import type { Product } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import ProductsClient from "./ProductsClient";
import SidebarFilters from "./SidebarFilters";

interface ProductsPageProps {
  searchParams?: { category?: string; sort?: string; minPrice?: string; maxPrice?: string };
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
  const visibleCount = Math.min(total, 12);

  return (
    <div className="min-h-screen">
      {/* Main content: sidebar + (results bar + grid) */}
      <section className="py-[50px]">
        <div className="mx-auto max-w-[1315px] px-4 md:px-6 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div>
            <h1 className="font-display text-xl md:text-2xl font-medium text-text mb-6">
              Shop All
            </h1>
            <SidebarFilters
              categories={categories}
              priceRange={{ min: baseMinPrice, max: baseMaxPrice }}
            />
          </div>
          <div>
            {/* Results bar + sort — above the product grid */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="font-sans text-sm text-muted">
                {total > 0
                  ? `Showing 1–${visibleCount} of ${total} Result${total !== 1 ? "s" : ""}`
                  : "No results"}
              </span>
              <ProductsClient sort={searchParams?.sort} />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
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
