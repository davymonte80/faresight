import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/amadeus";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const originLocationCode = searchParams.get("originLocationCode");
    const destinationLocationCode = searchParams.get("destinationLocationCode");
    const departureDate = searchParams.get("departureDate");
    const adults = searchParams.get("adults") || "1";
    const returnDate = searchParams.get("returnDate");
    const travelClass = searchParams.get("travelClass");
    const includedAirlineCodes = searchParams.get("includedAirlineCodes");
    const excludedAirlineCodes = searchParams.get("excludedAirlineCodes");
    const nonStop = searchParams.get("nonStop");

    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      return NextResponse.json(
        { error: "Origin, destination, and departure date are required" },
        { status: 400 },
      );
    }

    const token = await getAccessToken();
    let url = `https://test.api.amadeus.com/v1/shopping/availability/flight-availabilities?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${departureDate}&adults=${adults}`;

    if (returnDate) url += `&returnDate=${returnDate}`;
    if (travelClass) url += `&travelClass=${travelClass}`;
    if (includedAirlineCodes)
      url += `&includedAirlineCodes=${includedAirlineCodes}`;
    if (excludedAirlineCodes)
      url += `&excludedAirlineCodes=${excludedAirlineCodes}`;
    if (nonStop) url += `&nonStop=${nonStop}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Flight availabilities error:", error);
    return NextResponse.json(
      { error: "Failed to fetch flight availabilities" },
      { status: 500 },
    );
  }
}
