import Image from "next/image";
import Link from "next/link";

export default function BottomCtaBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative w-full h-[550px]">
        <Image
          src="/images/bottom-banner.png"
          alt="Table tennis table top view"
          fill
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/35" aria-hidden />
        <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-4">
          <h2 className="font-sans text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4">
            READY TO ELEVATE YOUR GAME?
          </h2>
          <p className="font-sans text-sm md:text-base text-white/85 max-w-xl mb-6">
            Explore our full range of professional table tennis equipment and find
            your perfect setup.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-none bg-[#CFFF40] text-sage-dark font-sans text-sm font-semibold hover:opacity-95 transition-opacity"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}

