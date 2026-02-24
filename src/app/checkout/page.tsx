"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
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

const inputClass =
  "w-full rounded-none border border-[#d0cdc9] bg-transparent px-3 py-2.5 font-sans text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#CFFF40]/60 focus:border-[#CFFF40]";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = useMemo(() => getSubtotal(), [getSubtotal]);
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const [deliveryMethod, setDeliveryMethod] = useState<"standard">("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiryMonth, setCardExpiryMonth] = useState("");
  const [cardExpiryYear, setCardExpiryYear] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [saveAddress, setSaveAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressesLoaded, setAddressesLoaded] = useState(false);

  // Prefill basic info from session
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !firstName && !lastName) {
        const parts = session.user.name.split(" ");
        setFirstName(parts[0] ?? "");
        setLastName(parts.slice(1).join(" "));
      }
      if (session.user.email && !email) {
        setEmail(session.user.email);
      }
      setSaveAddress(true);
    }
  }, [session, firstName, lastName, email]);

  // Load saved addresses for logged-in users and prefill default one
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
        // ignore – checkout should still work
      } finally {
        setAddressesLoaded(true);
      }
    }

    loadAddresses();
  }, [session, addressesLoaded]);

  useEffect(() => {
    if (items.length === 0) {
      // Redirect to cart if there is nothing to checkout
      router.replace("/cart");
    }
  }, [items.length, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0 || loading) return;
    setLoading(true);
    setError(null);

    try {
      const fullName = `${firstName} ${lastName}`.trim() || undefined;

      const body = {
        email,
        name: fullName,
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
        discount,
        shipping,
        total,
        coupon: null,
        paymentMethod,
        deliveryMethod,
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

      // Save address for logged-in users if requested
      if (session?.user?.email && saveAddress) {
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

      clearCart();
      router.push(`/checkout/success?orderId=${encodeURIComponent(data.orderId)}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      {/* Breadcrumb */}
      <nav
        className="w-full bg-[#f5f5f0] border-b border-[#e5e5e5] py-3 md:py-4"
        aria-label="Breadcrumb"
      >
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/" className="font-sans text-sm text-muted hover:text-text transition-colors">
            ← Home
          </Link>
          <span className="font-sans text-sm text-muted mx-1">/</span>
          <Link href="/cart" className="font-sans text-sm text-muted hover:text-text transition-colors">
            Cart
          </Link>
          <span className="font-sans text-sm text-muted mx-1">/</span>
          <span className="font-sans text-sm text-text">Checkout</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="font-sans text-2xl md:text-3xl font-bold text-text mb-6">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Form sections (transparent, no card) */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-8 space-y-10"
          >
            {/* Billing address */}
            <section>
              <h2 className="font-sans text-lg md:text-xl font-semibold text-text mb-4">
                Billing address
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-sans text-xs uppercase tracking-wide text-muted">
                    First name
                  </label>
                  <input
                    className={inputClass}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-sans text-xs uppercase tracking-wide text-muted">
                    Last name
                  </label>
                  <input
                    className={inputClass}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-sans text-xs uppercase tracking-wide text-muted">
                    Email address
                  </label>
                  <input
                    type="email"
                    className={inputClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block mb-1 font-sans text-xs uppercase tracking-wide text-muted">
                    Street address
                  </label>
                  <input
                    className={inputClass}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoComplete="street-address"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block mb-1 font-sans text-xs uppercase tracking-wide text-muted">
                      City
                    </label>
                    <input
                      className={inputClass}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      autoComplete="address-level2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-sans text-xs uppercase tracking-wide text-muted">
                      ZIP / Postal code
                    </label>
                    <input
                      className={inputClass}
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      autoComplete="postal-code"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-sans text-xs uppercase tracking-wide text-muted">
                      Country
                    </label>
                    <input
                      className={inputClass}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      autoComplete="country-name"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section>
              <h2 className="font-sans text-lg md:text-xl font-semibold text-text mb-4">
                Delivery
              </h2>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value="standard"
                    checked={deliveryMethod === "standard"}
                    onChange={() => setDeliveryMethod("standard")}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-sans text-sm text-text">
                      Standard delivery (3–5 business days)
                    </p>
                    <p className="font-sans text-xs text-muted">
                      {shipping === 0 ? "Free shipping on orders over €50." : `€${shipping.toFixed(2)} EUR shipping fee.`}
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="font-sans text-lg md:text-xl font-semibold text-text mb-4">
                Payment
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    <span className="font-sans text-sm text-text">
                      Pay with card
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <span className="font-sans text-sm text-text">
                      Cash on delivery
                    </span>
                  </label>
                </div>

                {/* Card details – only required when card is selected */}
                <div className="space-y-3">
                  <div>
                    <label className="block mb-1 font-sans text-xs uppercase tracking-wide text-muted">
                      Card number
                    </label>
                    <input
                      className={inputClass}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      autoComplete="cc-number"
                      required={paymentMethod === "card"}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 font-sans text-xs uppercase tracking-wide text-muted">
                        MM
                      </label>
                      <input
                        className={inputClass}
                        value={cardExpiryMonth}
                        onChange={(e) => setCardExpiryMonth(e.target.value)}
                        placeholder="08"
                        autoComplete="cc-exp-month"
                        required={paymentMethod === "card"}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-sans text-xs uppercase tracking-wide text-muted">
                        YY
                      </label>
                      <input
                        className={inputClass}
                        value={cardExpiryYear}
                        onChange={(e) => setCardExpiryYear(e.target.value)}
                        placeholder="28"
                        autoComplete="cc-exp-year"
                        required={paymentMethod === "card"}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-sans text-xs uppercase tracking-wide text-muted">
                        CVV
                      </label>
                      <input
                        className={inputClass}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        autoComplete="cc-csc"
                        required={paymentMethod === "card"}
                      />
                    </div>
                  </div>
                </div>

                {/* Remember / save address */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    id="save-address"
                    type="checkbox"
                    className="mt-1"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    disabled={!session?.user}
                  />
                  <label
                    htmlFor="save-address"
                    className="font-sans text-sm text-text"
                  >
                    Save this address to my account for next time
                    {!session?.user && (
                      <span className="block text-xs text-muted">
                        Log in or create an account to save your address.
                      </span>
                    )}
                  </label>
                </div>

                {error && (
                  <p className="font-sans text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-none bg-[#CFFF40] text-sage-dark py-3.5 font-sans text-sm font-medium hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#CFFF40]/60 focus:ring-offset-2"
                >
                  {loading ? "Placing order..." : "Place order"}
                </button>
              </div>
            </section>
          </form>

          {/* Right: Summary card */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 bg-[#E9E6E3] rounded-xl border border-[#e0ddd9] p-6 shadow-sm space-y-4">
              <h2 className="font-sans text-lg font-bold text-text">
                Order summary
              </h2>

              <div className="space-y-2 font-sans text-sm border-t border-[#d0cdc9] pt-4">
                <div className="flex justify-between text-muted">
                  <span>Items</span>
                  <span>{items.reduce((n, i) => n + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "€0.00" : `€${shipping.toFixed(2)}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-muted">
                    <span>Discount</span>
                    <span>-€{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-text pt-2 border-t border-[#d0cdc9]">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-[#d0cdc9] pt-4 space-y-2 font-sans text-xs text-muted">
                <p>
                  All prices are shown in EUR. You’ll receive an order
                  confirmation by email after placing your order.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

