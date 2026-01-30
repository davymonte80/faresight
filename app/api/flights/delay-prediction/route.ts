import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/amadeus";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const originLocationCode = searchParams.get("originLocationCode");
    const destinationLocationCode = searchParams.get("destinationLocationCode");
    const departureDate = searchParams.get("departureDate");
    const departureTime = searchParams.get("departureTime");
    const arrivalDate = searchParams.get("arrivalDate");
    const arrivalTime = searchParams.get("arrivalTime");
    const aircraftCode = searchParams.get("aircraftCode");
    const carrierCode = searchParams.get("carrierCode");
    const flightNumber = searchParams.get("flightNumber");
    const duration = searchParams.get("duration");

    if (
      !originLocationCode ||
      !destinationLocationCode ||
      !departureDate ||
      !departureTime ||
      !arrivalDate ||
      !arrivalTime ||
      !aircraftCode ||
      !carrierCode ||
      !flightNumber ||
      !duration
    ) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    const token = await getAccessToken();
    const url = `https://test.api.amadeus.com/v1/travel/predictions/flight-delay?originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${departureDate}&departureTime=${departureTime}&arrivalDate=${arrivalDate}&arrivalTime=${arrivalTime}&aircraftCode=${aircraftCode}&carrierCode=${carrierCode}&flightNumber=${flightNumber}&duration=${duration}`;

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
    console.error("Flight delay prediction error:", error);
    return NextResponse.json(
      { error: "Failed to fetch flight delay prediction" },
      { status: 500 },
    );
  }
}
