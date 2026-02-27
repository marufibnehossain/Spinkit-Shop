"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/data";
import FormatPrice from "./FormatPrice";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  /** For styling when header is transparent vs solid */
  textColor?: string;
}

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 1;

export default function SearchModal({ open, onClose, textColor = "text-[#2A2B2A]" }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim() || q.length < MIN_QUERY_LENGTH) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setResults([]);
    setLoading(false);
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      fetchResults(query);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, open, fetchResults]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center pt-[20vh] px-4"
      aria-modal="true"
      aria-label="Search products"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-none shadow-xl overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 ${textColor}`}
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 min-w-0 bg-transparent font-sans text-base text-[#2A2B2A] placeholder:text-muted focus:outline-none"
            autoComplete="off"
            aria-label="Search"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-muted hover:text-[#2A2B2A] transition-colors"
            aria-label="Close search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center">
              <p className="font-sans text-sm text-muted">Searching...</p>
            </div>
          ) : query.length < MIN_QUERY_LENGTH ? (
            <div className="py-12 text-center">
              <p className="font-sans text-sm text-muted">Type to search products</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-sans text-sm text-muted">No products found for &quot;{query}&quot;</p>
              <Link
                href="/products"
                onClick={onClose}
                className="font-sans text-sm text-sage-dark hover:underline mt-2 inline-block"
              >
                View all products
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {results.slice(0, 8).map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 hover:bg-[#f7f7f7] transition-colors"
                  >
                    <div className="relative w-12 h-12 shrink-0 rounded overflow-hidden bg-[#f5f5f5]">
                      <Image
                        src={product.images[0] ?? "/images/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-medium text-[#2A2B2A] truncate">
                        {product.name}
                      </p>
                      <p className="font-sans text-sm text-muted">
                        <FormatPrice price={product.price} compact />
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        {results.length > 8 && (
          <div className="border-t border-border px-4 py-3 text-center">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="font-sans text-sm font-medium text-sage-dark hover:underline"
            >
              View all {results.length} results
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
