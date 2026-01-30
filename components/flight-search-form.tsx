"use client";

import React from "react";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AirportAutocomplete } from "@/components/airport-autocomplete";
import { Plane, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  onSearch: (params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    children: number;
    infants: number;
  }) => void;
  isLoading?: boolean;
}

export function FlightSearchForm({
  onSearch,
  isLoading = false,
}: SearchFormProps) {
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const handleSwap = useCallback(() => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  }, [origin, destination]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!origin || !destination || !departureDate) {
      alert("Please fill in required fields");
      return;
    }

    // Validate departure date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDepartureDate = new Date(departureDate);
    selectedDepartureDate.setHours(0, 0, 0, 0);

    if (selectedDepartureDate < today) {
      alert("❌ Invalid Date: Departure date cannot be in the past. Flight searches are only available for future dates.");
      return;
    }

    // Validate return date if provided
    if (tripType === "roundtrip" && returnDate) {
      const selectedReturnDate = new Date(returnDate);
      selectedReturnDate.setHours(0, 0, 0, 0);

      if (selectedReturnDate < selectedDepartureDate) {
        alert("❌ Invalid Date: Return date must be after departure date.");
        return;
      }

      if (selectedReturnDate < today) {
        alert("❌ Invalid Date: Return date cannot be in the past.");
        return;
      }
    }

    onSearch({
      origin,
      destination,
      departureDate,
      returnDate: tripType === "roundtrip" ? returnDate : undefined,
      adults,
      children,
      infants,
    });
  };

  return (
    <Card className="w-full bg-white dark:bg-slate-800 border-0 shadow-lg p-6">
      <div className="space-y-6">
        {/* Trip Type Selection */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="roundtrip"
              checked={tripType === "roundtrip"}
              onChange={(e) =>
                setTripType(e.target.value as "roundtrip" | "oneway")
              }
              className="accent-primary"
            />
            <span className="text-sm font-medium">Round Trip</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="oneway"
              checked={tripType === "oneway"}
              onChange={(e) =>
                setTripType(e.target.value as "roundtrip" | "oneway")
              }
              className="accent-primary"
            />
            <span className="text-sm font-medium">One Way</span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            {/* Origin */}
            <div className="space-y-2">
              <Label htmlFor="origin" className="text-xs font-semibold">
                From
              </Label>
              <AirportAutocomplete
                id="origin"
                placeholder="City or airport code"
                value={origin}
                onChange={(value) => setOrigin(value)}
                disabled={isLoading}
              />
            </div>

            {/* Swap Button */}
            <div className="flex justify-center md:justify-end">
              <button
                type="button"
                onClick={handleSwap}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Swap airports"
              >
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </button>
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <Label htmlFor="destination" className="text-xs font-semibold">
                To
              </Label>
              <AirportAutocomplete
                id="destination"
                placeholder="City or airport code"
                value={destination}
                onChange={(value) => setDestination(value)}
                disabled={isLoading}
              />
            </div>

            {/* Departure Date */}
            <div className="space-y-2">
              <Label htmlFor="departure-date" className="text-xs font-semibold">
                Depart
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  id="departure-date"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                />
              </div>
            </div>

            {/* Return Date */}
            {tripType === "roundtrip" && (
              <div className="space-y-2">
                <Label htmlFor="return-date" className="text-xs font-semibold">
                  Return
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    id="return-date"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Passengers */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-2">
              <Label
                htmlFor="adults"
                className="text-xs font-semibold flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Adults
              </Label>
              <Input
                id="adults"
                type="number"
                min="1"
                max="9"
                value={adults}
                onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="children" className="text-xs font-semibold">
                Children
              </Label>
              <Input
                id="children"
                type="number"
                min="0"
                max="8"
                value={children}
                onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="infants" className="text-xs font-semibold">
                Infants
              </Label>
              <Input
                id="infants"
                type="number"
                min="0"
                max="4"
                value={infants}
                onChange={(e) => setInfants(parseInt(e.target.value) || 0)}
                className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-auto bg-primary hover:bg-primary/90 text-white font-semibold h-10"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Searching...
                </>
              ) : (
                "Search Flights"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
