"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";

type PaymentMethod = "card" | "cod";

interface Address {
  id: string;
  label: string | null;
  address: string;
  city: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

const labelClass = "block mb-1.5 font-sans text-sm font-medium text-[#2A2B2A]";
const inputClass =
  "w-full rounded border-[0.5px] border-[rgba(42,43,42,0.6)] bg-transparent px-3 py-2.5 font-sans text-sm text-[#2A2B2A] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#D0F198]/50 focus:border-[rgba(42,43,42,0.6)]";

const cardClass = "rounded-lg border-[0.5px] border-[rgba(42,43,42,0.6)] p-6 md:p-8";

const CHECKOUT_SAVED_KEY = "spinkit-checkout-saved";

type CheckoutSaved = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phoneCountryCode?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  district?: string;
  rememberPhoneCode?: string;
  rememberPhoneNumber?: string;
};

function loadSavedCheckout(): CheckoutSaved | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CHECKOUT_SAVED_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as CheckoutSaved) : null;
  } catch {
    return null;
  }
}

function saveCheckoutToStorage(data: CheckoutSaved) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CHECKOUT_SAVED_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const [mounted, setMounted] = useState(false);
  const [savedLoaded, setSavedLoaded] = useState(false);
  useEffect(() => setMounted(true), []);

  // Load last-used checkout info from localStorage when mounted (so returning users see pre-filled fields)
  useEffect(() => {
    if (!mounted || savedLoaded) return;
    const saved = loadSavedCheckout();
    if (saved) {
      if (saved.firstName) setFirstName(saved.firstName);
      if (saved.lastName) setLastName(saved.lastName);
      if (saved.email) setEmail(saved.email);
      if (saved.phone) setPhone(saved.phone);
      if (saved.phoneCountryCode) setPhoneCountryCode(saved.phoneCountryCode);
      if (saved.address) setAddress(saved.address);
      if (saved.city) setCity(saved.city);
      if (saved.zip) setZip(saved.zip);
      if (saved.country) setCountry(saved.country);
      if (saved.district) setDistrict(saved.district);
      if (saved.rememberPhoneCode) setRememberPhoneCode(saved.rememberPhoneCode);
      if (saved.rememberPhoneNumber) setRememberPhoneNumber(saved.rememberPhoneNumber ?? "");
    }
    setSavedLoaded(true);
  }, [mounted, savedLoaded]);

  const rawSubtotal = useMemo(() => getSubtotal(), [getSubtotal]);
  const subtotal = mounted ? rawSubtotal : 0;
  const deliveryFee = mounted ? (rawSubtotal >= 50 ? 0 : 5) : 0;
  const [discountAmount, setDiscountAmount] = useState(0);
  const total = mounted ? subtotal - discountAmount + deliveryFee : 0;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+44");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [district, setDistrict] = useState("");
  const [rememberPhoneCode, setRememberPhoneCode] = useState("+44");
  const [rememberPhoneNumber, setRememberPhoneNumber] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(false);

  const [saveInfo, setSaveInfo] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const orderPlacedSuccessRef = useRef(false);

  useEffect(() => {
    if (items.length === 0 && !orderPlacedSuccessRef.current) router.replace("/cart");
  }, [items.length, router]);

  // When logged in, prefer session name/email (overrides localStorage)
  useEffect(() => {
    if (!session?.user) return;
    if (session.user.name) {
      const parts = session.user.name.split(" ");
      setFirstName(parts[0] ?? "");
      setLastName(parts.slice(1).join(" "));
    }
    if (session.user.email) setEmail(session.user.email);
    setSaveInfo(true);
  }, [session]);

  useEffect(() => {
    if (!session?.user?.email || addressesLoaded) return;
    async function loadAddresses() {
      try {
        const res = await fetch("/api/account/addresses");
        if (!res.ok) return;
        const data = (await res.json()) as Address[];
        const def = data.find((a) => a.isDefault) ?? data[0];
        if (def) {
          setAddress(def.address);
          setCity(def.city);
          setZip(def.zip);
          setCountry(def.country);
        }
      } catch {
        // ignore
      } finally {
        setAddressesLoaded(true);
      }
    }
    loadAddresses();
  }, [session, addressesLoaded]);

  function handleApplyVoucher() {
    // Placeholder: no real voucher API
    if (voucherCode.trim().toUpperCase() === "SAVE10") {
      setDiscountAmount(10);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0 || loading) return;
    setLoading(true);
    setError(null);

    try {
      const body = {
        email,
        name: `${firstName} ${lastName}`.trim() || undefined,
        address,
        city,
        zip,
        country,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          variationId: i.variationId,
          variationLabel: i.attributes
            ? Object.entries(i.attributes)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ")
            : undefined,
        })),
        subtotal,
        discount: discountAmount,
        shipping: deliveryFee,
        total,
        coupon: voucherCode || null,
        paymentMethod,
        deliveryMethod: "standard",
      };

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to place order");
      }

      const data = (await res.json()) as { ok: boolean; orderId: string };

      if (session?.user?.email && saveInfo) {
        try {
          await fetch("/api/account/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              label: "Default",
              address,
              city,
              zip,
              country,
              isDefault: true,
            }),
          });
        } catch {
          // non-fatal
        }
      }

      saveCheckoutToStorage({
        firstName,
        lastName,
        email,
        phone,
        phoneCountryCode,
        address,
        city,
        zip,
        country,
        district,
        rememberPhoneCode,
        rememberPhoneNumber,
      });
      orderPlacedSuccessRef.current = true;
      clearCart();
      router.push(`/checkout/success?orderId=${encodeURIComponent(data.orderId)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0]">

      <div className="max-w-[1315px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          <form id="checkout-form" onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            {/* Billing Address card */}
            <section className={cardClass}>
              <h2 className="font-sans text-lg font-bold text-[#2A2B2A] mb-4">
                Billing Address
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="billing-first-name" className={labelClass}>First Name</label>
                  <input
                    id="billing-first-name"
                    className={inputClass}
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="billing-last-name" className={labelClass}>Last Name</label>
                  <input
                    id="billing-last-name"
                    className={inputClass}
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="billing-email" className={labelClass}>Email Address</label>
                  <input
                    id="billing-email"
                    type="email"
                    className={inputClass}
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="billing-phone" className={labelClass}>Phone Number</label>
                  <div className="flex rounded border-[0.5px] border-[rgba(42,43,42,0.6)] bg-transparent overflow-hidden focus-within:ring-2 focus-within:ring-[#D0F198]/50 focus-within:border-[rgba(42,43,42,0.6)]">
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      className="border-0 bg-transparent px-3 py-2.5 font-sans text-sm text-[#2A2B2A] focus:outline-none focus:ring-0"
                      aria-label="Country code"
                    >
                      <option value="+44">+44</option>
                      <option value="+421">+421</option>
                      <option value="+1">+1</option>
                      <option value="+49">+49</option>
                      <option value="+33">+33</option>
                    </select>
                    <span className="self-center text-[#9ca3af]">|</span>
                    <input
                      id="billing-phone"
                      type="tel"
                      className="flex-1 min-w-0 border-0 bg-transparent px-3 py-2.5 font-sans text-sm text-[#2A2B2A] placeholder:text-[#9ca3af] focus:outline-none focus:ring-0"
                      placeholder="000 0000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel-national"
                    />
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="billing-country" className={labelClass}>Country</label>
                  <select
                    id="billing-country"
                    className={inputClass}
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Germany">Germany</option>
                    <option value="Austria">Austria</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="billing-district" className={labelClass}>District</label>
                  <select
                    id="billing-district"
                    className={inputClass}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    <option value="">District</option>
                    <option value="Bratislava">Bratislava</option>
                    <option value="Trnava">Trnava</option>
                    <option value="Nitra">Nitra</option>
                    <option value="Žilina">Žilina</option>
                    <option value="Banská Bystrica">Banská Bystrica</option>
                    <option value="Prešov">Prešov</option>
                    <option value="Košice">Košice</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="billing-city" className={labelClass}>City</label>
                  <select
                    id="billing-city"
                    className={inputClass}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  >
                    <option value="">City</option>
                    <option value="Bratislava">Bratislava</option>
                    <option value="Košice">Košice</option>
                    <option value="Prešov">Prešov</option>
                    <option value="Žilina">Žilina</option>
                    <option value="Nitra">Nitra</option>
                    <option value="Banská Bystrica">Banská Bystrica</option>
                    <option value="Trnava">Trnava</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="billing-zip" className={labelClass}>Zip code</label>
                  <input
                    id="billing-zip"
                    className={inputClass}
                    placeholder="1234"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    autoComplete="postal-code"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="billing-address" className={labelClass}>Street Address</label>
                <input
                  id="billing-address"
                  className={inputClass}
                  placeholder="Street Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="street-address"
                  required
                />
              </div>
            </section>

            {/* Payment card */}
            <section className={cardClass}>
              <h2 className="font-sans text-lg font-bold text-[#2A2B2A] mb-4">
                Payment
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-4 h-4 text-[#D0F198] focus:ring-[#D0F198]"
                  />
                  <span className="font-sans text-sm text-[#2A2B2A]">Cash On delivery</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="w-4 h-4 text-[#D0F198] focus:ring-[#D0F198]"
                  />
                  <span className="font-sans text-sm text-[#2A2B2A]">Pay with Card</span>
                  <span className="flex items-center gap-1 ml-2 text-xs text-[#6b7280]">
                    MasterCard · VISA · G Pay · Pay
                  </span>
                </label>
              </div>

              {paymentMethod === "card" && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="card-number" className={labelClass}>Card Number</label>
                    <input
                      id="card-number"
                      className={inputClass}
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      autoComplete="cc-number"
                      required={paymentMethod === "card"}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="card-cvv" className={labelClass}>CVV</label>
                      <input
                        id="card-cvv"
                        className={inputClass}
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        autoComplete="cc-csc"
                        required={paymentMethod === "card"}
                      />
                    </div>
                    <div>
                      <label htmlFor="card-expiry" className={labelClass}>Expiration Date</label>
                      <input
                        id="card-expiry"
                        className={inputClass}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        autoComplete="cc-exp"
                        required={paymentMethod === "card"}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="card-name" className={labelClass}>Name Of Card</label>
                    <input
                      id="card-name"
                      className={inputClass}
                      placeholder="Name of Card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required={paymentMethod === "card"}
                    />
                  </div>
                </div>
              )}

              <label className="flex items-center gap-3 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useShippingAsBilling}
                  onChange={(e) => setUseShippingAsBilling(e.target.checked)}
                  className="w-4 h-4 rounded border-[#e5e5e5] text-[#D0F198] focus:ring-[#D0F198]"
                />
                <span className="font-sans text-sm text-[#2A2B2A]">
                  Use shipping address as billing address
                </span>
              </label>

            </section>

            {/* Remember me card */}
            <section className={cardClass}>
              <h2 className="font-sans text-lg font-bold text-[#2A2B2A] mb-4">
                Remember me
              </h2>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[#e5e5e5] text-[#D0F198] focus:ring-[#D0F198]"
                />
                <span className="font-sans text-sm text-[#2A2B2A]">
                  Save my information for a faster checkout
                </span>
              </label>
              <div className="mt-4">
                <label htmlFor="remember-phone" className={labelClass}>Phone Number</label>
                <div className="flex rounded border-[0.5px] border-[rgba(42,43,42,0.6)] bg-transparent overflow-hidden focus-within:ring-2 focus-within:ring-[#D0F198]/50 focus-within:border-[rgba(42,43,42,0.6)]">
                  <select
                    value={rememberPhoneCode}
                    onChange={(e) => setRememberPhoneCode(e.target.value)}
                    className="border-0 bg-transparent px-3 py-2.5 font-sans text-sm text-[#2A2B2A] focus:outline-none focus:ring-0"
                    aria-label="Country code"
                  >
                    <option value="+44">+44</option>
                    <option value="+421">+421</option>
                    <option value="+1">+1</option>
                    <option value="+49">+49</option>
                    <option value="+33">+33</option>
                  </select>
                  <span className="self-center text-[#9ca3af]">|</span>
                  <input
                    id="remember-phone"
                    type="tel"
                    className="flex-1 min-w-0 border-0 bg-transparent px-3 py-2.5 font-sans text-sm text-[#2A2B2A] placeholder:text-[#9ca3af] focus:outline-none focus:ring-0"
                    placeholder="000 0000 000"
                    value={rememberPhoneNumber}
                    onChange={(e) => setRememberPhoneNumber(e.target.value)}
                    autoComplete="tel-national"
                  />
                </div>
              </div>
              <p className="font-sans text-xs text-[#6b7280] mt-2">
                Secure and encrypted
              </p>
            </section>
          </form>

          {/* Order Summary card */}
          <aside className="lg:col-span-5">
            <div className="sticky top-24 bg-white rounded-lg p-6 md:p-8 space-y-5 shadow-sm">
              <h2 className="font-sans text-2xl font-bold text-[#2A2B2A]">
                Order Summary
              </h2>

              <ul className="space-y-5">
                {items.map((item, index) => (
                  <li
                    key={`${item.productId}-${item.variationId ?? index}`}
                    className="flex gap-4 items-center"
                  >
                    <div className="relative w-14 h-14 rounded overflow-hidden bg-[#f5f5f5] shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-normal text-[#2A2B2A] truncate">
                        {item.name}
                      </p>
                    </div>
                    <p className="font-sans text-sm font-bold text-[#2A2B2A] shrink-0 text-right">
                      € {item.price.toFixed(2)} EUR
                      {item.quantity > 1 && ` × ${item.quantity}`}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between gap-4 pt-2">
                <h3 className="font-sans text-xl font-bold text-[#2A2B2A]">
                  Product Lists
                </h3>
                <Link
                  href="/cart"
                  className="font-sans text-sm text-[#2A2B2A] hover:opacity-80 underline shrink-0"
                >
                  Edit Products
                </Link>
              </div>

              <div className="pt-2">
                <p className="font-sans text-sm font-medium text-[#2A2B2A] mb-2">
                  Discount Voucher
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="w-full rounded border border-[#e5e5e5] bg-white px-3 py-2.5 font-sans text-sm text-[#2A2B2A] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#D0F198]/50"
                    placeholder="Discount Voucher"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="shrink-0 px-4 py-2.5 rounded-none bg-[#D0F198] text-[#2A2B2A] font-sans text-sm font-medium hover:opacity-90"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="space-y-2 font-sans text-sm pt-2 border-t border-[#e5e5e5]">
                <div className="flex justify-between text-[#2A2B2A]">
                  <span>Sub Total</span>
                  <span className="text-right">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#2A2B2A]">
                  <span>Discount</span>
                  <span className="text-right">€{discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#2A2B2A]">
                  <span>Delivery Fee</span>
                  <span className="text-right">€{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#2A2B2A] pt-3 border-t border-[#e5e5e5]">
                  <span>Total</span>
                  <span className="text-right">€{total.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <p className="font-sans text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                form="checkout-form"
                disabled={loading || items.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 rounded-none bg-[#D0F198] text-[#2A2B2A] py-3.5 font-sans text-sm font-bold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D0F198]/60 focus:ring-offset-2"
              >
                {loading ? "Placing order..." : "Confirm Order"}
                <span aria-hidden>→</span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
