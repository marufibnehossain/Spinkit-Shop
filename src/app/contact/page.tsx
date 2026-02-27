"use client";

import Image from "next/image";
import { useState } from "react";

const contactCards = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    title: "Address",
    details: "Abc, city, street, country.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    title: "Email Address",
    details: "spinkit.shop@gmail.com",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    title: "Call On",
    details: "+421 905 557",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    title: "Business Hours",
    details: (
      <>
        Monday - Friday
        <br />
        09:00 am - 08:00 pm
      </>
    ),
  },
];

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("+44");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const composedMessage = [
        notes.trim(),
        `Phone: ${phoneCountry} ${phoneNumber}`.trim(),
      ]
        .filter(Boolean)
        .join("\n\n");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          message: composedMessage,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSent(true);
        setFullName("");
        setEmail("");
        setPhoneNumber("");
        setNotes("");
      } else {
        setError(data.error ?? "Failed to send");
      }
    } catch {
      setError("Failed to send");
    }
    setSending(false);
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Hero banner */}
      <section className="relative overflow-hidden text-white">
        <div className="relative h-[320px] md:h-[380px] flex items-center">
          <Image
            src="/images/page-banner.png"
            alt="Contact Spinkit.Shop"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-sage-dark/50 mix-blend-multiply" aria-hidden />
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
            <div className="mx-auto max-w-[1315px] px-4 md:px-6 w-full">
              <h1 className="font-sans text-[40px] md:text-[64px] lg:text-[72px] font-black leading-none text-[#CFFF40]">
                CONTACT US
              </h1>
              <p className="mt-4 max-w-xl font-sans text-sm md:text-base text-hero-text mx-auto">
                We&apos;d love to hear from you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact info cards - 4 cards in a row */}
      <section className="relative z-10 py-6 md:py-8 lg:py-14 bg-white">
        <div className="mx-auto max-w-[1315px] px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactCards.map((card) => (
              <div
                key={card.title}
                className="bg-white border border-[#2A2B2A99] rounded-lg px-5 py-6 shadow-sm"
              >
                <div className="text-[#374151] mb-3" aria-hidden>
                  {card.icon}
                </div>
                <h3 className="font-sans text-sm font-bold text-[#111827] mb-1">
                  {card.title}
                </h3>
                <p className="font-sans text-sm text-[#6B7280] leading-relaxed">
                  {card.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content: image left, form right */}
      <section className="bg-white pb-10 md:pb-14 lg:pb-16">
        <div className="mx-auto max-w-[1315px] px-4 md:px-6">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-10 items-stretch">
            {/* Left: table tennis image */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] overflow-hidden rounded-lg">
              <Image
                src="/images/contact-us.png"
                alt="Table tennis"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Right: contact form */}
            <div className="bg-[#F9F5EC] rounded-lg px-6 py-8 md:px-8 md:py-10">
              <div className="mb-6">
                <h2 className="font-sans text-xl md:text-2xl font-bold text-[#111827]">
                  Contact Form
                </h2>
                <p className="mt-1 font-sans text-sm text-[#6B7280]">
                  It takes less than 1 minute. We&apos;ll contact you shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-sans text-sm font-medium text-[#111827] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-[#2A2B2A99] bg-transparent rounded-lg px-4 py-3 font-sans text-sm text-[#111827] placeholder:text-[#2A2B2A99] focus:outline-none focus:ring-2 focus:ring-[#CFFF40] focus:border-transparent"
                    placeholder="Name"
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-medium text-[#111827] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-[#2A2B2A99] bg-transparent rounded-lg px-4 py-3 font-sans text-sm text-[#111827] placeholder:text-[#2A2B2A99] focus:outline-none focus:ring-2 focus:ring-[#CFFF40] focus:border-transparent"
                    placeholder="User@gmail.com"
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-medium text-[#111827] mb-1">
                    Phone Number
                  </label>
                  <div className="flex gap-3">
                    <select
                      value={phoneCountry}
                      onChange={(e) => setPhoneCountry(e.target.value)}
                      className="border border-[#2A2B2A99] bg-transparent rounded-lg px-4 py-3 font-sans text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#CFFF40] focus:border-transparent"
                    >
                      <option value="+44">+44</option>
                      <option value="+1">+1</option>
                      <option value="+49">+49</option>
                      <option value="+33">+33</option>
                    </select>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 border border-[#2A2B2A99] bg-transparent rounded-lg px-4 py-3 font-sans text-sm text-[#111827] placeholder:text-[#2A2B2A99] focus:outline-none focus:ring-2 focus:ring-[#CFFF40] focus:border-transparent"
                      placeholder="000 0000 000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-sm font-medium text-[#111827] mb-1">
                    Special Notes
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-[#2A2B2A99] bg-transparent rounded-lg px-4 py-3 font-sans text-sm text-[#111827] placeholder:text-[#2A2B2A99] focus:outline-none focus:ring-2 focus:ring-[#CFFF40] focus:border-transparent resize-none"
                    placeholder="Write your message here"
                  />
                </div>

                {sent && (
                  <p className="font-sans text-sm text-[#15803d]">
                    Thank you, your message has been sent.
                  </p>
                )}
                {error && (
                  <p className="font-sans text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#CFFF40] text-[#2A2B2A] px-6 py-3 font-sans text-sm font-semibold hover:opacity-90 disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Submit Now"}
                  <span aria-hidden>→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
