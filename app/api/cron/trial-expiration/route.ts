import { NextResponse } from "next/server";
import { expireTrials } from "@/lib/billing";

export async function GET() {
  const count = await expireTrials();
  return NextResponse.json({ ok: true, expired: count });
}
