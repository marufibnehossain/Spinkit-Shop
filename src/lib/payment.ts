/**
 * ccHeroes / ProcessTransact payment gateway integration
 *
 * Test: https://sandbox.processtransact.com/api/json.ashx
 * Live: https://gw.processtransact.com/api/json.ashx
 *
 * Config: Admin → Payment, or env vars CCHEROES_*
 */

import { getPaymentConfig } from "./payment-config";

const TEST_URL = "https://sandbox.processtransact.com/api/json.ashx";
const LIVE_URL = "https://gw.processtransact.com/api/json.ashx";

export type PaymentResult =
  | { ok: true; transactionId?: string }
  | { ok: false; error: string };

export async function chargeCard(params: {
  amountCents: number;
  currency?: string;
  cardNumber: string;
  cardExpiry: string; // MMYY
  cardCvv: string;
  cardholderName: string;
  orderId?: string;
}): Promise<PaymentResult> {
  const config = await getPaymentConfig();
  const { merchantName, merchantPassword, useTestMode } = config;

  if (!merchantName || !merchantPassword) {
    return {
      ok: false,
      error: "Payment gateway not configured. Go to Admin → Payment to add credentials, or set CCHEROES_TEST_MERCHANT_NAME and CCHEROES_TEST_MERCHANT_PASSWORD in .env (for test mode).",
    };
  }

  const url = useTestMode ? TEST_URL : LIVE_URL;
  const cardNumber = params.cardNumber.replace(/\D/g, "");

  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return { ok: false, error: "Invalid card number" };
  }

  // ProcessTransact typically expects MMYY format
  const expiry = params.cardExpiry.replace(/\D/g, "").padStart(4, "0").slice(-4);
  const mm = expiry.slice(0, 2);
  const yy = expiry.slice(-2);
  if (expiry.length < 4 || mm.length !== 2 || yy.length !== 2) {
    return { ok: false, error: "Invalid expiry (use MM/YY)" };
  }

  const body: Record<string, unknown> = {
    merchant_name: merchantName,
    merchant_password: merchantPassword,
    amount: params.amountCents,
    currency: params.currency ?? "EUR",
    card_number: cardNumber,
    card_expiry: `${mm}${yy}`,
    cvv: params.cardCvv,
    cardholder_name: params.cardholderName,
    order_id: params.orderId ?? `ORD-${Date.now()}`,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;

    if (!res.ok) {
      const msg = (data.error as string) ?? (data.message as string) ?? `HTTP ${res.status}`;
      return { ok: false, error: String(msg) };
    }

    // Common success indicators - adjust based on actual API response
    const approved = data.approved === true || data.status === "approved" || data.result === "0";
    const declined = data.declined === true || data.status === "declined";

    if (declined) {
      const msg = (data.decline_reason as string) ?? (data.message as string) ?? "Payment declined";
      return { ok: false, error: String(msg) };
    }

    if (approved) {
      return {
        ok: true,
        transactionId: (data.transaction_id ?? data.id ?? data.reference) as string | undefined,
      };
    }

    // If response format differs, treat 2xx as success
    if (res.ok && res.status >= 200 && res.status < 300) {
      return {
        ok: true,
        transactionId: (data.transaction_id ?? data.id) as string | undefined,
      };
    }

    return {
      ok: false,
      error: (data.error as string) ?? (data.message as string) ?? "Payment failed",
    };
  } catch (e) {
    console.error("[Payment] ProcessTransact error:", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Payment service unavailable",
    };
  }
}
