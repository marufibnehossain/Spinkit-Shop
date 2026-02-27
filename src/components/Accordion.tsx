"use client";

import { useState } from "react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#2D2D2D]/25 first:border-t">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 font-sans text-left text-text font-medium md:text-xl text-base transition-colors focus:outline-none rounded"
        aria-expanded={open}
      >
        {title}
        <span className="text-muted shrink-0 ml-2">{open ? "−" : "+"}</span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-4 font-sans text-base leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: { title: string; content: React.ReactNode }[];
  defaultOpenIndex?: number;
  className?: string;
}

export default function Accordion({
  items,
  defaultOpenIndex = -1,
  className = "",
}: AccordionProps) {
  return (
    <div className={`rounded-none bg-transparent overflow-hidden box-content ${className}`}>
      {items.map((item, i) => (
        <AccordionItem
          key={item.title}
          title={item.title}
          defaultOpen={i === defaultOpenIndex}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
