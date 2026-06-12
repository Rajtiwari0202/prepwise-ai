import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "prepwise-ai",
    timestamp: new Date().toISOString(),
  });
}
