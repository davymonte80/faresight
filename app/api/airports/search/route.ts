import { searchAirportsEnhanced } from "@/lib/amadeus";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword");

    if (!keyword) {
      return NextResponse.json(
        { error: "Keyword parameter is required" },
        { status: 400 },
      );
    }

    if (keyword.length < 2) {
      return NextResponse.json({ data: [] });
    }

    // Use enhanced search for better global coverage including African airports
    const results = await searchAirportsEnhanced(keyword);

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("Airport search API error:", error);
    return NextResponse.json(
      { error: "Failed to search airports" },
      { status: 500 },
    );
  }
}
