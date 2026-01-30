import { getFlightPriceAnalysis } from "@/lib/amadeus";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    const departureDate = searchParams.get("departureDate");

    if (!origin || !destination || !departureDate) {
      return NextResponse.json(
        { error: "Origin, destination, and departureDate are required" },
        { status: 400 },
      );
    }

    const result = await getFlightPriceAnalysis(
      origin,
      destination,
      departureDate,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Price analysis API error:", error);
    return NextResponse.json(
      { error: "Failed to get price analysis" },
      { status: 500 },
    );
  }
}
