// Amadeus API client for flight searches

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

export interface AmadeusTokenResponse {
  type: string;
  username: string;
  application_name: string;
  client_id: string;
  token_type: string;
  access_token: string;
  expires_in: number;
  state: string;
  scope: string;
}

// Cache token to avoid repeated OAuth calls
let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  try {
    const response = await fetch(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: AMADEUS_API_KEY || "",
          client_secret: AMADEUS_API_SECRET || "",
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to get Amadeus token: ${response.statusText}`);
    }

    const data: AmadeusTokenResponse = await response.json();
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };

    return data.access_token;
  } catch (error) {
    console.error("Amadeus token error:", error);
    throw new Error("Failed to authenticate with Amadeus API");
  }
}

export async function searchFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  adults: number = 1,
  children: number = 0,
  infants: number = 0,
  travelClass: string = "ECONOMY",
) {
  try {
    const token = await getAccessToken();

    const params = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      adults: adults.toString(),
      ...(returnDate && { returnDate }),
      ...(children > 0 && { children: children.toString() }),
      ...(infants > 0 && { infants: infants.toString() }),
      travelClass,
      max: "250",
      currencyCode: "USD",
    });

    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { data: [] };
      }
      throw new Error(`Flight search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Flight search error:", error);
    throw error;
  }
}

export async function getAirportAutocomplete(keyword: string) {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(
        keyword,
      )}&page[limit]=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Airport search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Airport autocomplete error:", error);
    throw error;
  }
}

export async function getAirlineInfo(carrierCode: string) {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/airlines?airlineCodes=${carrierCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Airline info failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.[0] || null;
  } catch (error) {
    console.error("Airline info error:", error);
    return null;
  }
}

// Flight Inspiration Search - Find cheapest destinations from origin
export async function getFlightInspiration(
  origin: string,
  maxPrice?: number,
  departureDate?: string,
) {
  try {
    const token = await getAccessToken();

    const params = new URLSearchParams({
      origin,
      ...(maxPrice && { maxPrice: maxPrice.toString() }),
      ...(departureDate && { departureDate }),
    });

    const response = await fetch(
      `https://test.api.amadeus.com/v1/shopping/flight-destinations?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { data: [] };
      }
      throw new Error(`Flight inspiration failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Flight inspiration error:", error);
    throw error;
  }
}

// Flight Cheapest Date Search - Find cheapest dates for a route
export async function getFlightCheapestDates(
  origin: string,
  destination: string,
  oneWay: boolean = false,
  duration?: string,
) {
  try {
    const token = await getAccessToken();

    const params = new URLSearchParams({
      origin,
      destination,
      oneWay: oneWay.toString(),
      ...(duration && { duration }),
    });

    const response = await fetch(
      `https://test.api.amadeus.com/v1/shopping/flight-dates?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { data: [] };
      }
      throw new Error(`Cheapest dates search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Cheapest dates error:", error);
    throw error;
  }
}

// Airport Nearest Relevant - Find nearest airports to coordinates
export async function getNearestAirports(
  latitude: number,
  longitude: number,
  radius: number = 500,
) {
  try {
    const token = await getAccessToken();

    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
    });

    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/airports?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Nearest airports failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Nearest airports error:", error);
    throw error;
  }
}

// Airline Routes - Get all routes for an airline
export async function getAirlineRoutes(airlineCode: string) {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      `https://test.api.amadeus.com/v1/airline/destinations?airlineCode=${airlineCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { data: [] };
      }
      throw new Error(`Airline routes failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Airline routes error:", error);
    throw error;
  }
}

// Flight Price Analysis - Get price insights for a route
export async function getFlightPriceAnalysis(
  origin: string,
  destination: string,
  departureDate: string,
) {
  try {
    const token = await getAccessToken();

    const params = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      currencyCode: "USD",
    });

    const response = await fetch(
      `https://test.api.amadeus.com/v1/analytics/itinerary-price-metrics?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { data: [] };
      }
      throw new Error(`Price analysis failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Price analysis error:", error);
    throw error;
  }
}

// Enhanced Airport Search with better global coverage
export async function searchAirportsEnhanced(
  keyword: string,
  subType: string = "AIRPORT,CITY",
) {
  try {
    const token = await getAccessToken();

    const params = new URLSearchParams({
      subType,
      keyword: keyword,
      "page[limit]": "50", // Increased limit for better coverage
      "page[offset]": "0",
      sort: "analytics.travelers.score",
      view: "FULL",
    });

    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Enhanced airport search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Enhanced airport search error:", error);
    throw error;
  }
}

// Flight Offers Price - Confirm pricing for flight offers
export async function getFlightOffersPrice(flightOffers: unknown) {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      "https://test.api.amadeus.com/v1/shopping/flight-offers/pricing",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            type: "flight-offers-pricing",
            flightOffers: Array.isArray(flightOffers)
              ? flightOffers
              : [flightOffers],
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Flight offers price failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Flight offers price error:", error);
    throw error;
  }
}

// Flight Create Orders - Book a flight
export async function createFlightOrder(
  flightOffers: unknown,
  travelers: unknown[],
  contacts: unknown,
) {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      "https://test.api.amadeus.com/v1/booking/flight-orders",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            type: "flight-order",
            flightOffers: Array.isArray(flightOffers)
              ? flightOffers
              : [flightOffers],
            travelers,
            contacts,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Create flight order failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Create flight order error:", error);
    throw error;
  }
}

// Flight Order Management - Retrieve flight order details
export async function getFlightOrder(orderId: string) {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      `https://test.api.amadeus.com/v1/booking/flight-orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Get flight order failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get flight order error:", error);
    throw error;
  }
}

// Delete Flight Order
export async function deleteFlightOrder(orderId: string) {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      `https://test.api.amadeus.com/v1/booking/flight-orders/${orderId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Delete flight order failed: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Delete flight order error:", error);
    throw error;
  }
}

// Seatmap Display - Get seat maps for flights
export async function getSeatMaps(flightOffers: unknown) {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      "https://test.api.amadeus.com/v1/shopping/seatmaps",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: Array.isArray(flightOffers) ? flightOffers : [flightOffers],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Get seatmaps failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get seatmaps error:", error);
    throw error;
  }
}

// Branded Fares Upsell - Get branded fare options
export async function getBrandedFares(flightOffers: unknown) {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      "https://test.api.amadeus.com/v1/shopping/flight-offers/upselling",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            type: "flight-offers-upselling",
            flightOffers: Array.isArray(flightOffers)
              ? flightOffers
              : [flightOffers],
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Get branded fares failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get branded fares error:", error);
    throw error;
  }
}

export async function getFlightChoicePrediction(flightOffers: unknown) {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      "https://test.api.amadeus.com/v2/shopping/flight-offers/prediction",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            type: "flight-offers-prediction",
            flightOffers: Array.isArray(flightOffers)
              ? flightOffers
              : [flightOffers],
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Flight choice prediction failed: ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Flight choice prediction error:", error);
    throw error;
  }
}

export async function getFlightAvailabilities(
  originDestinations: unknown[],
  travelers: unknown[],
  sources: string[] = ["GDS"],
) {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      "https://test.api.amadeus.com/v1/shopping/availability/flight-availabilities",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originDestinations,
          travelers,
          sources,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Flight availabilities failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Flight availabilities error:", error);
    throw error;
  }
}

export async function getTravelRecommendations(
  cityCodes: string[],
  travelerCountryCode: string,
) {
  try {
    const token = await getAccessToken();

    const params = new URLSearchParams({
      cityCodes: cityCodes.join(","),
      travelerCountryCode,
    });

    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/recommended-locations?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { data: [] };
      }
      throw new Error(`Travel recommendations failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Travel recommendations error:", error);
    throw error;
  }
}

// On Demand Flight Status - Get real-time flight status
export async function getFlightStatus(
  carrierCode: string,
  flightNumber: string,
  scheduledDepartureDate: string,
) {
  try {
    const token = await getAccessToken();

    const params = new URLSearchParams({
      carrierCode,
      flightNumber,
      scheduledDepartureDate,
    });

    const response = await fetch(
      `https://test.api.amadeus.com/v2/schedule/flights?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { data: [] };
      }
      throw new Error(`Flight status failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Flight status error:", error);
    throw error;
  }
}

export async function getFlightDelayPrediction(
  originLocationCode: string,
  destinationLocationCode: string,
  departureDate: string,
  departureTime: string,
  arrivalDate: string,
  arrivalTime: string,
  aircraftCode: string,
  carrierCode: string,
  flightNumber: string,
  duration: string,
) {
  try {
    const token = await getAccessToken();

    const params = new URLSearchParams({
      originLocationCode,
      destinationLocationCode,
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      aircraftCode,
      carrierCode,
      flightNumber,
      duration,
    });

    const response = await fetch(
      `https://test.api.amadeus.com/v1/travel/predictions/flight-delay?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { data: [] };
      }
      throw new Error(`Flight delay prediction failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Flight delay prediction error:", error);
    throw error;
  }
}

export async function getAirportRoutes(airportCode: string) {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      `https://test.api.amadeus.com/v1/airport/direct-destinations?departureAirportCode=${airportCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { data: [] };
      }
      throw new Error(`Airport routes failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Airport routes error:", error);
    throw error;
  }
}

// Airport On-Time Performance - Get airport delay statistics
export async function getAirportOnTimePerformance(
  airportCode: string,
  date: string,
) {
  try {
    const token = await getAccessToken();

    const params = new URLSearchParams({
      airportCode,
      date,
    });

    const response = await fetch(
      `https://test.api.amadeus.com/v1/airport/predictions/on-time?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { data: [] };
      }
      throw new Error(
        `Airport on-time performance failed: ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Airport on-time performance error:", error);
    throw error;
  }
}

// Flight Check-in Links - Get airline check-in URLs
export async function getFlightCheckinLinks(
  airlineCode: string,
  language: string = "EN",
) {
  try {
    const token = await getAccessToken();

    const params = new URLSearchParams({
      airlineCode,
      language,
    });

    const response = await fetch(
      `https://test.api.amadeus.com/v2/reference-data/urls/checkin-links?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { data: [] };
      }
      throw new Error(`Flight checkin links failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Flight checkin links error:", error);
    throw error;
  }
}

export async function getAirlineCodeLookup(airlineCodes: string[]) {
  try {
    const token = await getAccessToken();

    const params = new URLSearchParams({
      airlineCodes: airlineCodes.join(","),
    });

    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/airlines?${params}`,
      {
        headers: {
          
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { data: [] };
      }
      throw new Error(`Airline code lookup failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Airline code lookup error:", error);
    throw error;
  }
}
