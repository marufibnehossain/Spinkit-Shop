import { Resend } from "resend";
import nodemailer from "nodemailer";

// Transport: prefer SMTP if configured, else Resend
const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const useSmtp = !!(smtpHost && smtpUser && smtpPass);

const resend = !useSmtp && process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const fromEmail = useSmtp
  ? (process.env.SMTP_FROM_EMAIL ?? "Spinkit Shop <noreply@spinkit.shop>")
  : (process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev");

let smtpTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;
if (useSmtp) {
  smtpTransporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });
}

async function sendEmail(to: string, subject: string, html: string): Promise<{ ok: boolean; error?: string }> {
  if (useSmtp && smtpTransporter) {
    try {
      await smtpTransporter.sendMail({
        from: fromEmail,
        to,
        subject,
        html,
      });
      return { ok: true };
    } catch (e) {
      console.error("[Email] SMTP error:", e);
      return { ok: false, error: e instanceof Error ? e.message : "Failed to send email" };
    }
  }
  if (resend) {
    try {
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: [to],
        subject,
        html,
      });
      if (error) {
        console.error("[Email] Resend error:", error);
        return { ok: false, error: error.message };
      }
      return { ok: true };
    } catch (e) {
      console.error("[Email] Resend exception:", e);
      return { ok: false, error: e instanceof Error ? e.message : "Failed to send email" };
    }
  }
  console.log("[Email] No SMTP or RESEND configured – email skipped to:", to);
  return { ok: true };
}

export async function sendVerificationEmail(
  to: string,
  verificationUrl: string
): Promise<{ ok: boolean; sent: boolean; error?: string }> {
  if (!useSmtp && !resend) {
    console.log("[Auth] No email config – verification link (open in browser):", verificationUrl);
    return { ok: true, sent: false };
  }
  const result = await sendEmail(
    to,
    "Verify your Spinkit Shop account",
    `
    <p>Thanks for signing up. Please verify your email by clicking the link below:</p>
    <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    <p>This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
    <p>— Spinkit Shop</p>
  `
  );
  return { ok: result.ok, sent: result.ok, error: result.error };
}

export interface OrderConfirmationItem {
  name: string;
  quantity: number;
  price: number;
}

export async function sendOrderConfirmationEmail(
  to: string,
  options: {
    name?: string;
    items: OrderConfirmationItem[];
    subtotal: number;
    discount?: number;
    coupon?: string;
    shipping: number;
    total: number;
  }
): Promise<{ ok: boolean; error?: string }> {
  if (!useSmtp && !resend) {
    console.log("[Order] No email config – order confirmation skipped for:", to);
    return { ok: true };
  }
  const { name, items, subtotal, discount = 0, coupon, shipping, total } = options;
  const itemsRows = items
    .map(
      (i) =>
        `<tr><td>${i.name}</td><td>${i.quantity}</td><td>€${(i.price * i.quantity).toFixed(2)}</td></tr>`
    )
    .join("");
  return sendEmail(
    to,
    "Your Spinkit Shop order confirmation",
    `
    <p>Hi${name ? ` ${name}` : ""},</p>
    <p>Thanks for your order. Here's a summary:</p>
    <table style="width:100%; border-collapse: collapse; margin: 1rem 0;">
      <thead><tr style="border-bottom: 1px solid #ddd;"><th style="text-align:left;">Item</th><th>Qty</th><th style="text-align:right;">Total</th></tr></thead>
      <tbody>${itemsRows}</tbody>
    </table>
    <p>Subtotal: €${subtotal.toFixed(2)}</p>
    ${discount > 0 ? `<p>Discount${coupon ? ` (${coupon})` : ""}: -€${discount.toFixed(2)}</p>` : ""}
    <p>Shipping: €${shipping.toFixed(2)}</p>
    <p><strong>Total: €${total.toFixed(2)}</strong></p>
    <p>— Spinkit Shop</p>
  `
  );
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<{ ok: boolean; error?: string }> {
  if (!useSmtp && !resend) {
    console.log("[Auth] No email config – reset link (open in browser):", resetUrl);
    return { ok: true };
  }
  return sendEmail(
    to,
    "Reset your Spinkit Shop password",
    `
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
    <p>— Spinkit Shop</p>
  `
  );
}

export interface OrderStatusEmailOptions {
  orderId: string;
  name?: string | null;
  status: string;
  trackingNumber?: string | null;
  trackingCarrier?: string | null;
}

export async function sendOrderStatusEmail(
  to: string,
  options: OrderStatusEmailOptions
): Promise<{ ok: boolean; error?: string }> {
  if (!useSmtp && !resend) {
    console.log("[Order] No email config – status update skipped for:", to);
    return { ok: true };
  }
  const { orderId, name, status, trackingNumber, trackingCarrier } = options;

  let subject: string;
  let body: string;

  switch (status) {
    case "PAID":
      subject = "Your Spinkit Shop order has been paid";
      body = `
        <p>Hi${name ? ` ${name}` : ""},</p>
        <p>Your order <strong>#${orderId.slice(-8)}</strong> has been confirmed and paid.</p>
        <p>We're preparing your items for shipment.</p>
        <p>— Spinkit Shop</p>
      `;
      break;
    case "SHIPPED":
      subject = "Your Spinkit Shop order has shipped";
      const trackingInfo =
        trackingNumber && trackingCarrier
          ? `<p>Track your package: <strong>${trackingCarrier}</strong> – ${trackingNumber}</p>`
          : trackingNumber
            ? `<p>Tracking number: <strong>${trackingNumber}</strong></p>`
            : "";
      body = `
        <p>Hi${name ? ` ${name}` : ""},</p>
        <p>Your order <strong>#${orderId.slice(-8)}</strong> has shipped!</p>
        ${trackingInfo}
        <p>— Spinkit Shop</p>
      `;
      break;
    case "CANCELLED":
      subject = "Your Spinkit Shop order was cancelled";
      body = `
        <p>Hi${name ? ` ${name}` : ""},</p>
        <p>Your order <strong>#${orderId.slice(-8)}</strong> has been cancelled.</p>
        <p>If you have questions, please contact us.</p>
        <p>— Spinkit Shop</p>
      `;
      break;
    default:
      return { ok: true };
  }

  return sendEmail(to, subject, body);
}
