const ICON_COLOR = "#3259ed";

const services = [
  {
    title: "Fast & Easy Returns",
    description:
      "30-Day Hassle-Free Returns. Not satisfied? Return it quickly and easily.",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke={ICON_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
        aria-hidden
      >
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18h2" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      </svg>
    ),
  },
  {
    title: "Professional-Grade Quality",
    description:
      "Premium Performance. Authentic products from leading brands.",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke={ICON_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
        aria-hidden
      >
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    title: "Fast & Secure Delivery",
    description:
      "Free Shipping Over €50. Quick dispatch with secure packaging.",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke={ICON_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
        aria-hidden
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M21 17h-8" />
        <path d="M21 13v4" />
      </svg>
    ),
  },
  {
    title: "Safe & Secure Payments",
    description:
      "100% Secure Checkout. SSL-protected payments for complete peace of mind.",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke={ICON_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
        aria-hidden
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
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
