import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import FormatPrice from "@/components/FormatPrice";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface PageProps {
  searchParams: Promise<{ orderId?: string }> | { orderId?: string };
}

export default async function CheckoutSuccessPage(props: PageProps) {
  const searchParams = await Promise.resolve(props.searchParams);
  const orderId = searchParams.orderId;

  if (!orderId) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-lg text-center space-y-4">
          <p className="font-sans text-lg text-[#2A2B2A]">Order not found.</p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-none border border-[#2A2B2A] bg-white text-[#2A2B2A] px-6 py-3 font-sans text-sm font-medium hover:bg-[#f5f5f5]"
          >
            <span aria-hidden>←</span> Back to Shop
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
          <p className="font-sans text-lg text-[#2A2B2A]">We couldn&apos;t find that order.</p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-none border border-[#2A2B2A] bg-white text-[#2A2B2A] px-6 py-3 font-sans text-sm font-medium hover:bg-[#f5f5f5]"
          >
            <span aria-hidden>←</span> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const productIds = Array.from(new Set(order.items.map((i) => i.productId)));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, images: true, productCode: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const createdAt = new Date(order.createdAt);
  const subtotal = order.subtotalCents;
  const discount = order.discountCents;
  const shipping = order.shippingCents;
  const total = order.totalCents;
  const userName = order.name?.trim() || "you";
  const fullAddress = [order.address, order.city, order.zip, order.country].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-[#F0F0F0] overflow-x-hidden">
      <div className="max-w-[1315px] mx-auto px-4 md:px-6 py-8 md:py-12 w-full min-w-0">
        <div className="max-w-3xl mx-auto min-w-0">
          {/* Success message card */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-6">
            <div className="flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-full border-2 border-dashed border-[#22c55e] flex items-center justify-center mb-4"
                aria-hidden
              >
                <svg className="w-8 h-8 text-[#22c55e]" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="font-sans text-xl sm:text-2xl md:text-3xl font-bold text-[#2A2B2A] break-words">
                Thanks {userName}, your order was placed successfully
              </h1>
              <p className="mt-2 font-sans text-sm md:text-base text-[#2A2B2A]/90 max-w-xl">
                We will send the latest information and updates about your order to{" "}
                <span className="font-medium text-[#2A2B2A]">{order.email}</span>
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-none border border-[#2A2B2A] bg-white text-[#2A2B2A] px-6 py-3 font-sans text-sm font-medium hover:bg-[#f5f5f5]"
              >
                <span aria-hidden>←</span> Back to Shop
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-none bg-[#D0F198] text-[#2A2B2A] px-6 py-3 font-sans text-sm font-medium hover:opacity-90"
                aria-label="Download receipt (coming soon)"
              >
                Download Receipt
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Order details card */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 overflow-hidden">
            <h2 className="font-sans text-xl font-bold text-[#2A2B2A] mb-4">
              Order Details
            </h2>

            {/* Desktop: table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[500px] font-sans text-sm text-[#2A2B2A]">
                <thead>
                  <tr className="border-b border-[#e5e5e5]">
                    <th className="text-left py-3 font-semibold">Products</th>
                    <th className="text-left py-3 font-semibold">Quantity</th>
                    <th className="text-left py-3 font-semibold">SKU</th>
                    <th className="text-left py-3 font-semibold">Date</th>
                    <th className="text-right py-3 font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => {
                    const product = productMap.get(item.productId);
                    const images = product?.images ? (JSON.parse(product.images) as string[]) : [];
                    const imageUrl = images[0] ?? "/images/placeholder.svg";
                    const sku = product?.productCode ?? `#${order.id.slice(-6).toUpperCase()}`;
                    return (
                      <tr key={item.id}>
                        <td className="py-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#f5f5f5] shrink-0">
                              <Image
                                src={imageUrl}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <span className="font-normal truncate">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-4">{String(item.quantity).padStart(2, "0")}</td>
                        <td className="py-4">{sku}</td>
                        <td className="py-4">{formatDate(createdAt)}</td>
                        <td className="py-4 text-right">
                          <FormatPrice price={(item.priceCents * item.quantity) / 100} compact />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile: card layout */}
            <div className="sm:hidden space-y-4">
              {order.items.map((item) => {
                const product = productMap.get(item.productId);
                const images = product?.images ? (JSON.parse(product.images) as string[]) : [];
                const imageUrl = images[0] ?? "/images/placeholder.svg";
                const sku = product?.productCode ?? `#${order.id.slice(-6).toUpperCase()}`;
                return (
                  <div key={item.id} className="border border-[#e5e5e5] rounded-lg p-4">
                    <div className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#f5f5f5] shrink-0">
                        <Image src={imageUrl} alt="" fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-medium text-[#2A2B2A] break-words">{item.name}</p>
                        <p className="font-sans text-sm text-[#6b7280] mt-0.5">Qty: {item.quantity} · {sku}</p>
                        <p className="font-sans text-sm font-medium text-[#2A2B2A] mt-1">
                          <FormatPrice price={(item.priceCents * item.quantity) / 100} compact />
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment, Address, Delivery - three columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 pt-6 border-t border-[#e5e5e5]">
              <div>
                <h3 className="font-sans text-sm font-bold text-[#2A2B2A] mb-1">Payment Method</h3>
                <p className="font-sans text-sm text-[#2A2B2A]">VISA •••• 9966</p>
              </div>
              <div className="sm:col-span-2 md:col-span-1">
                <h3 className="font-sans text-sm font-bold text-[#2A2B2A] mb-1">Address</h3>
                <p className="font-sans text-sm text-[#2A2B2A] break-words">{fullAddress}</p>
              </div>
              <div>
                <h3 className="font-sans text-sm font-bold text-[#2A2B2A] mb-1">Delivery Method</h3>
                <p className="font-sans text-sm text-[#2A2B2A]">Standard delivery (3–5 business days)</p>
              </div>
            </div>

            {/* Order summary totals */}
            <div className="mt-6 pt-6 border-t border-[#e5e5e5] font-sans text-sm text-[#2A2B2A] overflow-hidden">
              <div className="flex justify-end min-w-0">
                <div className="space-y-2 text-right w-full sm:w-auto sm:min-w-[140px]">
                  <div className="flex justify-between gap-4">
                    <span className="shrink-0">Sub Total:</span>
                    <span><FormatPrice price={subtotal / 100} compact /></span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="shrink-0">Discount:</span>
                    <span><FormatPrice price={discount / 100} compact /></span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="shrink-0">Delivery Fee:</span>
                    <span><FormatPrice price={shipping / 100} compact /></span>
                  </div>
                  <div className="flex justify-between gap-4 font-bold pt-2 border-t border-[#e5e5e5] mt-2">
                    <span className="shrink-0">Total:</span>
                    <span><FormatPrice price={total / 100} compact /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
