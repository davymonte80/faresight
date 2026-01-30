"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FlightSearchForm } from "@/components/flight-search-form";
import { FlightCard } from "@/components/flight-card";
import { FlightFilters, type FilterState } from "@/components/flight-filters";
import { PriceTrendChart } from "@/components/price-trend-chart";
import { DestinationInspiration } from "@/components/destination-inspiration";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { filterFlights, sortFlights } from "@/lib/flight-utils";
import { FlightOffer } from "@/types/flight";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SearchPage() {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">(
    "price",
  );
  const [filters, setFilters] = useState<FilterState>({
    maxPrice: 10000,
    airlines: [],
    stops: null,
    departureTimeRange: [0, 24],
    arrivalTimeRange: [0, 24],
    duration: null,
  });
  const [searchParams, setSearchParams] = useState<{
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    children: number;
    infants: number;
  } | null>(null);
  const [recentSearches, setRecentSearches] = useState<
    Array<{ origin: string; destination: string; date: string }>
  >([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<{ destination: string; price: number; date: string }>
  >([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  const fetchSuggestions = async (origin: string, departureDate: string) => {
    try {
      const response = await fetch(
        `/api/flights/inspiration?origin=${origin}&departureDate=${departureDate}`,
      );
      if (response.ok) {
        const data = await response.json();
        const suggestions =
          data.data
            ?.slice(0, 6)
            .map(
              (item: {
                destination: string;
                price: { total: string };
                departureDate: string;
              }) => ({
                destination: item.destination,
                price: parseFloat(item.price.total),
                date: item.departureDate,
              }),
            ) || [];
        setSuggestions(suggestions);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    }
  };

  const handleSearch = async (params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    children: number;
    infants: number;
  }) => {
    setLoading(true);
    setError(null);
    setFlights([]);
    setSuggestions([]);
    setFiltersOpen(false);

    try {
      const queryParams = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate,
        adults: params.adults.toString(),
        ...(params.returnDate && { returnDate: params.returnDate }),
        ...(params.children && { children: params.children.toString() }),
        ...(params.infants && { infants: params.infants.toString() }),
      });

      const response = await fetch(
        `/api/flights/search?${queryParams.toString()}`,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          (response.status === 404
            ? "No flights found for the selected route and dates."
            : response.status === 400
              ? "Invalid search parameters. Please check your dates and try again."
              : response.status === 500
                ? "Flight search service is temporarily unavailable. Please try again later."
                : `Search failed with status ${response.status}`);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setFlights(data.data || []);
      setSearchParams(params);

      const newSearch = {
        origin: params.origin,
        destination: params.destination,
        date: new Date().toLocaleDateString(),
      };
      const updated = [newSearch, ...recentSearches].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));

      if (!data.data || data.data.length === 0) {
        setError("No flights found. Try different dates or airports.");
        fetchSuggestions(params.origin, params.departureDate);
        toast.error("No Flights Found", {
          description: "Loading alternative destinations for you...",
        });
      } else {
        setSuggestions([]);
        toast.success("Flights Found!", {
          description: `Found ${data.data.length} flight${data.data.length > 1 ? "s" : ""} for your search.`,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to search flights";
      setError(errorMessage);
      console.error("Search error:", err);
      toast.error("Search Failed", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const filteredFlights = useMemo(() => {
    if (flights.length === 0) return [];
    const filtered = filterFlights(flights, {
      maxPrice: filters.maxPrice,
      airlines: filters.airlines,
      stops: filters.stops || undefined,
      departureTimeRange: filters.departureTimeRange,
      arrivalTimeRange: filters.arrivalTimeRange,
      duration: filters.duration || undefined,
    });
    return sortFlights(filtered, sortBy);
  }, [flights, filters, sortBy]);

  const renderFlightsList = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="space-y-4">
          <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 p-6">
            <p className="text-red-700 dark:text-red-300 font-medium text-lg">
              {error}
            </p>
            <p className="text-red-600 dark:text-red-400 text-sm mt-2">
              We couldn&apos;t find flights for your search. Here are some
              alternatives:
            </p>
          </Card>

          {suggestions.length > 0 && (
            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                ✈️ Available Destinations from {searchParams?.origin}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const destInput = document.getElementById(
                        "destination",
                      ) as HTMLInputElement;
                      if (destInput && searchParams) {
                        destInput.value = suggestion.destination;
                        handleSearch({
                          ...searchParams,
                          destination: suggestion.destination,
                          departureDate: suggestion.date,
                        });
                      }
                    }}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">
                        {suggestion.destination}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(suggestion.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      ${Math.round(suggestion.price)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Click to search
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      );
    }

    if (!searchParams) {
      return (
        <Card className="p-8 text-center">
          <div className="text-slate-500 dark:text-slate-400 space-y-2">
            <p className="text-lg font-medium">Start searching for flights</p>
            <p className="text-sm">
              Use the search form above to find the best deals
            </p>
          </div>
        </Card>
      );
    }

    if (filteredFlights.length === 0) {
      return (
        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 p-4">
          <p className="text-amber-700 dark:text-amber-300 font-medium">
            No flights match your filters
          </p>
          <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">
            Try adjusting your filter criteria
          </p>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {filteredFlights.length} flights found
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-foreground"
          >
            <option value="price">Sort by price</option>
            <option value="duration">Sort by duration</option>
            <option value="departure">Sort by departure</option>
          </select>
        </div>
        {filteredFlights.map((flight, idx) => (
          <FlightCard key={idx} flight={flight} allFlights={filteredFlights} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <main className="flex-1 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        <div className="mb-8">
          <FlightSearchForm onSearch={handleSearch} isLoading={loading} />

          {recentSearches.length > 0 && !searchParams && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                RECENT SEARCHES
              </p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const form = document.querySelector(
                        "form",
                      ) as HTMLFormElement;
                      if (form) {
                        const inputs = form.querySelectorAll("input");
                        inputs.forEach((input) => {
                          if (input.id === "origin")
                            input.value = search.origin;
                          if (input.id === "destination")
                            input.value = search.destination;
                        });
                      }
                    }}
                    className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-full transition-colors"
                  >
                    {search.origin} → {search.destination}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {!searchParams && (
          <div className="mb-8">
            <DestinationInspiration
              origin=""
              onSelectDestination={(destination) => {
                const destInput = document.getElementById(
                  "destination",
                ) as HTMLInputElement;
                if (destInput) {
                  destInput.value = destination;
                  destInput.dispatchEvent(
                    new Event("input", { bubbles: true }),
                  );
                }
              }}
            />
          </div>
        )}

        {searchParams && (
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">
                {searchParams.origin} → {searchParams.destination}
              </h2>
              {searchParams.adults > 0 && (
                <Badge variant="outline" className="text-xs">
                  {searchParams.adults} passenger
                  {searchParams.adults > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-3 2xl:col-span-2">
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h3 className="font-bold text-foreground">Filters</h3>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                aria-label="Toggle filters"
              >
                {filtersOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>

            {flights.length > 0 && (
              <FlightFilters
                flights={flights}
                onFiltersChange={setFilters}
                isOpen={filtersOpen}
                onClose={() => setFiltersOpen(false)}
              />
            )}
          </div>

          <div className="xl:col-span-9 2xl:col-span-10 space-y-6">
            {flights.length > 0 && searchParams && (
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground px-1">
                  📊 Price Trend Analysis
                </h3>
                <PriceTrendChart
                  flights={filteredFlights}
                  departureDate={searchParams.departureDate}
                  origin={searchParams.origin}
                  destination={searchParams.destination}
                />
              </div>
            )}

            {renderFlightsList()}
          </div>
        </div>
      </main>
    </div>
  );
}
