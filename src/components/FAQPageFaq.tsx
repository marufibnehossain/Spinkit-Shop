"use client";

import { useState } from "react";

type FAQItem = { q: string; a: string };

const tabs: { id: string; label: string; items: FAQItem[] }[] = [
  {
    id: "general",
    label: "General Questions",
    items: [
      {
        q: "How do I choose the right table tennis blade?",
        a: "Think about your playing style and level. All-round blades are great for control and beginners, while offensive blades offer more speed for advanced players.",
      },
      {
        q: "Which rubber is best for spin?",
        a: "Tensor and tacky rubbers are ideal for spin. Soft sponges give more dwell time and spin, while harder sponges offer power and precision.",
      },
      {
        q: "How long does shipping take?",
        a: "Most orders leave our warehouse within 1–2 business days. Delivery times depend on your location and chosen shipping method.",
      },
      {
        q: "Do you sell authentic products?",
        a: "Yes. We only work with official distributors and trusted brands, so every product is 100% genuine.",
      },
      {
        q: "Do you offer returns or exchanges?",
        a: "Unused items in original packaging can usually be returned or exchanged within 30 days. Check our Returns & Exchanges page for full details.",
      },
    ],
  },
  {
    id: "orders",
    label: "Orders & Payments",
    items: [
      {
        q: "Which payment methods do you accept?",
        a: "We accept major credit and debit cards only.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "If your order hasn’t shipped yet, contact us as soon as possible and we’ll do our best to adjust or cancel it.",
      },
      {
        q: "Will I receive an order confirmation?",
        a: "Yes. You’ll get an email confirmation with your order details right after checkout.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping & Delivery",
    items: [
      {
        q: "Do you ship internationally?",
        a: "Yes. We ship to many countries worldwide. Shipping costs and times vary by destination.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, we’ll email you a tracking link so you can follow the delivery.",
      },
    ],
  },
  {
    id: "returns",
    label: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "You can return most unused items in original packaging within 30 days. Some items may have specific conditions.",
      },
      {
        q: "How do I start a return?",
        a: "Reach out to our support team with your order number and reason for return. We’ll guide you through the next steps.",
      },
    ],
  },
  {
    id: "warranty",
    label: "Warranty & Quality",
    items: [
      {
        q: "Do your products come with a warranty?",
        a: "Many items include a manufacturer’s warranty. If you experience an issue, contact us and we’ll help you with the warranty process.",
      },
      {
        q: "What if my product arrives damaged?",
        a: "Please contact us within a few days of delivery with photos of the damage so we can arrange a replacement or solution.",
      },
    ],
  },
];

export default function FAQPageFaq() {
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  return (
    <div className="mt-10 w-full max-w-4xl mx-auto bg-[#D6FC45] border border-[#D6FC45] rounded-none shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-black/10 px-6 pt-4 pb-2 overflow-x-auto">
        <div className="flex gap-6 min-w-max text-sm md:text-base font-sans">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTabId(tab.id);
                  setOpenIndex(null);
                }}
                className={`pb-2 border-b-2 ${
                  isActive ? "border-black font-semibold text-black" : "border-transparent text-black/60"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider under tabs */}
      <div className="border-t border-black/10" />

      {/* Questions */}
      <ul className="px-6">
        {activeTab.items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <li key={item.q} className="border-b border-black/10 last:border-b-0">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-sans text-sm md:text-base text-black">{item.q}</span>
                <span
                  className={`flex-shrink-0 w-5 h-5 flex items-center justify-center text-black transition-transform duration-300 ease-out ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="pb-3">
                    <p className="font-sans text-xs md:text-sm text-black/80 leading-relaxed pr-6 break-words">{item.a}</p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

