import { NextResponse } from "next/server";
import path from "path";
import { prisma } from "@/lib/prisma";
import PDFDocument from "pdfkit";

const MARGIN = 50;
const PAGE_WIDTH = 595;
const ACCENT = "#a3e635";
const TEXT = "#1f2937";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  if (!orderId) {
    return NextResponse.json({ error: "Order ID required" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const createdAt = new Date(order.createdAt);
  const fullAddress = [order.address, order.city, order.zip, order.country]
    .filter(Boolean)
    .join(", ");
  const orderShortId = order.id.slice(-8).toUpperCase();
  const logoPath = path.join(process.cwd(), "public", "images", "Logo-Black.png");

  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({ margin: MARGIN, size: "A4" });

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    let y = MARGIN;

    // Logo
    try {
      doc.image(logoPath, MARGIN, y, { width: 130 });
      y += 45; // logo height + spacing
    } catch {
      doc.fontSize(24).font("Helvetica-Bold").fillColor(TEXT).text("Spinkit", MARGIN, y);
      y += 28;
    }

    // Accent bar
    doc.rect(0, y, PAGE_WIDTH, 4).fill(ACCENT);
    y += 20;

    // Order title & meta
    doc.fontSize(20).font("Helvetica-Bold").fillColor(TEXT).text("Order Receipt", MARGIN, y);
    y += 24;
    doc.fontSize(10).font("Helvetica").fillColor(MUTED).text(`Order #${orderShortId} · ${formatDate(createdAt)}`, MARGIN, y);
    y += 24;

    // Products table header
    doc.fontSize(9).font("Helvetica-Bold").fillColor(TEXT);
    doc.text("Product", MARGIN, y, { width: 280 });
    doc.text("Qty", 330, y, { width: 40 });
    doc.text("Price", 370, y, { width: 100, align: "right" });
    y += 14;
    doc.moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).stroke(BORDER);
    y += 12;

    // Products
    doc.font("Helvetica").fontSize(10).fillColor(TEXT);
    for (const item of order.items) {
      const rowY = y;
      const name = item.name.length > 45 ? item.name.slice(0, 42) + "..." : item.name;
      doc.text(name, MARGIN, rowY, { width: 280 });
      doc.text(String(item.quantity), 330, rowY, { width: 40 });
      doc.text(formatPrice(item.priceCents * item.quantity), 370, rowY, { width: 100, align: "right" });
      y = rowY + 16;
    }

    y += 8;
    doc.moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).stroke(BORDER);
    y += 16;

    // Totals
    doc.font("Helvetica").fontSize(10).fillColor(TEXT);
    doc.text("Subtotal", MARGIN, y, { width: 400 });
    doc.text(formatPrice(order.subtotalCents), 370, y, { width: 100, align: "right" });
    y += 18;
    doc.text("Discount", MARGIN, y, { width: 400 });
    doc.text(formatPrice(order.discountCents), 370, y, { width: 100, align: "right" });
    y += 18;
    doc.text("Delivery", MARGIN, y, { width: 400 });
    doc.text(formatPrice(order.shippingCents), 370, y, { width: 100, align: "right" });
    y += 24;
    doc.moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).stroke(TEXT);
    y += 18;
    doc.font("Helvetica-Bold").fontSize(12).fillColor(TEXT);
    doc.text("Total", MARGIN, y, { width: 400 });
    doc.text(formatPrice(order.totalCents), 370, y, { width: 100, align: "right" });
    y += 32;

    // Ship to section
    doc.font("Helvetica").fontSize(9).fillColor(MUTED);
    doc.text("Ship to", MARGIN, y);
    y += 14;
    doc.fontSize(10).fillColor(TEXT);
    if (order.name) {
      doc.text(order.name, MARGIN, y);
      y += 14;
    }
    doc.text(fullAddress, MARGIN, y);
    y += 14;
    doc.text(order.email, MARGIN, y);
    y += 32;

    // Footer
    doc.fontSize(9).fillColor(MUTED);
    doc.text("Thank you for your order.", MARGIN, y);
    y += 14;
    doc.text("Spinkit · hello@spinkit.shop · +421 905 557", MARGIN, y);

    doc.end();
  });

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt-${orderShortId}.pdf"`,
    },
  });
}
