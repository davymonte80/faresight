import {
  createFlightOrder,
  getFlightOrder,
  deleteFlightOrder,
} from "@/lib/amadeus";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { flightOffers, travelers, contacts } = body;

    if (!flightOffers || !travelers || !contacts) {
      return NextResponse.json(
        { error: "Flight offers, travelers, and contacts are required" },
        { status: 400 },
      );
    }

    const result = await createFlightOrder(flightOffers, travelers, contacts);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Create flight order API error:", error);
    return NextResponse.json(
      { error: "Failed to create flight order" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    const result = await getFlightOrder(orderId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get flight order API error:", error);
    return NextResponse.json(
      { error: "Failed to get flight order" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 },
      );
    }

    const result = await deleteFlightOrder(orderId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Delete flight order API error:", error);
    return NextResponse.json(
      { error: "Failed to delete flight order" },
      { status: 500 },
    );
  }
}
