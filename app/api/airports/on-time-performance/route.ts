import { getAirportOnTimePerformance } from "@/lib/amadeus";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const airportCode = searchParams.get("airportCode");
    const date = searchParams.get("date");

    if (!airportCode || !date) {
      return NextResponse.json(
        { error: "Airport code and date are required" },
        { status: 400 },
      );
    }

    const result = await getAirportOnTimePerformance(airportCode, date);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Airport on-time performance API error:", error);
    return NextResponse.json(
      { error: "Failed to get airport on-time performance" },
      { status: 500 },
    );
  }
}
