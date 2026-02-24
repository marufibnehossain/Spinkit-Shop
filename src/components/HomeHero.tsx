import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";

export default function HomeHero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/images/Hero-Section.png"
        alt="Player ready for table tennis match"
        fill
        priority
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-black/10" aria-hidden />

      <div className="relative z-10 pt-24 pb-12 md:pb-16 min-h-screen flex items-end">
        <div className="mx-auto max-w-[1315px] px-4 md:px-6 w-full">

          <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8 w-full">
            {/* Left: social proof + CTA */}
            <div className="max-w-md space-y-4">
              <div className="flex items-end gap-3">
                <div className="flex -space-x-2">
                  <img src="/images/person-image.png" alt="person-image" className="w-[126px]" />
                </div>
                <div>
                  <p className="font-sans text-sm text-white font-semibold">
                    12.5k+{" "}
                    <span className="font-normal text-white/80">Satisfied users.</span>
                  </p>
                </div>
              </div>

              <p className="font-sans text-sm md:text-base text-white/90 leading-relaxed">
                Upgrade your game with top-quality table tennis gear crafted for precision
                and power. Everything you need to play with confidence — all in one place.
              </p>

              <Button
                href="/products"
                variant="hero"
                className="mt-2 bg-[#CFFF40] text-sage-dark hover:bg-[#CFFF40]/90 rounded-none shadow-lg shadow-black/20"
              >
                Shop Now
              </Button>
            </div>

            {/* Right: rating */}
            <div className="md:text-right">
              <p className="font-sans text-sm text-white/80">
                <span className="font-semibold text-white">4.7/5</span>{" "}
                <span className="ml-1 text-[#CFFF40]" aria-hidden>
                  ★★★★★
                </span>
              </p>
              <p className="font-sans text-xs text-white/70 mt-1">
                20+ reviews on Trustpilot
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

