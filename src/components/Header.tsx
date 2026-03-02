"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import WishlistHeartIcon from "@/components/WishlistHeartIcon";
import SearchModal from "@/components/SearchModal";
import { useCurrencyStore, type Currency } from "@/lib/currency-store";

type HeaderVariant = "transparent" | "solid";

interface HeaderProps {
  variant?: HeaderVariant;
}

const mobileNavLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

type CategoryItem = { id: string; name: string; slug: string; parentId: string | null };
type CategoryWithChildren = CategoryItem & { children: CategoryWithChildren[] };

function buildCategoryTree(categories: CategoryItem[]): CategoryWithChildren[] {
  const byParentId = new Map<string, CategoryItem[]>();
  for (const c of categories) {
    if (c.parentId) {
      if (!byParentId.has(c.parentId)) byParentId.set(c.parentId, []);
      byParentId.get(c.parentId)!.push(c);
    }
  }
  function addChildren(item: CategoryItem): CategoryWithChildren {
    const children = (byParentId.get(item.id) ?? []).map(addChildren);
    return { ...item, children };
  }
  const roots = categories.filter((c) => !c.parentId);
  return roots.map(addChildren);
}

const TOP_NAV_SLUGS = ["rubbers", "blades", "bats", "balls", "accessories", "tables-and-nets"];
const MORE_NAV_SLUGS = ["cleaners-glue", "luggages", "robots", "clubs", "padel"];

function CartCount() {
  const total = useCartStore((s) => s.getTotalItems());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || total === 0) return null;
  return (
    <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] rounded-full bg-[#CFFF40] text-[#2A2B2A] text-xs font-sans flex items-center justify-center px-1">
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
    <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] rounded-full bg-[#CFFF40] text-[#2A2B2A] text-xs font-sans flex items-center justify-center px-1">
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

function MobileCategoryLinks({ onClose }: { onClose: () => void }) {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: CategoryItem[]) => setCategories(buildCategoryTree(data)))
      .catch(() => setCategories([]));
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="border-t border-border pt-4 mt-4">
      <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted mb-2">Categories</p>
      <div className="space-y-1">
        <Link href="/products" className="block py-2 font-sans text-sm text-text hover:text-muted" onClick={onClose}>
          All Products
        </Link>
        {categories.map((parent) => (
          <div key={parent.id}>
            <Link
              href={`/products?category=${parent.slug}`}
              className="block py-2 font-sans text-sm font-medium text-text hover:text-muted"
              onClick={onClose}
            >
              {parent.name}
            </Link>
            {parent.children.length > 0 && (
              <div className="pl-4 space-y-1">
                {parent.children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/products?category=${child.slug}`}
                    className="block py-1.5 font-sans text-sm text-muted hover:text-text"
                    onClick={onClose}
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NestedCategoryMenu({
  item,
  onClose,
  ChevronDown,
}: {
  item: CategoryWithChildren;
  onClose: () => void;
  ChevronDown: React.ReactNode;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="py-1" onMouseLeave={() => setHoveredId(null)}>
      <Link
        href={`/products?category=${item.slug}`}
        className="block px-4 py-2 font-sans text-sm font-medium text-text hover:bg-[#f5f5f5]"
        onClick={onClose}
      >
        All {item.name}
      </Link>
      {item.children.map((child) => {
        const childHasChildren = child.children.length > 0;
        const isHovered = hoveredId === child.id;
        return (
          <div
            key={child.id}
            className="relative"
            onMouseEnter={() => setHoveredId(child.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {childHasChildren ? (
              <>
                <div className="flex items-center justify-between px-4 py-2 font-sans text-sm text-text hover:bg-[#f5f5f5] cursor-default">
                  {child.name}
                  <span className="shrink-0">{ChevronDown}</span>
                </div>
                {isHovered && (
                  <div className="absolute left-full top-0 ml-0 min-w-[200px] rounded-lg border border-border bg-white shadow-lg z-50">
                    <NestedCategoryMenu item={child} onClose={onClose} ChevronDown={ChevronDown} />
                  </div>
                )}
              </>
            ) : (
              <Link
                href={`/products?category=${child.slug}`}
                className="block px-4 py-2 font-sans text-sm text-muted hover:text-text hover:bg-[#f5f5f5]"
                onClick={onClose}
              >
                {child.name}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}

function NavWithCategories({
  textColor,
  iconHover,
}: {
  textColor: string;
  iconHover: string;
}) {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: CategoryItem[]) => setCategories(buildCategoryTree(data)))
      .catch(() => setCategories([]));
  }, []);

  const ChevronDown = (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  const topNav = TOP_NAV_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean) as CategoryWithChildren[];
  const moreNav = MORE_NAV_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean) as CategoryWithChildren[];

  const renderTopItem = (item: CategoryWithChildren) => {
    const hasChildren = item.children.length > 0;
    const isOpen = openDropdown === item.id;
    return (
      <div
        key={item.id}
        className="relative"
        onMouseEnter={hasChildren ? () => setOpenDropdown(item.id) : undefined}
        onMouseLeave={hasChildren ? () => setOpenDropdown(null) : undefined}
      >
        {hasChildren ? (
          <>
            <button
              type="button"
              className={`font-sans text-sm py-0.5 inline-flex items-center gap-1 ${textColor} ${iconHover}`}
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              {item.name}
              <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>{ChevronDown}</span>
            </button>
            {isOpen && (
              <div className="absolute left-0 top-full min-w-[180px] rounded-lg border border-border bg-white shadow-lg z-50 py-1">
                <Link
                  href={`/products?category=${item.slug}`}
                  className="block px-4 py-2 font-sans text-sm font-medium text-text hover:bg-[#f5f5f5]"
                >
                  All {item.name}
                </Link>
                {item.children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/products?category=${child.slug}`}
                    className="block px-4 py-2 font-sans text-sm text-muted hover:text-text hover:bg-[#f5f5f5]"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <Link href={`/products?category=${item.slug}`} className={`font-sans text-sm ${textColor} ${iconHover}`}>
            {item.name}
          </Link>
        )}
      </div>
    );
  };

  return (
    <nav
      className="hidden lg:flex items-center gap-6 lg:gap-8"
      aria-label="Main navigation"
    >
      {topNav.map(renderTopItem)}
      {moreNav.length > 0 && (
        <div
          className="relative"
          onMouseEnter={() => setOpenDropdown("more")}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <button
            type="button"
            className={`font-sans text-sm py-0.5 inline-flex items-center gap-1 ${textColor} ${iconHover}`}
            aria-expanded={openDropdown === "more"}
            aria-haspopup="true"
          >
            More
            <span className={`transition-transform ${openDropdown === "more" ? "rotate-180" : ""}`}>{ChevronDown}</span>
          </button>
          {openDropdown === "more" && (
            <div className="absolute left-0 top-full min-w-[200px] rounded-lg border border-border bg-white shadow-lg z-50">
              {moreNav.map((item) => {
                const hasChildren = item.children.length > 0;
                return (
                  <div key={item.id} className="relative">
                    {hasChildren ? (
                      <NestedCategoryMenu
                        item={item}
                        onClose={() => setOpenDropdown(null)}
                        ChevronDown={ChevronDown}
                      />
                    ) : (
                      <Link
                        href={`/products?category=${item.slug}`}
                        className="block px-4 py-2 font-sans text-sm text-text hover:bg-[#f5f5f5]"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default function Header({ variant = "solid" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
          {/* Left: logo */}
          <Link href="/" className="shrink-0 hover:opacity-90 transition-opacity">
            <Image
              src={isTransparent ? "/images/spinkit-shop-logo.png" : "/images/spinkit-shop-Lemon.png"}
              alt="Spinkit.Shop"
              width={150}
              height={36}
              className="w-[150px] h-auto object-contain"
              priority
            />
          </Link>

          {/* Center: desktop nav */}
          <div className="hidden lg:flex flex-1 justify-center">
            <NavWithCategories textColor={textColor} iconHover={iconHover} />
          </div>

          {/* Right: currency + icons */}
          <div className="flex items-center gap-4">
            <CurrencySwitcher textColor={textColor} iconHover={iconHover} />

            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
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
            </button>
            <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

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
              <WishlistHeartIcon size={20} />
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
              className={`lg:hidden p-2 ${textColor} ${iconHover}`}
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile offcanvas */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
        {/* Panel */}
        <aside
          className={`fixed top-0 right-0 bottom-0 w-[min(320px,85vw)] bg-white shadow-xl z-[61] flex flex-col transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-sans text-sm font-medium text-text">Menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="p-2 text-text hover:text-muted"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Mobile navigation">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 font-sans text-sm text-text hover:text-muted"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile: category links */}
            <MobileCategoryLinks onClose={() => setMenuOpen(false)} />
            <div className="border-t border-border my-4" />
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="flex items-center gap-3 py-3 font-sans text-sm text-text hover:text-muted w-full text-left"
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
              Search
            </button>
            <Link
              href="/account"
              className="flex items-center gap-3 py-3 font-sans text-sm text-text hover:text-muted"
              onClick={() => setMenuOpen(false)}
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
              Account
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center gap-3 py-3 font-sans text-sm text-text hover:text-muted"
              onClick={() => setMenuOpen(false)}
            >
              <span className="relative inline-flex">
                <WishlistHeartIcon size={20} />
                <WishlistCount />
              </span>
              Wishlist
            </Link>
          </nav>
        </aside>
      </div>
    </header>
  );
}

