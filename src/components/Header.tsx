"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useCurrencyStore, type Currency } from "@/lib/currency-store";

type HeaderVariant = "transparent" | "solid";

interface HeaderProps {
  variant?: HeaderVariant;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

function CartCount() {
  const total = useCartStore((s) => s.getTotalItems());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || total === 0) return null;
  return (
    <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] rounded-full bg-sage-dark text-hero-text text-xs font-sans flex items-center justify-center px-1">
      {total > 99 ? "99+" : total}
    </span>
  );
}

function WishlistCount() {
  const count = useWishlistStore((s) => s.items.length);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || count === 0) return null;
  return (
    <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] rounded-full bg-sage-dark text-hero-text text-xs font-sans flex items-center justify-center px-1">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function CurrencySwitcher({
  textColor,
  iconHover,
}: {
  textColor: string;
  iconHover: string;
}) {
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: Currency[] = ["EUR", "USD"];
  const symbols: Record<Currency, string> = { EUR: "€", USD: "$" };

  return (
    <div className="relative hidden md:block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 p-1.5 font-sans text-sm ${textColor} ${iconHover}`}
        aria-label="Currency"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {symbols[currency]} {currency}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-1 min-w-[80px] rounded-lg border border-border bg-bg py-1 shadow-lg z-50"
        >
          {options.map((c) => (
            <li key={c} role="option" aria-selected={currency === c}>
              <button
                type="button"
                onClick={() => {
                  setCurrency(c);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left font-sans text-sm hover:bg-sage-1 ${
                  currency === c ? "bg-sage-1 text-sage-dark font-medium" : "text-text"
                }`}
              >
                {symbols[c]} {c}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Header({ variant = "solid" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isTransparent = variant === "transparent";
  const textColor = isTransparent ? "text-white" : "text-text";
  const iconHover = isTransparent ? "hover:text-white/80" : "hover:text-muted";

  return (
    <header
      className={
        isTransparent
          ? "absolute top-0 left-0 right-0 z-50 bg-transparent text-white"
          : "sticky top-0 z-40 border-b border-border bg-[#E9E6E3]"
      }
    >
      <div className="mx-auto max-w-[1315px] px-4 md:px-6">
        <div className="flex h-14 md:h-16 items-center justify-between gap-4">
          {/* Left: desktop nav */}
          <nav
            className="hidden md:flex items-center gap-6 lg:gap-8"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-sans text-sm ${textColor} ${iconHover}`}
              >
                {link.label === "Shop" ? (
                  <span className="inline-flex items-center gap-1">
                    <span>{link.label}</span>
                    <span aria-hidden>▾</span>
                  </span>
                ) : (
                  link.label
                )}
              </Link>
            ))}
          </nav>

          {/* Center: brand */}
          <Link
            href="/"
            className={`font-sans text-lg md:text-xl font-semibold tracking-tight ${
              isTransparent ? "text-white hover:text-white/90" : "text-text hover:text-muted"
            }`}
          >
            Spinkit.Shop
          </Link>

          {/* Right: currency + icons */}
          <div className="flex items-center gap-4">
            <CurrencySwitcher textColor={textColor} iconHover={iconHover} />

            {/* Search */}
            <Link
              href="/search"
              className={`p-1.5 ${textColor} ${iconHover} hidden sm:inline-flex`}
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className={`p-1.5 ${textColor} ${iconHover} hidden sm:inline-flex`}
              aria-label="Account"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="8" r="2.5" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className={`p-1.5 pr-0 relative hidden sm:inline-flex ${textColor} ${iconHover}`}
              aria-label="Wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <WishlistCount />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className={`p-1.5 pr-0 relative inline-flex ${textColor} ${iconHover}`}
              aria-label="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <CartCount />
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className={`md:hidden p-2 ${textColor} ${iconHover}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              {menuOpen ? <span className="text-xl">×</span> : <span className="text-xl">☰</span>}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav
            className={`md:hidden border-t ${
              isTransparent ? "border-white/10" : "border-border"
            } pt-2 pb-4 space-y-1`}
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 font-sans text-sm ${
                  isTransparent ? "text-white hover:text-white/80" : "text-text hover:text-muted"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

