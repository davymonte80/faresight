import { getSeatMaps } from "@/lib/amadeus";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { flightOffers } = body;

    if (!flightOffers) {
      return NextResponse.json(
        { error: "Flight offers are required" },
        { status: 400 },
      );
    }

    const result = await getSeatMaps(flightOffers);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Seatmap API error:", error);
    return NextResponse.json(
      { error: "Failed to get seatmaps" },
      { status: 500 },
    );
  }
}
