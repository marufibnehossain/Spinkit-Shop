export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <section className="bg-white border-b border-[#E5E7EB]">
        <div className="mx-auto max-w-[960px] px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="font-sans text-3xl md:text-4xl font-bold text-[#111827] mb-4">
            Refund &amp; Returns Policy
          </h1>
          <p className="font-sans text-sm md:text-base text-[#4B5563] leading-relaxed max-w-3xl">
            We want you to be completely satisfied with your purchase from Spinkit.Shop.
            This Refund &amp; Returns Policy explains when and how you can return items,
            request a refund, or exchange products.
          </p>
          <div className="mt-8 space-y-6 font-sans text-sm md:text-base text-[#374151] leading-relaxed max-w-3xl">
            <p>
              Unless otherwise stated, most unused items can be returned within a limited
              period from the delivery date, provided they are in their original condition
              and packaging. Please keep your order confirmation as proof of purchase.
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

