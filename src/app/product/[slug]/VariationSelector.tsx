"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ProductAttribute, ProductVariation } from "@/lib/data";

interface VariationSelectorProps {
  attributes: ProductAttribute[];
  variations: ProductVariation[];
  basePrice: number;
  baseImages: string[];
  onVariationChange?: (variation: ProductVariation | null, selectedAttributes: Record<string, string>) => void;
}

export default function VariationSelector({
  attributes,
  variations,
  basePrice,
  baseImages,
  onVariationChange,
}: VariationSelectorProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [currentVariation, setCurrentVariation] = useState<ProductVariation | null>(null);

  // Reset when product/attributes change
  useEffect(() => {
    setSelectedAttributes({});
    setCurrentVariation(null);
  }, [attributes.map((a) => a.id).join(",")]);

  // Find matching variation when all attributes are selected
  useEffect(() => {
    const allSelected = attributes.every((attr) => selectedAttributes[attr.name]);
    const match =
      allSelected &&
      variations.find((v) =>
        Object.keys(selectedAttributes).every((key) => v.attributes[key] === selectedAttributes[key])
      );
    setCurrentVariation(match || null);
    onVariationChange?.(match || null, selectedAttributes);
  }, [selectedAttributes, variations, attributes, onVariationChange]);

  function handleAttributeChange(attrName: string, value: string) {
    setSelectedAttributes((prev) => ({ ...prev, [attrName]: value }));
  }

  const displayType = (attr: ProductAttribute) => attr.displayType ?? "button";

  return (
    <div className="space-y-3">
      {attributes.map((attr) => {
        const type = displayType(attr);
        const displayData = attr.displayData ?? {};
        return (
          <div key={attr.id}>
            <label className="block font-sans text-sm font-medium text-text mb-1.5">
              {attr.name}
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {attr.values.map((value) => {
                const isSelected = selectedAttributes[attr.name] === value;
                if (type === "swatch") {
                  const color = displayData[value] || "#cccccc";
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleAttributeChange(attr.name, value)}
                      className={`w-8 h-8 rounded-full border-2 shrink-0 transition-all ${
                        isSelected ? "border-sage-dark ring-2 ring-sage-2 ring-offset-2" : "border-border"
                      }`}
                      style={{ backgroundColor: color }}
                      title={value}
                      aria-label={`${attr.name}: ${value}`}
                      aria-pressed={isSelected}
                    />
                  );
                }
                if (type === "image") {
                  const imgUrl = displayData[value];
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleAttributeChange(attr.name, value)}
                      className={`relative w-10 h-10 rounded-full overflow-hidden border-2 shrink-0 transition-all ${
                        isSelected ? "border-sage-dark ring-2 ring-sage-2 ring-offset-2" : "border-border"
                      }`}
                      title={value}
                      aria-label={`${attr.name}: ${value}`}
                      aria-pressed={isSelected}
                    >
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={value}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center bg-[#e5e5e5] font-sans text-[10px] text-muted">
                          {value.slice(0, 1)}
                        </span>
                      )}
                    </button>
                  );
                }
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleAttributeChange(attr.name, value)}
                    className={`px-3 py-1.5 rounded-lg border font-sans text-sm transition-colors ${
                      isSelected
                        ? "border-sage-dark bg-sage-1 text-sage-dark"
                        : "border-border bg-bg text-text hover:border-text/30"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {currentVariation?.sku && (
        <p className="font-sans text-xs text-muted">SKU: {currentVariation.sku}</p>
      )}
    </div>
  );
}
