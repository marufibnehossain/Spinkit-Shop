import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/products";
import {
  getFeaturedProducts,
  getProducts,
  filterTags,
  type Product,
} from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import HomeHero from "@/components/HomeHero";
import DiscoverCategoriesSection from "@/components/DiscoverCategoriesSection";
import PassionQualitySection from "@/components/PassionQualitySection";
import BestSellersCarousel from "@/components/BestSellersCarousel";
import ServicesSection from "@/components/ServicesSection";
import PerformanceEditSection from "@/components/PerformanceEditSection";
import FeaturedProductsBanner from "@/components/FeaturedProductsBanner";
import InsightsSection from "@/components/InsightsSection";
import HomeFAQSection from "@/components/HomeFAQSection";

interface HomePageProps {
  searchParams?: { category?: string; tag?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const featured = await getFeaturedProducts();
  const allProducts = await getProducts();
  const dbCategories = await getCategories();

  // Build category tiles: up to 6 parent categories with the highest product counts.
  const productCounts = new Map<string, number>();
  for (const product of allProducts) {
    const slug = product.category;
    if (!slug) continue;
    productCounts.set(slug, (productCounts.get(slug) ?? 0) + 1);
  }

  const parentCategories = dbCategories.filter((c) => !c.parentId);
  const sortedParents = parentCategories
    .map((c) => ({
      ...c,
      productCount: productCounts.get(c.slug) ?? 0,
    }))
    .sort((a, b) => b.productCount - a.productCount);

  const topParents = sortedParents.slice(0, 6);

  const categoryTiles =
    topParents.length > 0
      ? topParents.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          image: c.image ?? null,
        }))
      : filterTags.map((t) => ({ id: t.id, name: t.name, slug: t.slug, image: null as string | null }));
  const newArrivalsProducts = allProducts.slice(0, 8);
  const featuredIds = new Set(featured.map((p) => p.id));
  const bestSellersProducts =
    featured.length >= 8
      ? featured.slice(0, 8)
      : [...featured, ...allProducts.filter((p) => !featuredIds.has(p.id))].slice(0, 8);
  return (
    <>
      {/* Hero */}
      <HomeHero />

      {/* 2. Discover Equipment Categories — 2x3 category tiles */}
      <DiscoverCategoriesSection categories={categoryTiles} />

      {/* 3. New Arrivals — 4x2 grid, lime footer cards */}
      <section className="bg-bg py-[50px]" aria-labelledby="new-arrivals-heading">
        <div className="mx-auto max-w-[1312px] px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 mb-8 md:mb-10">
            <h2
              id="new-arrivals-heading"
              className="font-display text-2xl md:text-3xl font-bold uppercase text-[#2050FC]"
            >
              New Arrivals
            </h2>
            <Link
              href="/products"
              className="font-sans text-sm text-text underline hover:no-underline shrink-0"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivalsProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} variant="newArrivals" />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Passion for Table Tennis / Commitment to Quality — image + copy */}
      <PassionQualitySection />

      {/* 5. Best Sellers — carousel, at least 8 products */}
      <section className="py-[50px]" aria-labelledby="best-sellers-heading">
        <div className="mx-auto max-w-[1312px] px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 mb-8 md:mb-10">
            <h2
              id="best-sellers-heading"
              className="font-display text-2xl md:text-3xl font-bold text-[#2050FC]"
            >
              Best Sellers
            </h2>
            <Link
              href="/products"
              className="font-sans text-sm text-text underline hover:no-underline shrink-0"
            >
              View all
            </Link>
          </div>
          <BestSellersCarousel products={bestSellersProducts} />
        </div>
      </section>

      {/* 6. Services — Fast returns, Quality, Delivery, Secure payments */}
      <ServicesSection />

      {/* 7. The Performance Edit — purple bg, two images, lime CTA */}
      <PerformanceEditSection />

      {/* 8. Featured products banner — bg image + two lime product cards */}
      <FeaturedProductsBanner
        products={
          featured.length >= 2
            ? featured.slice(0, 2)
            : [...featured, ...allProducts.filter((p) => !featured.some((f) => f.id === p.id))].slice(0, 2)
        }
      />

      {/* 9. Table Tennis Insights — blog/article cards */}
      <InsightsSection />

      {/* 10. Frequently Asked Questions — lime bg, accordion */}
      <HomeFAQSection />
    </>
  );
}
