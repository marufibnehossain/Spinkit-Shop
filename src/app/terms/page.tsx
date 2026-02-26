export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <section className="bg-white border-b border-[#E5E7EB]">
        <div className="mx-auto max-w-[960px] px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="font-sans text-3xl md:text-4xl font-bold text-[#111827] mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="font-sans text-sm md:text-base text-[#4B5563] leading-relaxed max-w-3xl">
            These Terms &amp; Conditions govern your use of Spinkit.Shop and all purchases
            made through our store. By accessing or using our website, you agree to be
            bound by these terms.
          </p>
          <div className="mt-8 space-y-6 font-sans text-sm md:text-base text-[#374151] leading-relaxed max-w-3xl">
            <p>
              We may update these Terms &amp; Conditions from time to time to reflect
              changes in our services or legal requirements. When we do, we will update
              the &quot;Last updated&quot; date on this page. Please review these terms
              regularly to stay informed about how you can use our site and services.
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

