"use client";

import { useCurrencyStore } from "@/lib/currency-store";

interface FormatPriceProps {
  /** Price in EUR (base currency) */
  price: number;
  className?: string;
  /** When true, omit currency code (e.g. "€49.90" instead of "€49.90 EUR") */
  compact?: boolean;
}

export default function FormatPrice({ price, className, compact }: FormatPriceProps) {
  useCurrencyStore((s) => s.currency);
  const formatPrice = useCurrencyStore((s) => s.formatPrice);
  const formatPriceCompact = useCurrencyStore((s) => s.formatPriceCompact);
  const formatted = compact ? formatPriceCompact(price) : formatPrice(price);
  return <span className={className}>{formatted}</span>;
}
