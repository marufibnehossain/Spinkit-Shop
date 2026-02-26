import Image from "next/image";

const ICON_SIZE = 48;

const services = [
  {
    title: "Fast & Easy Returns",
    description:
      "30-Day Hassle-Free Returns. Not satisfied? Return it quickly and easily.",
    icon: (
      <Image
        src="/images/truck.svg"
        alt="Fast & easy returns"
        width={ICON_SIZE}
        height={ICON_SIZE}
        className="shrink-0"
        aria-hidden
      />
    ),
  },
  {
    title: "Professional-Grade Quality",
    description:
      "Premium Performance. Authentic products from leading brands.",
    icon: (
      <Image
        src="/images/award.svg"
        alt="Professional-grade quality"
        width={ICON_SIZE}
        height={ICON_SIZE}
        className="shrink-0"
        aria-hidden
      />
    ),
  },
  {
    title: "Fast & Secure Delivery",
    description:
      "Free Shipping Over €50. Quick dispatch with secure packaging.",
    icon: (
      <Image
        src="/images/icon-park-twotone_delivery.svg"
        alt="Fast & secure delivery"
        width={ICON_SIZE}
        height={ICON_SIZE}
        className="shrink-0"
        aria-hidden
      />
    ),
  },
  {
    title: "Safe & Secure Payments",
    description:
      "100% Secure Checkout. SSL-protected payments for complete peace of mind.",
    icon: (
      <Image
        src="/images/credit-card.svg"
        alt="Safe & secure payments"
        width={ICON_SIZE}
        height={ICON_SIZE}
        className="shrink-0"
        aria-hidden
      />
    ),
  },
];

export default function ServicesSection() {
  return (
    <section
      className="py-[50px] bg-[#fbfaf5]"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-[1312px] px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {services.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="font-sans font-bold text-[#2e2e2e] text-lg">
                {item.title}
              </h3>
              <p className="mt-2 font-sans text-sm text-[#6b6b6b] leading-relaxed max-w-xs">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
