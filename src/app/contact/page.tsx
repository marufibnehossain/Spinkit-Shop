"use client";

import Image from "next/image";
import { useState } from "react";

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
          <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-10 flex flex-col items-center justify-center text-center">
            <h1 className="font-sans text-[40px] md:text-[64px] lg:text-[72px] font-black leading-none text-[#CFFF40]">
              CONTACT US
            </h1>
            <p className="mt-4 max-w-xl font-sans text-sm md:text-base text-hero-text">
              We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact content */}
      <section className="bg-white py-10 md:py-14 lg:py-16">
        <div className="max-w-[1315px] mx-auto px-4 md:px-6 lg:px-10 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 lg:gap-10">
          {/* Left: contact form card */}
          <div className="bg-[#F5F0E8] border border-[#E2D9CC] px-5 py-6 md:px-8 md:py-8">
            <div className="mb-6">
              <h2 className="font-sans text-lg md:text-xl font-semibold text-[#111827]">
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
                  className="w-full border border-[#E2D9CC] bg-white px-4 py-3 font-sans text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#CFFF40]"
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
                  className="w-full border border-[#E2D9CC] bg-white px-4 py-3 font-sans text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#CFFF40]"
                  placeholder="user@gmail.com"
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-[#111827] mb-1">
                  Phone Number
                </label>
                <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)] gap-3">
                  <select
                    value={phoneCountry}
                    onChange={(e) => setPhoneCountry(e.target.value)}
                    className="border border-[#E2D9CC] bg-white px-3 py-3 font-sans text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#CFFF40]"
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
                    className="border border-[#E2D9CC] bg-white px-4 py-3 font-sans text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#CFFF40]"
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
                  className="w-full border border-[#E2D9CC] bg-white px-4 py-3 font-sans text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#CFFF40] resize-none"
                  placeholder="Write your message here"
                />
              </div>

              {sent && (
                <p className="font-sans text-sm text-[#15803d]">
                  Thank you, your message has been sent.
                </p>
              )}
              {error && (
                <p className="font-sans text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-none bg-[#CFFF40] text-[#2A2B2A] px-6 py-3 font-sans text-sm font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {sending ? "Sending…" : "Submit Now"}
                <span aria-hidden>→</span>
              </button>
            </form>
          </div>

          {/* Right: address & hours cards */}
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-[#E2D9CC] bg-white px-5 py-4">
                <div className="mb-2 text-[#111827]" aria-hidden>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <p className="font-sans text-xs text-[#6B7280] uppercase tracking-wide mb-1">
                  Address
                </p>
                <p className="font-sans text-sm text-[#111827]">
                  Abc, city, street, country.
                </p>
              </div>
              <div className="border border-[#E2D9CC] bg-white px-5 py-4">
                <div className="mb-2 text-[#111827]" aria-hidden>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <p className="font-sans text-xs text-[#6B7280] uppercase tracking-wide mb-1">
                  Email Address
                </p>
                <p className="font-sans text-sm text-[#111827]">
                  hello@camperstore.com
                </p>
              </div>
            </div>

            <div className="border border-[#E2D9CC] bg-white px-5 py-4">
              <p className="font-sans text-xs text-[#6B7280] uppercase tracking-wide mb-2">
                Business Hours
              </p>
              <div className="grid grid-cols-3 gap-4 font-sans text-xs md:text-sm text-[#111827]">
                <div>
                  <p className="font-medium">Monday - Friday</p>
                  <p className="text-[#6B7280]">09.00 am - 08.00 pm</p>
                </div>
                <div>
                  <p className="font-medium">Saturday</p>
                  <p className="text-[#6B7280]">09.00 am - 06.00 pm</p>
                </div>
                <div>
                  <p className="font-medium">Sunday</p>
                  <p className="text-[#6B7280]">09.00 am - 05.00 pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
