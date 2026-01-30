import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/amadeus";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { flightOffers } = body;

    if (!flightOffers || !Array.isArray(flightOffers)) {
      return NextResponse.json(
        { error: "Flight offers array is required" },
        { status: 400 },
      );
    }

    const token = await getAccessToken();
    const url =
      "https://test.api.amadeus.com/v2/shopping/flight-offers/prediction";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: flightOffers }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Flight choice prediction error:", error);
    return NextResponse.json(
      { error: "Failed to predict flight choice" },
      { status: 500 },
    );
  }
}
