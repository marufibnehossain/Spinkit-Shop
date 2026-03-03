import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import ProductWithVariations from "./ProductWithVariations";
import RelatedProductsCarousel from "./RelatedProductsCarousel";
import { RecordRecentlyViewed } from "./RecordRecentlyViewed";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }
  const title = `${product.name} | Spinkit`;
  const description = product.shortDesc.slice(0, 160);
  const image = product.images[0] ? (product.images[0].startsWith("http") ? product.images[0] : undefined) : undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(image && { images: [image] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spinkit-shop.com";
  const productUrl = `${baseUrl}/product/${product.slug}`;
  const imageUrl = product.images[0]
    ? product.images[0].startsWith("http")
      ? product.images[0]
      : `${baseUrl}${product.images[0]}`
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc,
    url: productUrl,
    ...(imageUrl && { image: imageUrl }),
    sku: product.productCode ?? product.id,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EUR",
      availability:
        product.trackInventory !== true || product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
        bestRating: 5,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main product section on warm beige background */}
      <section className="bg-[#F7F7F7]">
        <div className="mx-auto max-w-[1315px] px-4 md:px-6 py-8 md:py-12">
          <RecordRecentlyViewed slug={product.slug} />
          <div className="mt-6">
            <ProductWithVariations product={product} />
          </div>
        </div>
      </section>

      {/* You may also like — full-width band with boxed content */}
      {related.length > 0 && (
        <section className="bg-[#E9E6E3]">
          <div className="mx-auto max-w-[1315px] px-4 md:px-6 py-10 md:py-14">
            <div className="px-4 md:px-6 py-6 md:py-8">
              <h2 className="font-sans text-xl md:text-2xl font-bold text-text mb-6 md:mb-8">
                YOU MAY ALSO LIKE
              </h2>
              <RelatedProductsCarousel products={related.slice(0, 8)} />
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
