export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-white">
        <div className="mx-auto max-w-[960px] px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="font-sans text-3xl md:text-4xl font-bold text-[#111827] mb-4">
            Privacy Policy
          </h1>
          <p className="font-sans text-sm md:text-base text-[#4B5563] leading-relaxed max-w-3xl">
            Your privacy is important to us. This Privacy Policy explains how Spinkit.Shop
            collects, uses, and protects your personal information when you browse our
            website or place an order.
          </p>
          <div className="mt-8 space-y-6 font-sans text-sm md:text-base text-[#374151] leading-relaxed max-w-3xl">
            <p>
              We only collect data necessary to process your orders, improve our services,
              and communicate with you about products or promotions if you have given
              consent. We never sell your personal data to third parties.
            </p>
            <p className="text-xs text-[#6B7280]">
              Last updated: {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

