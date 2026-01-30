
"use client";

import { FlightOffer } from "@/types/flight";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getFlightDuration,
  formatDuration,
  getStopCount,
  formatPrice,
  formatTime,
  getFlightBadge,
} from "@/lib/flight-utils";
import { ChevronDown, Plane } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FlightCardProps {
  flight: FlightOffer;
  allFlights: FlightOffer[];
}

export function FlightCard({ flight, allFlights }: FlightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const itinerary = flight.itineraries[0];
  const segments = itinerary.segments;
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  const departureTime = formatTime(firstSegment.departure.at);
  const arrivalTime = formatTime(lastSegment.arrival.at);
  const duration = formatDuration(getFlightDuration(itinerary));
  const stops = getStopCount(segments);
  const price = formatPrice(flight.price.total, flight.price.currency);
  const badge = getFlightBadge(flight, allFlights);

  const airlines = [...new Set(segments.map((s) => s.carrierCode))].join(", ");

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700">
      <div className="p-4">
        {/* Top Row - Prices and Badges */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-2">
            {badge && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-semibold",
                  badge === "cheapest" && "bg-green-50 text-green-700 border-green-200",
                  badge === "fastest" && "bg-blue-50 text-blue-700 border-blue-200",
                  badge === "best-value" && "bg-purple-50 text-purple-700 border-purple-200"
                )}
              >
                {badge === "cheapest" && "Cheapest"}
                {badge === "fastest" && "Fastest"}
                {badge === "best-value" && "Best Value"}
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{price}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              per passenger
            </div>
          </div>
        </div>

        {/* Flight Details Row */}
        <div className="space-y-4">
          {/* Departure/Arrival Info */}
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
            {/* Departure */}
            <div>
              <div className="text-xl font-bold text-foreground">
                {departureTime}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                {firstSegment.departure.iataCode}
              </div>
            </div>

            {/* Duration and Stops */}
            <div className="text-center px-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="flex-1 h-px bg-slate-300 dark:bg-slate-600"></div>
                <Plane className="w-4 h-4 text-primary" />
                <div className="flex-1 h-px bg-slate-300 dark:bg-slate-600"></div>
              </div>
              <div className="text-sm font-semibold text-foreground">{duration}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {stops === 0
                  ? "Non-stop"
                  : `${stops} stop${stops > 1 ? "s" : ""}`}
              </div>
            </div>

            {/* Arrival */}
            <div className="text-right">
              <div className="text-xl font-bold text-foreground">
                {arrivalTime}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                {lastSegment.arrival.iataCode}
              </div>
            </div>
          </div>

          {/* Airlines and Cabin */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">{airlines}</span>
              <span className="text-slate-600 dark:text-slate-400">
                {segments[0].class || "Economy"}
              </span>
            </div>
          </div>

          {/* Expand Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-sm font-semibold text-primary hover:text-primary/80 transition-colors mt-2"
          >
            <span>{expanded ? "Hide details" : "View details"}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                expanded && "transform rotate-180"
              )}
            />
          </button>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
            {segments.map((segment, idx) => (
              <div key={idx} className="text-sm space-y-2">
                <div className="font-semibold text-foreground">
                  Leg {idx + 1}: {segment.departure.iataCode} → {segment.arrival.iataCode}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div>
                    <div className="font-medium">Departure</div>
                    <div>{formatTime(segment.departure.at)}</div>
                  </div>
                  <div>
                    <div className="font-medium">Arrival</div>
                    <div>{formatTime(segment.arrival.at)}</div>
                  </div>
                  <div>
                    <div className="font-medium">Airline</div>
                    <div>
                      {segment.carrierCode} {segment.number}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Aircraft</div>
                    <div>{segment.aircraft.code}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Fare Breakdown */}
            <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg space-y-2 text-sm">
              <div className="font-semibold text-foreground">Fare Breakdown</div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Base fare</span>
                <span>{formatPrice(flight.price.base, flight.price.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Fees & taxes</span>
                <span>
                  {formatPrice(
                    (
                      parseFloat(flight.price.total) - parseFloat(flight.price.base)
                    ).toString(),
                    flight.price.currency
                  )}
                </span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-600 pt-2 flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span>{formatPrice(flight.price.total, flight.price.currency)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Booking Button */}
        <button 
          onClick={() => {
            // Store flight data and navigate to booking
            sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
            window.location.href = '/booking';
          }}
          className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Select Flight
        </button>
      </div>
    </Card>
  );
}
