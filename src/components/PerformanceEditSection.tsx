import Image from "next/image";
import Link from "next/link";

export default function PerformanceEditSection() {
  return (
    <section
      className="py-[50px] bg-[#7B23F0]"
      aria-labelledby="performance-edit-heading"
    >
      <div className="mx-auto max-w-[1312px] px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: two portrait images side-by-side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-none">
              <Image
                src="/images/image 44 (1).png"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 30vw"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-none">
              <Image
                src="/images/image 45.png"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 30vw"
              />
            </div>
          </div>

          {/* Right: heading, paragraph, CTA */}
          <div>
            <h2
              id="performance-edit-heading"
              className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight"
            >
              The <span className="text-[#BFF700]">Performance</span> Edit
            </h2>
            <p className="mt-6 font-sans text-white text-base leading-relaxed max-w-lg">
              Push your limits. Discover our handpicked selection of professional blades, high-spin rubbers, and competition-ready gear designed for players who demand precision and power.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center justify-center gap-2 bg-[#BFF700] text-black font-sans font-bold px-6 py-3 rounded-none hover:opacity-90 transition-opacity"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
