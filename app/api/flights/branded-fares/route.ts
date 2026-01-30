import { getBrandedFares } from "@/lib/amadeus";
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

    const result = await getBrandedFares(flightOffers);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Branded fares API error:", error);
    return NextResponse.json(
      { error: "Failed to get branded fares" },
      { status: 500 },
    );
  }
}
