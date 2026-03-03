import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const useSmtp = !!(smtpHost && smtpUser && smtpPass);

const fromEmail = process.env.SMTP_FROM_EMAIL ?? "Spinkit <hello@spinkit.shop>";

let smtpTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;
if (useSmtp) {
  smtpTransporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });
}

function emailLayout(content: string, preheader?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${preheader ? `<meta name="preheader" content="${preheader}">` : ""}
  <title>Spinkit</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f3f0; color: #1f2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f3f0;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%); padding: 32px 40px; text-align: center;">
              <span style="font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">Spinkit</span>
              <div style="height: 4px; width: 48px; background: #a3e635; margin: 12px auto 0; border-radius: 2px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center;">
                Spinkit · hello@spinkit.shop
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

function buttonStyle(href: string, label: string): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
      <tr>
        <td>
          <a href="${href}" style="display: inline-block; padding: 14px 28px; background: #a3e635; color: #1f2937; font-weight: 600; font-size: 14px; text-decoration: none; border-radius: 8px;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `;
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
  console.log("[Email] No SMTP configured – email skipped to:", to);
  return { ok: true };
}

export async function sendVerificationEmail(
  to: string,
  verificationUrl: string
): Promise<{ ok: boolean; sent: boolean; error?: string }> {
  if (!useSmtp) {
    console.log("[Auth] No email config – verification link (open in browser):", verificationUrl);
    return { ok: true, sent: false };
  }
  const content = `
    <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #1f2937;">Verify your email</h2>
    <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #4b5563;">
      Thanks for signing up! Please verify your email address by clicking the button below.
    </p>
    ${buttonStyle(verificationUrl, "Verify email address")}
    <p style="margin: 24px 0 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
      This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
    </p>
  `;
  const result = await sendEmail(
    to,
    "Verify your Spinkit account",
    emailLayout(content, "Verify your email address")
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
  if (!useSmtp) {
    console.log("[Order] No email config – order confirmation skipped for:", to);
    return { ok: true };
  }
  const { name, items, subtotal, discount = 0, coupon, shipping, total } = options;
  const itemsRows = items
    .map(
      (i) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #1f2937;">${i.name}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; text-align: center;">${i.quantity}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #1f2937; text-align: right;">€${(i.price * i.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  const content = `
    <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 600; color: #1f2937;">Thanks for your order!</h2>
    <p style="margin: 0 0 24px; font-size: 15px; color: #6b7280;">Hi${name ? ` ${name}` : ""}, we've received your order.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 8px 0; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Item</th>
          <th style="text-align: center; padding: 8px 0; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
          <th style="text-align: right; padding: 8px 0; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f9fafb; border-radius: 8px; padding: 16px;">
      <tr><td style="padding: 4px 0; font-size: 14px; color: #6b7280;">Subtotal</td><td style="padding: 4px 0; font-size: 14px; color: #1f2937; text-align: right;">€${subtotal.toFixed(2)}</td></tr>
      ${discount > 0 ? `<tr><td style="padding: 4px 0; font-size: 14px; color: #6b7280;">Discount${coupon ? ` (${coupon})` : ""}</td><td style="padding: 4px 0; font-size: 14px; color: #059669; text-align: right;">-€${discount.toFixed(2)}</td></tr>` : ""}
      <tr><td style="padding: 4px 0; font-size: 14px; color: #6b7280;">Shipping</td><td style="padding: 4px 0; font-size: 14px; color: #1f2937; text-align: right;">€${shipping.toFixed(2)}</td></tr>
      <tr><td style="padding: 12px 0 4px; font-size: 16px; font-weight: 600; color: #1f2937;">Total</td><td style="padding: 12px 0 4px; font-size: 16px; font-weight: 600; color: #1f2937; text-align: right;">€${total.toFixed(2)}</td></tr>
    </table>
  `;
  return sendEmail(
    to,
    "Your Spinkit order confirmation",
    emailLayout(content, "Thanks for your order")
  );
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<{ ok: boolean; error?: string }> {
  if (!useSmtp) {
    console.log("[Auth] No email config – reset link (open in browser):", resetUrl);
    return { ok: true };
  }
  const content = `
    <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #1f2937;">Reset your password</h2>
    <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #4b5563;">
      You requested a password reset. Click the button below to set a new password.
    </p>
    ${buttonStyle(resetUrl, "Reset password")}
    <p style="margin: 24px 0 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
      This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
    </p>
  `;
  return sendEmail(
    to,
    "Reset your Spinkit password",
    emailLayout(content, "Reset your password")
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
  if (!useSmtp) {
    console.log("[Order] No email config – status update skipped for:", to);
    return { ok: true };
  }
  const { orderId, name, status, trackingNumber, trackingCarrier } = options;
  const orderShort = orderId.slice(-8).toUpperCase();

  let subject: string;
  let content: string;

  switch (status) {
    case "PAID":
      subject = "Your Spinkit order has been paid";
      content = `
        <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #1f2937;">Order confirmed</h2>
        <p style="margin: 0 0 8px; font-size: 15px; color: #4b5563;">Hi${name ? ` ${name}` : ""},</p>
        <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #4b5563;">
          Your order <strong style="color: #1e3a5f;">#${orderShort}</strong> has been confirmed and paid.
        </p>
        <p style="margin: 0; font-size: 14px; color: #6b7280;">We're preparing your items for shipment.</p>
      `;
      break;
    case "SHIPPED":
      subject = "Your Spinkit order has shipped";
      const trackingInfo =
        trackingNumber && trackingCarrier
          ? `<p style="margin: 16px 0 0; padding: 16px; background: #f0fdf4; border-radius: 8px; font-size: 14px; color: #166534;"><strong>Track your package:</strong> ${trackingCarrier} – ${trackingNumber}</p>`
          : trackingNumber
            ? `<p style="margin: 16px 0 0; padding: 16px; background: #f0fdf4; border-radius: 8px; font-size: 14px; color: #166534;"><strong>Tracking:</strong> ${trackingNumber}</p>`
            : "";
      content = `
        <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #1f2937;">Your order has shipped!</h2>
        <p style="margin: 0 0 8px; font-size: 15px; color: #4b5563;">Hi${name ? ` ${name}` : ""},</p>
        <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #4b5563;">
          Your order <strong style="color: #1e3a5f;">#${orderShort}</strong> is on its way.
        </p>
        ${trackingInfo}
      `;
      break;
    case "CANCELLED":
      subject = "Your Spinkit order was cancelled";
      content = `
        <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #1f2937;">Order cancelled</h2>
        <p style="margin: 0 0 8px; font-size: 15px; color: #4b5563;">Hi${name ? ` ${name}` : ""},</p>
        <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #4b5563;">
          Your order <strong style="color: #1e3a5f;">#${orderShort}</strong> has been cancelled.
        </p>
        <p style="margin: 0; font-size: 14px; color: #6b7280;">If you have questions, please contact us.</p>
      `;
      break;
    default:
      return { ok: true };
  }

  return sendEmail(to, subject, emailLayout(content));
}

export async function sendContactNotificationEmail(options: {
  name: string;
  email: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  const to = process.env.CONTACT_EMAIL ?? "hello@spinkit.shop";
  if (!useSmtp) {
    console.log("[Contact] No email config – notification skipped to:", to);
    return { ok: true };
  }
  const { name, email, message } = options;
  const escapedMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
  const content = `
    <h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #1f2937;">New contact form message</h2>
    <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;"><strong>From:</strong> ${name} &lt;${email}&gt;</p>
    <div style="margin: 16px 0 0; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #a3e635;">
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1f2937;">${escapedMessage}</p>
    </div>
  `;
  return sendEmail(
    to,
    `New contact form: ${name}`,
    emailLayout(content, `New message from ${name}`)
  );
}
