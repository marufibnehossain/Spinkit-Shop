import { NextResponse } from "next/server";
import { isCodEnabled } from "@/lib/checkout-settings";

export async function GET() {
  try {
    const codEnabled = await isCodEnabled();
    return NextResponse.json({ codEnabled });
  } catch {
    return NextResponse.json({ codEnabled: true });
  }
}
