"use client";

import { useCurrencyStore } from "@/lib/currency-store";

interface FormatPriceProps {
  /** Price in EUR (base currency) */
  price: number;
  className?: string;
}

export default function FormatPrice({ price, className }: FormatPriceProps) {
  useCurrencyStore((s) => s.currency);
  const formatPrice = useCurrencyStore((s) => s.formatPrice);
  return <span className={className}>{formatPrice(price)}</span>;
}
