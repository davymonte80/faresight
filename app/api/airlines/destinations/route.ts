import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/amadeus";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const airlineCode = searchParams.get("airlineCode");

    if (!airlineCode) {
      return NextResponse.json(
        { error: "Airline code is required" },
        { status: 400 },
      );
    }

    const token = await getAccessToken();
    const url = `https://test.api.amadeus.com/v1/airline/destinations?airlineCode=${airlineCode}&max=50`;

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
    console.error("Airline routes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch airline routes" },
      { status: 500 },
    );
  }
}
