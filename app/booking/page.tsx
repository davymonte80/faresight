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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <main className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                Flight Details
              </h2>

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
                  <Plane className="w-8 h-8 text-primary" />
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

            <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold mb-2 text-foreground">
                Passenger Information
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Enter your details to complete the booking.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
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
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </Card>

            {loadingSeatmap && (
              <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  Seat Selection
                </h3>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Loading seatmap...
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {seatmap && !("error" in seatmap) && (
              <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  Seat Selection
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Seatmap data available. Full seat selection coming soon.
                </p>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    ✓ Seatmap loaded successfully
                  </p>
                </div>
              </Card>
            )}

            {seatmap && "error" in seatmap && (
              <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  Seat Selection
                </h3>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    ⚠ Seatmap unavailable for this flight
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                    Seat selection will be available at check-in
                  </p>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Price Summary
              </h3>

              <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Base Fare
                  </span>
                  <span className="font-semibold text-foreground">
                    ${flight.price.base}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Taxes & Fees
                  </span>
                  <span className="font-semibold text-foreground">
                    $
                    {(
                      parseFloat(flight.price.total) -
                      parseFloat(flight.price.base)
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-slate-300 dark:border-slate-600 pt-3 flex justify-between text-lg">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-primary text-2xl">
                    ${flight.price.total}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg"
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
