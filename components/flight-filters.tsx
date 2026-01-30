"use client";

import { FlightOffer } from "@/types/flight";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  getPriceRange,
  getUniqueAirlines,
  formatPrice,
} from "@/lib/flight-utils";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FlightFiltersProps {
  flights: FlightOffer[];
  onFiltersChange: (filters: FilterState) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export interface FilterState {
  maxPrice: number;
  airlines: string[];
  stops: number | null;
  departureTimeRange: [number, number];
  arrivalTimeRange: [number, number];
  duration: number | null;
}

export function FlightFilters({
  flights,
  onFiltersChange,
  isOpen = true,
  onClose,
}: FlightFiltersProps) {
  const [priceRange, minPrice, maxPrice] = (() => {
    const [min, max] = getPriceRange(flights);
    return [max, min, max];
  })();

  const airlines = getUniqueAirlines(flights);

  const [filters, setFilters] = useState<FilterState>({
    maxPrice,
    airlines: [],
    stops: null,
    departureTimeRange: [0, 24],
    arrivalTimeRange: [0, 24],
    duration: null,
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const handleClearFilters = () => {
    const cleared = {
      maxPrice,
      airlines: [],
      stops: null,
      departureTimeRange: [0, 24] as [number, number],
      arrivalTimeRange: [0, 24] as [number, number],
      duration: null,
    };
    setFilters(cleared);
    onFiltersChange(cleared);
  };

  const isFiltered =
    filters.maxPrice < maxPrice ||
    filters.airlines.length > 0 ||
    filters.stops !== null ||
    filters.departureTimeRange[0] !== 0 ||
    filters.departureTimeRange[1] !== 24 ||
    filters.arrivalTimeRange[0] !== 0 ||
    filters.arrivalTimeRange[1] !== 24 ||
    filters.duration !== null;

  const containerClasses = cn("space-y-6", !isOpen && "hidden md:block");

  return (
    <div className={containerClasses}>
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-foreground">Filters</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-4 space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="font-semibold text-foreground">
              Max Price: {formatPrice(filters.maxPrice.toString())}
            </Label>
            <Slider
              value={[filters.maxPrice]}
              onValueChange={(val) => updateFilters({ maxPrice: val[0] })}
              min={minPrice}
              max={maxPrice}
              step={50}
              className="w-full"
            />
            <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-between">
              <span>{formatPrice(minPrice.toString())}</span>
              <span>{formatPrice(maxPrice.toString())}</span>
            </div>
          </div>

          {/* Stops */}
          <div className="space-y-3">
            <Label className="font-semibold text-foreground">Stops</Label>
            <div className="space-y-2">
              {[
                { label: "Non-stop only", value: 0 },
                { label: "Up to 1 stop", value: 1 },
                { label: "Up to 2 stops", value: 2 },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded transition-colors"
                >
                  <input
                    type="radio"
                    name="stops"
                    checked={filters.stops === option.value}
                    onChange={() => updateFilters({ stops: option.value })}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground">
                    {option.label}
                  </span>
                </label>
              ))}
              <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded transition-colors">
                <input
                  type="radio"
                  name="stops"
                  checked={filters.stops === null}
                  onChange={() => updateFilters({ stops: null })}
                  className="accent-primary"
                />
                <span className="text-sm text-foreground">All flights</span>
              </label>
            </div>
          </div>

          {/* Airlines */}
          {airlines.length > 0 && (
            <div className="space-y-3">
              <Label className="font-semibold text-foreground">Airlines</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {airlines.map((airline) => (
                  <label
                    key={airline}
                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded transition-colors"
                  >
                    <Checkbox
                      checked={filters.airlines.includes(airline)}
                      onCheckedChange={(checked) => {
                        const updated = checked
                          ? [...filters.airlines, airline]
                          : filters.airlines.filter((a) => a !== airline);
                        updateFilters({ airlines: updated });
                      }}
                      className="border-primary accent-primary"
                    />
                    <span className="text-sm text-foreground">{airline}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Departure Time */}
          <div className="space-y-3">
            <Label className="font-semibold text-foreground">
              Departure Time: {filters.departureTimeRange[0]}:00 -{" "}
              {filters.departureTimeRange[1]}:00
            </Label>
            <Slider
              value={filters.departureTimeRange}
              onValueChange={(val) =>
                updateFilters({
                  departureTimeRange: [val[0], val[1]] as [number, number],
                })
              }
              min={0}
              max={24}
              step={1}
              className="w-full"
            />
          </div>

          {/* Arrival Time */}
          <div className="space-y-3">
            <Label className="font-semibold text-foreground">
              Arrival Time: {filters.arrivalTimeRange[0]}:00 -{" "}
              {filters.arrivalTimeRange[1]}:00
            </Label>
            <Slider
              value={filters.arrivalTimeRange}
              onValueChange={(val) =>
                updateFilters({
                  arrivalTimeRange: [val[0], val[1]] as [number, number],
                })
              }
              min={0}
              max={24}
              step={1}
              className="w-full"
            />
          </div>

          {/* Clear Filters */}
          {isFiltered && (
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 bg-transparent"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
