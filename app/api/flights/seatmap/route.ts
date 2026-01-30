import { getSeatMaps } from "@/lib/amadeus";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await getSeatMaps(body.flightOffer);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Seatmap API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch seatmap" },
      { status: 500 }
    );
  }
}
