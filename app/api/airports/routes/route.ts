import { getAirportRoutes } from "@/lib/amadeus";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const airportCode = searchParams.get("airportCode");

    if (!airportCode) {
      return NextResponse.json(
        { error: "Airport code is required" },
        { status: 400 },
      );
    }

    const result = await getAirportRoutes(airportCode);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Airport routes API error:", error);
    return NextResponse.json(
      { error: "Failed to get airport routes" },
      { status: 500 },
    );
  }
}
