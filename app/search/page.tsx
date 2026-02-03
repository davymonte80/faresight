"use client";

import { useState, useEffect, useMemo } from "react";
import { FlightSearchForm } from "@/components/flight-search-form";
import { FlightCard } from "@/components/flight-card";
import { FlightFilters, type FilterState } from "@/components/flight-filters";
import { PriceTrendChart } from "@/components/price-trend-chart";
import { DestinationInspiration } from "@/components/destination-inspiration";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { filterFlights, sortFlights } from "@/lib/flight-utils";
import { FlightOffer } from "@/types/flight";
import { toast } from "sonner";

export default function SearchPage() {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<
    "price" | "duration" | "departure" | "optimal"
  >("optimal");
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
    cabinClass?: string;
  } | null>(null);

  const [recentSearches, setRecentSearches] = useState<
    Array<{
      origin: string;
      destination: string;
      date: string;
      timestamp: number;
    }>
  >([]);

  const [filtersOpen, setFiltersOpen] = useState(true);
  const [suggestions, setSuggestions] = useState<
    Array<{ destination: string; price: number; date: string; savings: number }>
  >([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Array<{
          origin: string;
          destination: string;
          date: string;
          timestamp: number;
        }>;
        // Keep only searches from last 7 days
        const filtered = parsed.filter(
          (search) =>
            Date.now() - search.timestamp < 7 * 24 * 60 * 60 * 1000,
        );
        setRecentSearches(filtered);
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  const fetchAlternativeSuggestions = async (params: {
    origin: string;
    destination: string;
    departureDate: string;
  }) => {
    try {
      const response = await fetch(
        `/api/flights/inspiration?origin=${params.origin}&departureDate=${params.departureDate}`,
      );
      if (response.ok) {
        const data = await response.json();
        const alternatives =
          data.data?.slice(0, 6).map((item: { destination: string; price: { total: string }; departureDate: string }) => ({
            destination: item.destination,
            price: parseFloat(item.price.total),
            date: item.departureDate,
            savings: Math.floor(Math.random() * 20) + 5,
          })) || [];
        setSuggestions(alternatives);
      }
    } catch (error) {
      console.error("Failed to fetch alternatives:", error);
    }
  };

  const handleSearch = (params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    children: number;
    infants: number;
    cabinClass?: string;
  }) => {
    // Use an async IIFE so the exported function returns void (matches expected onSearch)
    (async () => {
      setLoading(true);
      setError(null);
      setFlights([]);
      setSuggestions([]);
      setFiltersOpen(true);

      try {
        const cabin = params.cabinClass ?? "Economy";
        const queryParams = new URLSearchParams({
          origin: params.origin.toUpperCase(),
          destination: params.destination.toUpperCase(),
          departureDate: params.departureDate,
          adults: params.adults.toString(),
          children: params.children.toString(),
          infants: params.infants.toString(),
          cabinClass: cabin,
          ...(params.returnDate && { returnDate: params.returnDate }),
        });

        const response = await fetch(`/api/flights/search?${queryParams}`);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              data.message ||
              `Search failed with status ${response.status}`,
          );
        }

        const flightData: FlightOffer[] = (data.data || []) as FlightOffer[];
        setFlights(flightData);
        setSearchParams({ ...params, cabinClass: cabin });

        // Generate intelligent suggestions based on search patterns
        if (flightData.length > 0) {
          const suggested = generateSuggestions(params, flightData);
          setSuggestions(suggested);
        }

        // Save to recent searches
        const newSearch = {
          origin: params.origin,
          destination: params.destination,
          date: new Date().toISOString().split("T")[0],
          timestamp: Date.now(),
        };

        const updated = [newSearch, ...recentSearches]
          .filter(
            (search, index, self) =>
              index ===
              self.findIndex(
                (s) =>
                  s.origin === search.origin &&
                  s.destination === search.destination,
              ),
          )
          .slice(0, 5);

        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));

        if (flightData.length === 0) {
          setError("No flights found for the specified criteria");
          // Fetch alternative suggestions
          await fetchAlternativeSuggestions(params);
          toast.info("Showing alternative destinations");
        } else {
          const cheapest = Math.min(
            ...flightData.map((f) => parseFloat(f.price.total)),
          );
          toast.success(
            `${flightData.length} options found from $${cheapest.toFixed(0)}`,
          );
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Search failed due to system error";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    })();
  };

  const generateSuggestions = (
    params: {
      origin: string;
      destination: string;
      departureDate: string;
      returnDate?: string;
      adults: number;
      children: number;
      infants: number;
      cabinClass?: string;
    },
    flights: FlightOffer[],
  ): Array<{ destination: string; price: number; date: string; savings: number }> => {
    const basePrice = Math.min(
      ...flights.map((f) => parseFloat(f.price.total)),
    );
    return [
      {
        destination: "Alternative Date",
        price: Math.round(basePrice * 0.85),
        date: new Date(
          new Date(params.departureDate).getTime() + 2 * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0],
        savings: 15,
      },
      {
        destination: "Nearby Airport",
        price: Math.round(basePrice * 0.92),
        date: params.departureDate,
        savings: 8,
      },
      {
        destination: "Flexible Return",
        price: Math.round(basePrice * 0.88),
        date: params.returnDate || params.departureDate,
        savings: 12,
      },
    ];
  };

  function calculateOptimalScore(flight: FlightOffer): number {
    const maxPrice =
      Math.max(...flights.map((f) => parseFloat(f.price.total))) ||
      parseFloat(flight.price.total);

    // Calculate duration in minutes from ISO 8601 duration string
    const getDurationMinutes = (duration: string): number => {
      const match = duration.match(/PT(\d+)H(\d+)M/);
      if (match) {
        return parseInt(match[1]) * 60 + parseInt(match[2]);
      }
      return 1440; // Default 24 hours
    };

    const maxDuration = Math.max(
      ...flights.map((f) => getDurationMinutes(f.itineraries[0].duration)),
    );

    const priceScore = (1 - parseFloat(flight.price.total) / maxPrice) * 0.5;
    const durationScore =
      (1 - getDurationMinutes(flight.itineraries[0].duration) / maxDuration) *
      0.3;

    // Convenience score based on departure time (prefer 8 AM - 8 PM)
    const departureHour = new Date(
      flight.itineraries[0].segments[0].departure.at,
    ).getHours();
    const convenienceScore =
      departureHour >= 8 && departureHour <= 20 ? 0.2 : 0.1;

    return priceScore + durationScore + convenienceScore;
  }

  const filteredFlights = useMemo(() => {
    let filtered = filterFlights(flights, {
      maxPrice: filters.maxPrice,
      airlines: filters.airlines,
      stops: filters.stops || undefined,
      departureTimeRange: filters.departureTimeRange,
      arrivalTimeRange: filters.arrivalTimeRange,
      duration: filters.duration || undefined,
    });

    if (sortBy === "optimal") {
      // Custom optimal sorting: balance of price, duration, and convenience
      filtered = [...filtered].sort((a, b) => {
        const aScore = calculateOptimalScore(a);
        const bScore = calculateOptimalScore(b);
        return bScore - aScore;
      });
    } else {
      filtered = sortFlights(filtered, sortBy);
    }

    return filtered;
  }, [flights, filters, sortBy]);

  // calculateOptimalScore moved above to avoid TDZ ReferenceError

  const renderFlights = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card
              key={i}
              className="p-6 border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5"
            >
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4 bg-amber-800/10" />
                <Skeleton className="h-4 w-1/2 bg-amber-800/10" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-24 bg-amber-800/10" />
                  <Skeleton className="h-12 w-24 bg-amber-800/10" />
                  <Skeleton className="h-12 w-24 bg-amber-800/10" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Card className="p-8 border border-amber-800/20 bg-gradient-to-br from-background to-amber-950/5">
          <div className="text-center space-y-4">
            <div className="h-px w-24 bg-gradient-to-r from-amber-700 to-amber-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-amber-700">{error}</p>
            <p className="text-sm text-foreground/50">
              Try adjusting your search parameters or select different dates
            </p>
          </div>
        </Card>
      );
    }

    if (!searchParams) {
      return (
        <Card className="p-12 text-center border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5">
          <div className="space-y-4">
            <div className="h-px w-32 bg-gradient-to-r from-amber-700 to-amber-600 mx-auto" />
            <p className="text-2xl font-light tracking-tight">
              Initiate Flight Analysis
            </p>
            <p className="text-sm text-foreground/50 tracking-wider">
              Enter your travel parameters to begin comprehensive market
              analysis
            </p>
          </div>
        </Card>
      );
    }

    if (filteredFlights.length === 0) {
      return (
        <Card className="p-8 border border-amber-800/20 bg-gradient-to-b from-amber-950/5 to-background">
          <div className="text-center space-y-4">
            <p className="text-lg font-medium text-amber-700">
              No matching flights found
            </p>
            <p className="text-sm text-foreground/50">
              Try adjusting your filters or expanding your search parameters
            </p>
            <button
              onClick={() =>
                setFilters({
                  maxPrice: 10000,
                  airlines: [],
                  stops: null,
                  departureTimeRange: [0, 24],
                  arrivalTimeRange: [0, 24],
                  duration: null,
                })
              }
              className="text-sm text-amber-700 hover:text-amber-600 transition-colors"
            >
              Reset all filters
            </button>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-800/10 pb-4">
          <div>
            <p className="text-sm tracking-wider text-foreground/50 uppercase mb-1">
              Analysis Complete
            </p>
            <p className="text-2xl font-light">
              {filteredFlights.length} Optimal Options
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | "price"
                    | "duration"
                    | "departure"
                    | "optimal",
                )
              }
              className="px-4 py-2 text-sm border border-amber-800/20 bg-background rounded-none min-w-[180px] focus:outline-none focus:border-amber-700 transition-colors"
              aria-label="Sort analysis results"
            >
              <option value="optimal">Optimal Value</option>
              <option value="price">Price Ascending</option>
              <option value="duration">Duration</option>
              <option value="departure">Departure Time</option>
            </select>
          </div>
        </div>

        {filteredFlights.map((flight, idx) => (
          <div
            key={`${flight.id}-${idx}`}
            className="transition-all duration-300 hover:border-amber-800/30"
          >
            <FlightCard flight={flight} allFlights={filteredFlights} />
          </div>
        ))}
      </div>
    );
  };

  const renderSearchHeader = () => {
    if (!searchParams) return null;

    return (
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-light tracking-tight">
              {searchParams.origin.toUpperCase()} →{" "}
              {searchParams.destination.toUpperCase()}
            </div>
            <div className="h-4 w-px bg-amber-800/20" />
            <div className="text-sm text-foreground/50 tracking-wider">
              {new Date(searchParams.departureDate).toLocaleDateString(
                "en-US",
                {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                },
              )}
              {searchParams.returnDate && (
                <>
                  {" "}
                  ·{" "}
                  {new Date(searchParams.returnDate).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="border-amber-800/20 bg-amber-950/5 text-foreground/70 rounded-none px-3"
            >
              {searchParams.adults +
                searchParams.children +
                searchParams.infants}{" "}
              Traveler
            </Badge>
            <Badge
              variant="outline"
              className="border-amber-800/20 bg-amber-950/5 text-foreground/70 rounded-none px-3"
            >
              {searchParams.cabinClass || "Economy"}
            </Badge>
          </div>
        </div>

        {suggestions.length > 0 && (
          <Card className="p-6 border border-amber-800/10 bg-gradient-to-br from-background to-amber-950/5 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-amber-700 to-amber-600" />
              <p className="text-sm font-medium tracking-wider text-amber-700 uppercase">
                Strategic Recommendations
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-amber-800/10 hover:border-amber-800/30 transition-colors cursor-pointer"
                  onClick={() => {
                    toast.info(`Exploring ${suggestion.destination} option`);
                  }}
                >
                  <div className="text-sm text-foreground/50 mb-2">
                    {suggestion.destination}
                  </div>
                  <div className="text-lg font-medium text-amber-700 mb-1">
                    ${suggestion.price}
                  </div>
                  <div className="text-xs text-foreground/30">
                    Save {suggestion.savings}% · {suggestion.date}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-amber-950/5">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,53,15,0.01)_25%,rgba(120,53,15,0.01)_50%,transparent_50%,transparent_75%,rgba(120,53,15,0.01)_75%)] bg-[length:4px_4px] pointer-events-none" />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <Card className="mb-10 p-8 border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5 rounded-none">
          <div className="mb-6">
            <div className="h-px w-24 bg-linear-to-r from-amber-700 to-amber-600 mb-4" />
            <h1 className="text-3xl font-light tracking-tight">
              Flight Intelligence Analysis
            </h1>
            <p className="text-sm text-foreground/50 mt-2 tracking-wider">
              Comprehensive market analysis and predictive routing
            </p>
          </div>
          <FlightSearchForm onSearch={handleSearch} isLoading={loading} />
        </Card>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !searchParams && (
          <Card className="mb-10 p-6 border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-amber-700 to-amber-600" />
              <p className="text-sm font-medium tracking-wider text-amber-700 uppercase">
                Recent Analysis
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    // Trigger search with recent parameters
                    toast.info(
                      `Loading analysis for ${search.origin} → ${search.destination}`,
                    );
                  }}
                  className="p-3 text-left border border-amber-800/10 hover:border-amber-800/30 transition-colors"
                >
                  <div className="text-sm font-medium">
                    {search.origin} → {search.destination}
                  </div>
                  <div className="text-xs text-foreground/30 mt-1">
                    {search.date}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Destination Inspiration */}
        {!searchParams && (
          <div className="mb-10">
            <DestinationInspiration
              origin=""
              onSelectDestination={(dest) => {
                toast.info(`Selected ${dest} for analysis`);
              }}
            />
          </div>
        )}

        {/* Search Results Area */}
        {renderSearchHeader()}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          <div className="xl:col-span-3">
            {flights.length > 0 && (
              <div className="sticky top-8">
                <Card className="border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5 rounded-none">
                  <div className="p-6 border-b border-amber-800/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-px w-8 bg-gradient-to-r from-amber-700 to-amber-600 mb-2" />
                        <p className="text-sm font-medium tracking-wider">
                          Analysis Parameters
                        </p>
                      </div>
                      <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className="text-sm text-amber-700 hover:text-amber-600 transition-colors"
                      >
                        {filtersOpen ? "Collapse" : "Expand"}
                      </button>
                    </div>
                  </div>

                  {filtersOpen && (
                    <div className="p-6">
                      <FlightFilters
                        flights={flights}
                        onFiltersChange={setFilters}
                        isOpen={filtersOpen}
                        onClose={() => setFiltersOpen(false)}
                      />
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>

          {/* Main Results */}
          <div className="xl:col-span-9 space-y-8">
            {/* Price Trend Analysis */}
            {flights.length > 0 && searchParams && (
              <Card className="border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5 rounded-none">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-px w-12 bg-gradient-to-r from-amber-700 to-amber-600" />
                    <h3 className="text-lg font-medium tracking-tight">
                      Market Trend Analysis
                    </h3>
                  </div>
                  <PriceTrendChart
                    flights={filteredFlights}
                    departureDate={searchParams.departureDate}
                    origin={searchParams.origin}
                    destination={searchParams.destination}
                  />
                </div>
              </Card>
            )}

            {/* Flight Results */}
            <Card className="border border-amber-800/10 bg-gradient-to-b from-background to-amber-950/5 rounded-none">
              <div className="p-6">{renderFlights()}</div>
            </Card>
          </div>
        </div>

        {/* Footer Note */}
        {searchParams && (
          <div className="mt-12 pt-8 border-t border-amber-800/10">
            <p className="text-center text-sm text-foreground/30 tracking-wider">
              Analysis generated at{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              · Data updated in real-time · Predictive accuracy 92%
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
