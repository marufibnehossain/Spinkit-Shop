import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatEUR(cents: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

interface PageProps {
  searchParams: { orderId?: string };
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const orderId = searchParams.orderId;

  if (!orderId) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-lg text-center space-y-4">
          <p className="font-sans text-lg text-text">
            Order not found.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-none bg-[#CFFF40] text-sage-dark px-6 py-3 font-sans text-sm font-medium hover:opacity-90"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-lg text-center space-y-4">
          <p className="font-sans text-lg text-text">
            We couldn&apos;t find that order.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-none bg-[#CFFF40] text-sage-dark px-6 py-3 font-sans text-sm font-medium hover:opacity-90"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const createdAt = new Date(order.createdAt);
  const subtotal = order.subtotalCents;
  const discount = order.discountCents;
  const shipping = order.shippingCents;
  const total = order.totalCents;

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center px-4 py-10 md:py-16">
      <div className="w-full max-w-3xl">
        <div className="bg-white border border-[#e5e5e5] rounded-xl shadow-sm px-6 py-6 md:px-8 md:py-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-sage-1 border border-sage-2 flex items-center justify-center text-sage-dark text-2xl mb-4" aria-hidden>
              ✓
            </div>
            <h1 className="font-sans text-2xl md:text-3xl font-bold text-text">
              Thank you for your order
            </h1>
            <p className="mt-2 font-sans text-sm md:text-base text-muted max-w-xl">
              We&apos;ve sent a confirmation email to{" "}
              <span className="font-medium text-text">{order.email}</span>. Your items will
              ship soon.
            </p>
            <p className="mt-1 font-sans text-xs text-muted">
              Order ID: <span className="font-mono text-text">{order.id}</span> ·{" "}
              {createdAt.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: items */}
            <div className="space-y-4">
              <h2 className="font-sans text-sm font-semibold text-text uppercase tracking-wide">
                Items
              </h2>
              <ul className="divide-y divide-[#e5e5e5]">
                {order.items.map((item) => (
                  <li key={item.id} className="py-3 flex justify-between gap-4">
                    <div>
                      <p className="font-sans text-sm text-text">
                        {item.name}
                      </p>
                      {item.variationLabel && (
                        <p className="font-sans text-xs text-muted">
                          {item.variationLabel}
                        </p>
                      )}
                      <p className="font-sans text-xs text-muted mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-sans text-sm text-text">
                        {formatEUR(item.priceCents * item.quantity)}
                      </p>
                      <p className="font-sans text-xs text-muted">
                        {formatEUR(item.priceCents)} each
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: totals + address */}
            <div className="space-y-6">
              <div>
                <h2 className="font-sans text-sm font-semibold text-text uppercase tracking-wide mb-2">
                  Shipping address
                </h2>
                <div className="font-sans text-sm text-text">
                  {order.name && <p>{order.name}</p>}
                  <p>{order.address}</p>
                  <p>
                    {order.zip} {order.city}
                  </p>
                  <p>{order.country}</p>
                </div>
              </div>

              <div>
                <h2 className="font-sans text-sm font-semibold text-text uppercase tracking-wide mb-2">
                  Summary
                </h2>
                <div className="space-y-1 font-sans text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span>{formatEUR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Shipping</span>
                    <span>{formatEUR(shipping)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-muted">
                      <span>Discount</span>
                      <span>-{formatEUR(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-text pt-2 border-t border-[#e5e5e5] mt-1">
                    <span>Total</span>
                    <span>{formatEUR(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center sm:justify-between">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-none bg-[#CFFF40] text-sage-dark px-6 py-3 font-sans text-sm font-medium hover:opacity-90"
            >
              Continue shopping
            </Link>
            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center gap-2 rounded-none border border-[#d0cdc9] bg-transparent text-text px-6 py-3 font-sans text-sm font-medium hover:bg-[#f5f5f5]"
            >
              View my orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
