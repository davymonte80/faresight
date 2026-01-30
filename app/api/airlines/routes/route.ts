import { getAirlineRoutes } from "@/lib/amadeus";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const airlineCode = request.nextUrl.searchParams.get("airlineCode");
    
    if (!airlineCode) {
      return NextResponse.json({ error: "Airline code required" }, { status: 400 });
    }

    const result = await getAirlineRoutes(airlineCode);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Airline routes error:", error);
    return NextResponse.json({ error: "Failed to fetch routes" }, { status: 500 });
  }
}
