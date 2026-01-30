"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plane, MapPin, Loader2 } from "lucide-react";

interface Airport {
  id: string;
  name: string;
  iataCode: string;
  address: {
    cityName: string;
    countryName: string;
  };
  subType: string;
}

interface AirportAutocompleteProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string, airport?: Airport) => void;
  className?: string;
  disabled?: boolean;
}

export function AirportAutocomplete({
  id,
  placeholder,
  value,
  onChange,
  className,
  disabled = false,
}: AirportAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/airports/search?keyword=${encodeURIComponent(searchQuery)}`,
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.data || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Failed to fetch airports:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedIndex(-1);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(newQuery);
    }, 300);
  };

  const handleSelectAirport = (airport: Airport) => {
    setQuery(airport.iataCode);
    onChange(airport.iataCode, airport);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectAirport(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary z-10" />
        <Input
          id={id}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          disabled={disabled}
          className={cn(
            "pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600",
            className,
          )}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {suggestions.map((airport, index) => (
            <button
              key={airport.id}
              type="button"
              onClick={() => handleSelectAirport(airport)}
              className={cn(
                "w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0",
                selectedIndex === index && "bg-slate-100 dark:bg-slate-700",
              )}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">
                      {airport.iataCode}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {airport.subType === "CITY" ? "City" : "Airport"}
                    </span>
                  </div>
                  <div className="text-sm text-foreground truncate">
                    {airport.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {airport.address.cityName}, {airport.address.countryName}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {showSuggestions &&
        !loading &&
        query.length >= 2 &&
        suggestions.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              No airports found. Try a city name or airport code.
            </p>
          </div>
        )}
    </div>
  );
}
