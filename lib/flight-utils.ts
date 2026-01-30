import { FlightOffer, Itinerary, Segment } from "@/types/flight";

export function getFlightDuration(itinerary: Itinerary): number {
  const duration = itinerary.duration;
  const matches = duration.match(/PT(\d+H)?(\d+M)?/);
  const hours = matches?.[1] ? parseInt(matches[1]) : 0;
  const minutes = matches?.[2] ? parseInt(matches[2]) : 0;
  return hours * 60 + minutes;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function getStopCount(segments: Segment[]): number {
  return segments.length - 1;
}

export function formatPrice(price: string, currency: string = "USD"): string {
  const num = parseFloat(price);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function parseTime(isoTime: string): { hours: number; minutes: number } {
  const time = new Date(isoTime);
  return {
    hours: time.getHours(),
    minutes: time.getMinutes(),
  };
}

export function formatTime(isoTime: string): string {
  const time = new Date(isoTime);
  return time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getDayOfWeek(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
  });
}

export function getFlightBadge(
  offer: FlightOffer,
  offers: FlightOffer[],
): "best-value" | "cheapest" | "fastest" | null {
  const prices = offers.map((o) => parseFloat(o.price.total));
  const minPrice = Math.min(...prices);

  const durations = offers.map((o) => getFlightDuration(o.itineraries[0]));
  const minDuration = Math.min(...durations);

  const currentPrice = parseFloat(offer.price.total);
  const currentDuration = getFlightDuration(offer.itineraries[0]);

  if (currentPrice === minPrice) {
    return "cheapest";
  }

  if (currentDuration === minDuration) {
    return "fastest";
  }

  // Best value: cheapest AND reasonable duration
  if (currentPrice === minPrice && currentDuration <= minDuration * 1.15) {
    return "best-value";
  }

  return null;
}

export function sortFlights(
  offers: FlightOffer[],
  sortBy: "price" | "duration" | "departure" = "price",
): FlightOffer[] {
  return [...offers].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return parseFloat(a.price.total) - parseFloat(b.price.total);
      case "duration":
        return (
          getFlightDuration(a.itineraries[0]) -
          getFlightDuration(b.itineraries[0])
        );
      case "departure":
        return (
          new Date(a.itineraries[0].segments[0].departure.at).getTime() -
          new Date(b.itineraries[0].segments[0].departure.at).getTime()
        );
      default:
        return 0;
    }
  });
}

export function filterFlights(
  offers: FlightOffer[],
  filters: {
    maxPrice?: number;
    airlines?: string[];
    stops?: number;
    departureTimeRange?: [number, number];
    arrivalTimeRange?: [number, number];
    duration?: number;
  },
): FlightOffer[] {
  return offers.filter((offer) => {
    const price = parseFloat(offer.price.total);
    const stops = getStopCount(offer.itineraries[0].segments);
    const duration = getFlightDuration(offer.itineraries[0]);
    const firstSegment = offer.itineraries[0].segments[0];
    const lastSegment =
      offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];
    const departureTime = parseTime(firstSegment.departure.at).hours;
    const arrivalTime = parseTime(lastSegment.arrival.at).hours;
    const airline = firstSegment.carrierCode;

    if (filters.maxPrice && price > filters.maxPrice) {
      return false;
    }

    if (filters.airlines && filters.airlines.length > 0) {
      if (!filters.airlines.includes(airline)) {
        return false;
      }
    }

    if (filters.stops !== undefined && stops > filters.stops) {
      return false;
    }

    if (filters.departureTimeRange) {
      const [minHour, maxHour] = filters.departureTimeRange;
      if (departureTime < minHour || departureTime > maxHour) {
        return false;
      }
    }

    if (filters.arrivalTimeRange) {
      const [minHour, maxHour] = filters.arrivalTimeRange;
      if (arrivalTime < minHour || arrivalTime > maxHour) {
        return false;
      }
    }

    if (filters.duration && duration > filters.duration) {
      return false;
    }

    return true;
  });
}

export function getUniqueAirlines(offers: FlightOffer[]): string[] {
  const airlines = new Set<string>();
  offers.forEach((offer) => {
    offer.itineraries[0].segments.forEach((segment) => {
      airlines.add(segment.carrierCode);
    });
  });
  return Array.from(airlines).sort();
}

export function getPriceRange(offers: FlightOffer[]): [number, number] {
  if (offers.length === 0) {
    return [0, 0];
  }

  const prices = offers.map((o) => parseFloat(o.price.total));
  return [Math.min(...prices), Math.max(...prices)];
}
