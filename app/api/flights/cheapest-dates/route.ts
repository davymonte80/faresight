import { getFlightCheapestDates } from "@/lib/amadeus";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    const oneWay = searchParams.get("oneWay") === "true";
    const duration = searchParams.get("duration");

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination parameters are required" },
        { status: 400 },
      );
    }

    const result = await getFlightCheapestDates(
      origin,
      destination,
      oneWay,
      duration || undefined,
    );

    // Return empty array if no data instead of error
    if (!result || !result.data || result.data.length === 0) {
      return NextResponse.json({ data: [] });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("⚠️ Cheapest dates API error:", error);
    // Return empty data instead of 500 error
    return NextResponse.json(
      {
        data: [],
        meta: {
          fallback: true,
          message: "Using search results data",
        },
      },
      { status: 200 },
    );
  }
}
