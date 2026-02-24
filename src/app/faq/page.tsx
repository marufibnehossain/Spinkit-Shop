import Image from "next/image";
import BottomCtaBanner from "@/components/BottomCtaBanner";
import FAQPageFaq from "@/components/FAQPageFaq";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Hero FAQ banner (same as About hero) */}
      <section className="relative overflow-hidden text-white">
        <div className="relative h-[400px] flex items-center">
          <Image
            src="/images/page-banner.png"
            alt="FAQ - Spinkit.Shop"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-sage-dark/50 mix-blend-multiply" aria-hidden />
          <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-10 flex flex-col items-center justify-center text-center">
            <h1 className="font-sans text-[44px] md:text-[64px] lg:text-[72px] font-black leading-none text-[#CFFF40]">
              FAQ
            </h1>
            <p className="mt-4 max-w-2xl font-sans text-sm md:text-base text-hero-text">
              Find answers to the most common questions about our products, orders,
              shipping, and returns. We&apos;re here to make your shopping experience
              smooth and hassle-free.
            </p>
          </div>
        </div>
      </section>

      {/* Page heading + unique FAQ box */}
      <section className="bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-10 flex flex-col items-center">
          <div className="text-center max-w-3xl">
            <h2 className="font-sans text-2xl md:text-3xl lg:text-4xl font-semibold text-[#111827] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="font-sans text-sm md:text-base text-[#4B5563] leading-relaxed">
              We&apos;ve gathered the most common inquiries about our products, orders,
              shipping, and returns to help you find quick and clear answers in one place.
            </p>
          </div>

          <FAQPageFaq />
        </div>
      </section>

      {/* Bottom CTA banner reused from About */}
      <BottomCtaBanner />
    </div>
  );
}

