import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/amadeus";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const airlineCodes = searchParams.get("airlineCodes");

    if (!airlineCodes) {
      return NextResponse.json(
        { error: "Airline codes required" },
        { status: 400 },
      );
    }

    const token = await getAccessToken();
    const url = `https://test.api.amadeus.com/v1/reference-data/airlines?airlineCodes=${airlineCodes}`;

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
    console.error("Airline lookup error:", error);
    return NextResponse.json(
      { error: "Failed to lookup airline" },
      { status: 500 },
    );
  }
}
