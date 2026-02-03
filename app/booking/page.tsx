"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlightOffer } from "@/types/flight";
import { ArrowLeft, Plane, Clock, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function BookingPage() {
  const router = useRouter();
  const [flight, setFlight] = useState<FlightOffer | null>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("selectedFlight");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [seatmap, setSeatmap] = useState<Record<string, unknown> | null>(null);
  const [loadingSeatmap, setLoadingSeatmap] = useState(false);
  const [passengerInfo, setPassengerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (flight) {
      fetchSeatmap();
    }
  }, [flight]);

  const fetchSeatmap = async () => {
    if (!flight) return;
    setLoadingSeatmap(true);
    try {
      const response = await fetch("/api/flights/seatmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flightOffer: flight }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Seatmap fetched successfully:", data);
        setSeatmap(data);
      } else {
        console.warn("Seatmap API returned error:", data);
        setSeatmap({ error: data.error || "Failed to fetch seatmap" });
      }
    } catch (error) {
      console.error("Failed to fetch seatmap:", error);
      setSeatmap({ error: "Failed to fetch seatmap - " + String(error) });
    } finally {
      setLoadingSeatmap(false);
    }
  };

  if (!flight) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-16 text-center">
          <Card className="p-8">
            <p className="text-lg text-muted-foreground mb-4">
              No flight selected
            </p>
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const segment = flight.itineraries[0].segments[0];
  const lastSegment =
    flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-amber-950/5">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,53,15,0.01)_25%,rgba(120,53,15,0.01)_50%,transparent_50%,transparent_75%,rgba(120,53,15,0.01)_75%)] bg-[length:4px_4px] pointer-events-none" />

      <main className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/search")}
          className="mb-6 hover:bg-amber-950/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5 rounded-none">
              <div className="mb-6">
                <div className="h-px w-16 bg-gradient-to-r from-amber-700 to-amber-600 mb-4" />
                <h2 className="text-2xl font-light tracking-tight text-foreground">
                  Flight Details
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="text-2xl font-bold">
                      {segment.departure.iataCode}
                    </p>
                    <p className="text-sm">
                      {new Date(segment.departure.at).toLocaleString()}
                    </p>
                  </div>
                  <Plane className="w-8 h-8 text-amber-700" />
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="text-2xl font-bold">
                      {lastSegment.arrival.iataCode}
                    </p>
                    <p className="text-sm">
                      {new Date(lastSegment.arrival.at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-semibold">
                        {flight.itineraries[0].duration
                          .replace("PT", "")
                          .toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Stops</p>
                      <p className="font-semibold">
                        {flight.itineraries[0].segments.length - 1} stop
                        {flight.itineraries[0].segments.length - 1 !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5 rounded-none">
              <div className="mb-4">
                <div className="h-px w-12 bg-gradient-to-r from-amber-700 to-amber-600 mb-4" />
                <h3 className="text-xl font-light tracking-tight text-foreground">
                  Passenger Information
                </h3>
              </div>
              <p className="text-sm text-foreground/50 mb-4 tracking-wide">
                Enter your details to complete the booking.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    value={passengerInfo.firstName}
                    onChange={(e) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-amber-800/20 rounded-none bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-amber-700 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={passengerInfo.lastName}
                    onChange={(e) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-amber-800/20 rounded-none bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-amber-700 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="john.doe@example.com"
                    value={passengerInfo.email}
                    onChange={(e) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-amber-800/20 rounded-none bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-amber-700 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={passengerInfo.phone}
                    onChange={(e) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-amber-800/20 rounded-none bg-background text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-amber-700 transition-colors"
                  />
                </div>
              </div>
            </Card>

            {loadingSeatmap && (
              <Card className="p-6 border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5 rounded-none">
                <h3 className="text-xl font-light tracking-tight mb-4 flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-amber-700" />
                  Seat Selection
                </h3>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700 mb-3"></div>
                    <p className="text-sm text-foreground/50">
                      Loading seatmap...
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {seatmap && !("error" in seatmap) && (
              <Card className="p-6 border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5 rounded-none">
                <h3 className="text-xl font-light tracking-tight mb-4 flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-amber-700" />
                  Seat Selection
                </h3>
                <p className="text-sm text-foreground/50 mb-4">
                  Seatmap data available. Full seat selection coming soon.
                </p>
                <div className="bg-gradient-to-br from-amber-950/5 to-background p-4 border border-amber-800/10">
                  <p className="text-xs font-medium text-amber-700">
                    ✓ Seatmap loaded successfully
                  </p>
                </div>
              </Card>
            )}

            {seatmap && "error" in seatmap && (
              <Card className="p-6 border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5 rounded-none">
                <h3 className="text-xl font-light tracking-tight mb-4 flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-amber-700" />
                  Seat Selection
                </h3>
                <div className="bg-amber-950/10 p-4 border border-amber-800/20">
                  <p className="text-sm font-medium text-amber-700">
                    ⚠ Seatmap unavailable for this flight
                  </p>
                  <p className="text-xs text-foreground/50 mt-1">
                    Seat selection will be available at check-in
                  </p>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5 rounded-none">
              <div className="mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-amber-700 to-amber-600 mb-4" />
                <h3 className="text-xl font-light tracking-tight text-foreground">
                  Price Summary
                </h3>
              </div>

              <div className="space-y-3 mb-6 bg-amber-950/5 p-4 border border-amber-800/10">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/50">
                    Base Fare
                  </span>
                  <span className="font-medium text-foreground">
                    ${flight.price.base}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/50">
                    Taxes & Fees
                  </span>
                  <span className="font-medium text-foreground">
                    $
                    {(
                      parseFloat(flight.price.total) -
                      parseFloat(flight.price.base)
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-amber-800/20 pt-3 flex justify-between text-lg">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-medium text-amber-700 text-2xl">
                    ${flight.price.total}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-white rounded-none"
                size="lg"
                onClick={() => {
                  toast.success("Booking Complete!", {
                    description: "Your flight has been successfully booked.",
                  });
                }}
              >
                Complete Booking
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
