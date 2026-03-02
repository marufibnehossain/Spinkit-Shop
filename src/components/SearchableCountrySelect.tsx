"use client";

import { useState, useRef, useEffect } from "react";
import { COUNTRY_CODES } from "@/lib/country-codes";

interface SearchableCountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export default function SearchableCountrySelect({
  value,
  onChange,
  className = "",
}: SearchableCountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = COUNTRY_CODES.find((c) => c.code === value) ?? COUNTRY_CODES[0];
  const filtered = search.trim()
    ? COUNTRY_CODES.filter(
        (c) =>
          c.country.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search.replace(/^\+/, ""))
      )
    : COUNTRY_CODES;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full min-w-[77px] flex items-center justify-between gap-1 px-4 py-3 font-sans text-sm text-[#111827] focus:outline-none focus:ring-0"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected.code}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
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
        <div
          className="absolute left-0 top-full mt-1 z-50 min-w-[240px] max-h-[280px] overflow-hidden rounded-lg border border-[#2A2B2A99] bg-white shadow-lg flex flex-col"
          role="listbox"
        >
          <div className="p-2 border-b border-[#2A2B2A33]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full px-3 py-2 rounded border border-[#2A2B2A33] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#CFFF40]"
              autoFocus
            />
          </div>
          <ul className="overflow-y-auto max-h-[220px] py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 font-sans text-sm text-muted">No matches</li>
            ) : (
              filtered.map((item) => (
                <li key={`${item.code}-${item.country}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === item.code}
                    onClick={() => {
                      onChange(item.code);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full text-left px-4 py-2 font-sans text-sm hover:bg-[#F5F5F5] ${
                      value === item.code ? "bg-sage-1/50 font-medium" : ""
                    }`}
                  >
                    <span className="text-muted">{item.code}</span> {item.country}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
