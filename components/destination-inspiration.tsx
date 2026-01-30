"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, TrendingUp, Calendar } from "lucide-react";
import { formatPrice } from "@/lib/flight-utils";

interface Destination {
  type: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: {
    total: string;
  };
}

interface DestinationInspirationProps {
  origin: string;
  onSelectDestination?: (destination: string) => void;
}

export function DestinationInspiration({
  origin,
  onSelectDestination,
}: DestinationInspirationProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (origin && origin.length === 3) {
      fetchDestinations();
    }
  }, [origin]);

  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/flights/inspiration?origin=${origin}`);
      if (response.ok) {
        const data = await response.json();
        setDestinations(data.data?.slice(0, 6) || []);
      } else {
        setError("Unable to load destinations");
      }
    } catch (err) {
      setError("Failed to fetch destinations");
    } finally {
      setLoading(false);
    }
  };

  if (!origin) return null;

  if (loading) {
    return (
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4">
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Popular Destinations from {origin}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (error || destinations.length === 0) return null;

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-4">
      <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Popular Destinations from {origin}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {destinations.map((dest, idx) => (
          <button
            key={idx}
            onClick={() => onSelectDestination?.(dest.destination)}
            className="p-3 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors text-left border border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-foreground text-lg">
                  {dest.destination}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(dest.departureDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="text-sm font-semibold text-primary mt-1">
                  {formatPrice(dest.price.total)}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
