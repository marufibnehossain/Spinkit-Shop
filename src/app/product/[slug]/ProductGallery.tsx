"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Product, ProductVariation } from "@/lib/data";

interface ProductGalleryProps {
  product: Product;
  selectedVariation?: ProductVariation | null;
}

export default function ProductGallery({ product, selectedVariation }: ProductGalleryProps) {
  const baseImages = product.images.length ? product.images : ["/images/placeholder.svg"];
  const variationImages = selectedVariation?.images;
  const displayImages = variationImages && variationImages.length > 0 ? variationImages : baseImages;
  const [mainImage, setMainImage] = useState(displayImages[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setMainImage(displayImages[0]);
    setCurrentIndex(0);
  }, [displayImages]);

  function goToImage(index: number) {
    const total = displayImages.length;
    if (!total) return;
    const next = (index + total) % total;
    setCurrentIndex(next);
    setMainImage(displayImages[next]);
  }

  function handlePrev() {
    goToImage(currentIndex - 1);
  }

  function handleNext() {
    goToImage(currentIndex + 1);
  }

  return (
    <div className="space-y-4 bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F7F2]">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-none bg-[#D0F198] text-text flex items-center justify-center hover:bg-[#D8FF70] transition-colors"
              aria-label="Previous image"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-none bg-[#D0F198] text-text flex items-center justify-center hover:bg-[#D8FF70] transition-colors"
              aria-label="Next image"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>
      {displayImages.length > 1 && (
        <div className="flex justify-center gap-2 pb-3">
          {displayImages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToImage(index)}
              className={`h-3 w-3 rounded-none transition-colors ${
                index === currentIndex ? "bg-[#CFFF40]" : "bg-[#E9E9E9]"
              }`}
              aria-label={`Go to image ${index + 1}`}
              aria-pressed={index === currentIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
}
