import { searchFlights } from "@/lib/amadeus";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    const departureDate = searchParams.get("departureDate");
    const returnDate = searchParams.get("returnDate") || undefined;
    const adults = parseInt(searchParams.get("adults") || "1");
    const children = parseInt(searchParams.get("children") || "0");
    const infants = parseInt(searchParams.get("infants") || "0");
    const travelClass = searchParams.get("travelClass") || "ECONOMY";

    // Validate required parameters
    if (!origin || !destination || !departureDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // Validate return date is after departure date
    if (returnDate && new Date(returnDate) < new Date(departureDate)) {
      return NextResponse.json(
        { error: "Return date must be after departure date", data: [] },
        { status: 400 },
      );
    }

    console.log(`Searching flights: ${origin} -> ${destination}, Departure: ${departureDate}, Return: ${returnDate || 'One-way'}`);

    const result = await searchFlights(
      origin,
      destination,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      travelClass,
    );

    console.log(`Found ${result.data?.length || 0} flights`);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Flight search API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search flights", data: [] },
      { status: 500 },
    );
  }
}
