"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/data";

interface BestSellersCarouselProps {
  products: Product[];
}

export default function BestSellersCarousel({ products }: BestSellersCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnapList, setScrollSnapList] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnapList(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!products.length) return null;

  return (
    <div className="w-full">
      <div className="overflow-hidden py-3" ref={emblaRef}>
        <div className="flex gap-4 md:gap-6 touch-pan-y">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_calc(50%-8px)] md:flex-[0_0_calc(25%-18px)]"
            >
              <ProductCard product={product} variant="bestSellers" />
            </div>
          ))}
        </div>
      </div>
      {/* Indicator bar: blue under current position, grey track */}
      <div className="mt-6 flex w-full">
        <div
          className="h-1.5 bg-[#2050FC] rounded-none shrink-0 transition-[flex-basis] duration-300"
          style={{
            flexBasis: scrollSnapList.length
              ? `${(100 / scrollSnapList.length) * (selectedIndex + 1)}%`
              : "25%",
          }}
          aria-hidden
        />
        <div className="h-0.5 bg-muted/40 rounded-none flex-1 self-center" aria-hidden />
      </div>
    </div>
  );
}
