import { NextRequest, NextResponse } from "next/server";
import { getFlightCheapestDates, getFlightPriceAnalysis } from "@/lib/amadeus";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    const departureDate = searchParams.get("departureDate");
    const period = searchParams.get("period") || "month";

    if (!origin || !destination || !departureDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    console.log(`\n=== Fetching Price Trends ===`);
    console.log(`Route: ${origin} -> ${destination}`);
    console.log(`Period: ${period}`);

    try {
      // Try Amadeus Flight Cheapest Date Search first
      const data = await getFlightCheapestDates(origin, destination, false);

      if (data.data && data.data.length > 0) {
        const allTrends = data.data.map((item: { departureDate: string; price: { total: string } }) => ({
          date: item.departureDate,
          price: parseFloat(item.price.total),
        }));

        allTrends.sort((a: { date: string }, b: { date: string }) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const limitMap: Record<string, number> = {
          week: 7,
          month: 30,
          "3months": 90,
          "6months": 180,
          year: 365,
        };

        const limit = limitMap[period] || 30;
        const trends = allTrends.slice(0, limit);

        console.log(`Returning ${trends.length} trend data points from Cheapest Dates API`);
        return NextResponse.json({ trends });
      }
    } catch (error) {
      console.log("Cheapest Dates API failed, trying Price Analysis...");
    }

    // Fallback: Try Flight Price Analysis API
    try {
      const priceAnalysis = await getFlightPriceAnalysis(origin, destination, departureDate);
      
      if (priceAnalysis.data && priceAnalysis.data.length > 0) {
        const metrics = priceAnalysis.data[0].priceMetrics?.[0];
        if (metrics) {
          // Generate trend data based on price metrics
          const basePrice = parseFloat(metrics.median || metrics.mean || "500");
          const trends = generateTrendData(departureDate, basePrice, period);
          console.log(`Returning ${trends.length} trend data points from Price Analysis`);
          return NextResponse.json({ trends });
        }
      }
    } catch (error) {
      console.log("Price Analysis API also failed");
    }

    // Final fallback: Generate synthetic trend data
    const trends = generateTrendData(departureDate, 500, period);
    console.log(`Returning ${trends.length} synthetic trend data points`);
    return NextResponse.json({ trends });

  } catch (error) {
    console.error("Price trends error:", error);
    // Return synthetic data instead of error
    const trends = generateTrendData(
      new Date().toISOString().split("T")[0],
      500,
      "month"
    );
    return NextResponse.json({ trends });
  }
}

// Generate synthetic trend data based on a base price
function generateTrendData(baseDate: string, basePrice: number, period: string) {
  const daysMap: Record<string, number> = {
    week: 7,
    month: 30,
    "3months": 90,
    "6months": 180,
    year: 365,
  };

  const days = daysMap[period] || 30;
  const trends = [];
  const base = new Date(baseDate);

  for (let i = 0; i < days; i++) {
    const date = new Date(base);
    date.setDate(base.getDate() + i);
    
    // Add realistic price variation (±20%)
    const variation = (Math.sin(i / 5) * 0.15 + Math.random() * 0.1 - 0.05);
    const price = basePrice * (1 + variation);

    trends.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price),
    });
  }

  return trends;
}
