import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/amadeus";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");
    const radius = searchParams.get("radius") || "500";

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 },
      );
    }

    const token = await getAccessToken();
    const url = `https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=${latitude}&longitude=${longitude}&radius=${radius}&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=relevance`;

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
    console.error("Nearest airports error:", error);
    return NextResponse.json(
      { error: "Failed to fetch nearest airports" },
      { status: 500 },
    );
  }
}
