import Link from "next/link";
import Image from "next/image";
import AdminFooterLink from "@/components/AdminFooterLink";
import FooterNewsletter from "@/components/FooterNewsletter";

const supportLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const companyLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Refund & Returns Policy" },
];

const socialLinks = [
  { href: "#", label: "Instagram" },
  { href: "#", label: "Facebook" },
  { href: "#", label: "LinkedIn" },
  { href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="text-white">
      {/* Two main blocks: left 35% newsletter, right 65% links + bottom */}
      <div className="grid md:grid-cols-[35%_65%]">
        {/* Left block: Newsletter panel — full-bleed photo, overlay centered-left */}
        <FooterNewsletter />

        {/* Right block: dark charcoal, 4 columns + bottom area inside */}
        <div className="bg-[#1a1a1a] flex flex-col min-h-[320px] md:min-h-0">
          {/* 4 vertical columns: Brand+contact, Support, Company, Social */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-6 py-10 md:py-12 lg:px-10 lg:py-14 flex-1">
            {/* Column 1: Brand + contact */}
            <div>
              <Link
                href="/"
                className="font-sans text-xl md:text-2xl font-bold text-[#D6FC45]"
              >
                Spinkit.Shop
              </Link>
              <div className="mt-4 font-sans text-sm text-white space-y-1">
                <p>Address: Company Address, City name</p>
                <p>Phone: +421 905 557</p>
                <p>Email: spinkit.shop@gmail.com</p>
              </div>
            </div>
            {/* Column 2: Quick links */}
            <div>
              <h4 className="font-sans text-sm font-semibold text-white/70 mb-3">
                Quick links
              </h4>
              <ul className="space-y-2">
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-white hover:opacity-80 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Column 3: Company */}
            <div>
              <h4 className="font-sans text-sm font-semibold text-white/70 mb-3">
                Company
              </h4>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-white hover:opacity-80 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Column 4: Social */}
            <div>
              <h4 className="font-sans text-sm font-semibold text-white/70 mb-3">
                Social
              </h4>
              <ul className="space-y-2">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-sans text-sm text-white hover:opacity-80 transition-opacity"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom area (inside right block): one line copyright + Trustpilot, then payment icons */}
          <div className="border-t border-white/10 px-6 py-6 md:py-8 flex flex-col items-center gap-6">
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 text-center sm:text-left">
              <p className="font-sans text-sm text-white/80 order-2 sm:order-1">
                © Spinkit.Shop 2026 - All rights reserved. Excellent 4.7 out of 5
              </p>
              <div className="flex items-center justify-center gap-2 font-sans text-sm text-white/80 order-1 sm:order-2">
                <span className="text-[#D6FC45]" aria-hidden>★</span>
                <span>Trustpilot</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6" aria-label="Payment methods">
              <Image
                src="/images/payments.svg"
                alt="Accepted payment methods"
                width={200}
                height={24}
                className="h-6 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
