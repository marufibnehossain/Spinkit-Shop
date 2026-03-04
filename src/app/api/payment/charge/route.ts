import { NextResponse } from "next/server";
import { chargeCard } from "@/lib/payment";

/**
 * Charge a card via ccHeroes/ProcessTransact.
 * Card data is sent over HTTPS and never stored.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      amountCents,
      currency,
      cardNumber,
      cardExpiry,
      cardCvv,
      cardholderName,
      orderId,
    } = body as {
      amountCents: number;
      currency?: string;
      cardNumber: string;
      cardExpiry: string;
      cardCvv: string;
      cardholderName: string;
      orderId?: string;
    };

    const cardNum = String(cardNumber ?? "").replace(/\D/g, "");
    const cardExp = String(cardExpiry ?? "").replace(/\D/g, "");
    const cardCvvVal = String(cardCvv ?? "").trim();
    const cardNameVal = String(cardholderName ?? "").trim();

    if (
      typeof amountCents !== "number" ||
      amountCents < 1 ||
      cardNum.length < 13 ||
      cardExp.length < 4 ||
      !cardCvvVal ||
      !cardNameVal
    ) {
      const issues: string[] = [];
      if (typeof amountCents !== "number" || amountCents < 1) issues.push("amount");
      if (cardNum.length < 13) issues.push("card number (min 13 digits)");
      if (cardExp.length < 4) issues.push("expiry (MMYY)");
      if (!cardCvvVal) issues.push("CVV");
      if (!cardNameVal) issues.push("cardholder name");
      console.error("[Payment] Validation failed:", issues.join(", "));
      return NextResponse.json(
        { error: `Invalid: ${issues.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await chargeCard({
      amountCents,
      currency,
      cardNumber: cardNum,
      cardExpiry: cardExp.padStart(4, "0").slice(-4),
      cardCvv: cardCvvVal,
      cardholderName: cardNameVal,
      orderId,
    });

    if (result.ok) {
      return NextResponse.json({
        ok: true,
        transactionId: result.transactionId,
      });
    }

    console.error("[Payment] Charge declined:", result.error);
    return NextResponse.json(
      { error: result.error },
      { status: 400 }
    );
  } catch (e) {
    console.error("[Payment] Charge error:", e);
    return NextResponse.json(
      { error: "Payment failed" },
      { status: 500 }
    );
  }
}
