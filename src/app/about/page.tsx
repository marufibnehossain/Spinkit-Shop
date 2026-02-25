import Image from "next/image";
import AboutStats from "@/components/AboutStats";
import BottomCtaBanner from "@/components/BottomCtaBanner";
import HomeFAQSection from "@/components/HomeFAQSection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Hero about banner */}
      <section className="relative overflow-hidden text-white">
        <div className="relative h-[400px] flex items-center">
          <Image
            src="/images/page-banner.png"
            alt="About Spinkit.Shop"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-sage-dark/50 mix-blend-multiply" aria-hidden />
          <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-10 flex flex-col items-center justify-center text-center">
            <h1 className="font-sans text-[44px] md:text-[64px] lg:text-[72px] font-black leading-none text-[#CFFF40]">
              ABOUT
            </h1>
            <p className="mt-4 max-w-xl font-sans text-sm md:text-base text-hero-text">
              Born from a passion for table tennis, we&apos;re on a mission to equip
              players of all levels with the best gear in the game.
            </p>
          </div>
        </div>
      </section>

      {/* Our story section */}
      <section className="bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-10 grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-start">
          <div>
            <h2 className="font-sans text-xl md:text-2xl font-semibold text-[#111827] mb-4">
              Our Story
            </h2>
            <p className="font-sans text-sm md:text-base text-[#4B5563] leading-relaxed mb-4">
              It started in a small garage in 2010 with two friends, a dream, and an
              obsession with the perfect spin. We were competitive players frustrated by
              the lack of quality, affordable equipment that could keep up with our game.
            </p>
            <p className="font-sans text-sm md:text-base text-[#4B5563] leading-relaxed mb-4">
              We work with manufacturers and professional athletes to design products
              that deliver real performance on the table. Every product in our catalog is
              tested, approved, and trusted by competitive players.
            </p>
            <p className="font-sans text-sm md:text-base text-[#4B5563] leading-relaxed">
              Today, we serve over 10,000 players across 30+ countries. Our mission
              hasn&apos;t changed: to create equipment that helps every player — from
              first-time beginners to elite competitors — unlock their full potential at
              the table.
            </p>
          </div>
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="/images/our-story.png"
              alt="Players enjoying table tennis community"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Three feature tiles */}
      <section className="bg-[#F9F5EC] py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6 lg:px-10 grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Performance",
              icon: "/images/performance.svg",
              desc: "Every blade, rubber, and accessory in our catalog is selected for control, speed, and consistency at all levels of play.",
            },
            {
              title: "Innovation",
              icon: "/images/innovation.svg",
              desc: "We stay ahead of the curve on the balance of what modern players want: lighter setups, more spin, and durable gear.",
            },
            {
              title: "Community",
              icon: "/images/community.svg",
              desc: "From local clubs to international events, we’re a global partner for players who share the same love for the sport.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-none bg-[#2050FC] border border-[#2050FC] px-5 py-6 text-white flex flex-col gap-2"
            >
              <div className="relative w-8 h-8 mb-1">
                <Image
                  src={item.icon}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-sans text-base md:text-lg font-semibold">
                {item.title}
              </h3>
              <p className="font-sans text-sm md:text-[15px] text-white/80 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats strip with icons and counters */}
      <section className="bg-white py-10 md:py-12 border-b border-[#E5E7EB]">
        <div className="container mx-auto px-4 md:px-6 lg:px-10">
          <AboutStats />
        </div>
      </section>

      {/* Bottom CTA banner */}
      <BottomCtaBanner />

      {/* FAQ section — lime background, heading left, accordion right */}
      <HomeFAQSection />
    </div>
  );
}

