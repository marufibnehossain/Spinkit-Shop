"use client";

import Image from "next/image";
import Button from "@/components/Button";

export default function FooterNewsletter() {
  return (
    <div className="relative min-h-[260px] bg-black text-white overflow-hidden">
      <Image
        src="/images/Group-11.png"
        alt="Subscribe to our newsletter"
        fill
        className="object-cover opacity-70"
        sizes="(max-width: 768px) 100vw, 35vw"
        priority
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div className="relative z-10 h-full w-full flex flex-col justify-center px-6 md:px-10 py-8 gap-4">
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-white/70">
          Subscribe to our Newsletter
        </p>
        <p className="font-sans text-lg md:text-xl font-semibold max-w-xs">
          Get the latest table tennis gear, tips, and offers.
        </p>
        <form
          className="mt-2 flex flex-col sm:flex-row gap-3 max-w-md"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="Email address"
            className="flex-1 border border-white/40 bg-white/10 px-3 py-2 font-sans text-sm text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-[#CFFF40]"
          />
          <Button type="submit" variant="hero" className="bg-[#CFFF40] text-sage-dark px-5 py-2">
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
}

