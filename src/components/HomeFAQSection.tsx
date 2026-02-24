"use client";

import Accordion from "@/components/Accordion";

const FAQ_ITEMS = [
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
];

export default function HomeFAQSection() {
  const accordionItems = FAQ_ITEMS.map(({ q, a }) => ({
    title: q,
    content: a,
  }));

  return (
    <section
      className="py-[50px] bg-[#CFFF40]"
      aria-labelledby="home-faq-heading"
    >
      <div className="mx-auto max-w-[1312px] px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: heading stacked over 3 lines */}
          <h2
            id="home-faq-heading"
            className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-[#2D2D2D] leading-tight max-w-sm"
          >
            Frequently Asked Questions
          </h2>

          {/* Right: Accordion */}
          <Accordion
            items={accordionItems}
            defaultOpenIndex={0}
            className="border-0 rounded-none bg-transparent shadow-none"
          />
        </div>
      </div>
    </section>
  );
}
