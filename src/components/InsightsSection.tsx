import Image from "next/image";
import Link from "next/link";

const insights = [
  {
    title: "Top 5 Rubbers for Maximum Spin in 2026",
    date: "July 8, 2026",
    image: "/images/our-story.png",
    href: "/blog/top-5-rubbers-spin-2026",
  },
  {
    title: "How to Choose the Right Table Tennis Blade",
    date: "Sept 12, 2026",
    image: "/images/about.png",
    href: "/blog/choose-right-blade",
  },
  {
    title: "Beginner vs. Pro Equipment: What's the Real Difference?",
    date: "Dec 24 2026",
    image: "/images/person-image.png",
    href: "/blog/beginner-vs-pro-equipment",
  },
];

export default function InsightsSection() {
  return (
    <section
      className="py-[50px] bg-bg"
      aria-labelledby="insights-heading"
    >
      <div className="mx-auto max-w-[1312px] px-4 md:px-6">
        <h2
          id="insights-heading"
          className="font-display text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12"
        >
          Table Tennis{" "}
          <span className="text-[#2050FC]">Insights</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {insights.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group block rounded-none overflow-hidden hover:opacity-95 transition-opacity"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-sage-1 rounded-none">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <h3 className="mt-4 font-sans font-bold text-text text-base leading-tight group-hover:underline">
                {item.title}
              </h3>
              <p className="mt-2 font-sans text-sm text-muted">
                {item.date}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
