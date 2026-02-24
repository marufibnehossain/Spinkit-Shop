import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/data";

interface FeaturedProductsBannerProps {
  products: Product[];
}

const BG_IMAGE = "/images/featured-product.png";

export default function FeaturedProductsBanner({ products }: FeaturedProductsBannerProps) {
  const [product1, product2] = products.slice(0, 2);
  const hasTwo = product1 && product2;

  return (
    <section
      className="relative min-h-[420px] md:min-h-[500px] overflow-hidden"
      aria-labelledby="featured-products-banner-heading"
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <Image
          src={BG_IMAGE}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden />
      </div>

      {/* Slide indicator — top-left blue box */}
      <div
        className="absolute top-6 left-6 z-10 w-10 h-10 bg-[#2050FC] flex items-center justify-center rounded-none"
        aria-hidden
      >
        <span className="font-sans text-white text-xs font-medium">01</span>
      </div>

      {/* Overlaid lime product cards — lower right */}
      <div className="relative z-10 mx-auto max-w-[1312px] px-4 md:px-6 flex flex-col items-end justify-end min-h-[420px] md:min-h-[500px] pb-8 md:pb-12">
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg sm:max-w-none sm:w-auto sm:ml-auto">
          {product1 && (
            <Link
              href={`/product/${product1.slug}`}
              className="flex items-center gap-4 bg-[#CFFF40] p-4 rounded-none w-full sm:w-[280px] shrink-0 hover:opacity-95 transition-opacity"
            >
              <div className="relative w-20 h-20 shrink-0 bg-white/60 overflow-hidden rounded-none">
                <Image
                  src={product1.images[0] ?? "/images/placeholder.svg"}
                  alt={product1.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-sans font-bold text-text text-sm truncate">
                  {product1.name}
                </h3>
                <p className="font-sans text-xs text-muted mt-0.5">Starting at</p>
                <p className="font-sans font-bold text-text text-sm mt-0.5">
                  €{product1.price.toFixed(2)}
                </p>
              </div>
            </Link>
          )}
          {product2 && (
            <Link
              href={`/product/${product2.slug}`}
              className="flex items-center gap-4 bg-[#CFFF40] p-4 rounded-none w-full sm:w-[280px] shrink-0 hover:opacity-95 transition-opacity"
            >
              <div className="relative w-20 h-20 shrink-0 bg-white/60 overflow-hidden rounded-none">
                <Image
                  src={product2.images[0] ?? "/images/placeholder.svg"}
                  alt={product2.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-sans font-bold text-text text-sm truncate">
                  {product2.name}
                </h3>
                <p className="font-sans text-xs text-muted mt-0.5">Starting at</p>
                <p className="font-sans font-bold text-text text-sm mt-0.5">
                  €{product2.price.toFixed(2)}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Hidden heading for a11y */}
      <h2 id="featured-products-banner-heading" className="sr-only">
        Featured products
      </h2>
    </section>
  );
}
