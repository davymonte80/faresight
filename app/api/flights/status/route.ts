import { getFlightStatus } from "@/lib/amadeus";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const carrierCode = searchParams.get("carrierCode");
    const flightNumber = searchParams.get("flightNumber");
    const scheduledDepartureDate = searchParams.get("scheduledDepartureDate");

    if (!carrierCode || !flightNumber || !scheduledDepartureDate) {
      return NextResponse.json(
        {
          error:
            "Carrier code, flight number, and scheduled departure date are required",
        },
        { status: 400 },
      );
    }

    const result = await getFlightStatus(
      carrierCode,
      flightNumber,
      scheduledDepartureDate,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Flight status API error:", error);
    return NextResponse.json(
      { error: "Failed to get flight status" },
      { status: 500 },
    );
  }
}
