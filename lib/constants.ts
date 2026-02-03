// Airport codes and airline information
export const POPULAR_AIRPORTS = {
  US: [
    { code: "JFK", city: "New York", country: "USA" },
    { code: "LAX", city: "Los Angeles", country: "USA" },
    { code: "ORD", city: "Chicago", country: "USA" },
    { code: "DFW", city: "Dallas", country: "USA" },
    { code: "ATL", city: "Atlanta", country: "USA" },
    { code: "MIA", city: "Miami", country: "USA" },
    { code: "SFO", city: "San Francisco", country: "USA" },
    { code: "BOS", city: "Boston", country: "USA" },
    { code: "LAS", city: "Las Vegas", country: "USA" },
    { code: "SEA", city: "Seattle", country: "USA" },
  ],
  INTERNATIONAL: [
    { code: "LHR", city: "London", country: "UK" },
    { code: "CDG", city: "Paris", country: "France" },
    { code: "AMS", city: "Amsterdam", country: "Netherlands" },
    { code: "FCO", city: "Rome", country: "Italy" },
    { code: "MUC", city: "Munich", country: "Germany" },
    { code: "DUB", city: "Dublin", country: "Ireland" },
    { code: "NRT", city: "Tokyo", country: "Japan" },
    { code: "HND", city: "Tokyo", country: "Japan" },
    { code: "SIN", city: "Singapore", country: "Singapore" },
    { code: "HKG", city: "Hong Kong", country: "Hong Kong" },
  ],
} as const;

// Airline information
export const AIRLINES = {
  AA: { name: "American Airlines", logo: "🇺🇸" },
  DL: { name: "Delta Air Lines", logo: "🇺🇸" },
  UA: { name: "United Airlines", logo: "🇺🇸" },
  BA: { name: "British Airways", logo: "🇬🇧" },
  LH: { name: "Lufthansa", logo: "🇩🇪" },
  AF: { name: "Air France", logo: "🇫🇷" },
  KL: { name: "KLM Royal Dutch Airlines", logo: "🇳🇱" },
  SQ: { name: "Singapore Airlines", logo: "🇸🇬" },
  NH: { name: "All Nippon Airways", logo: "🇯🇵" },
  CX: { name: "Cathay Pacific", logo: "🇭🇰" },
  SW: { name: "Southwest Airlines", logo: "🇺🇸" },
  AS: { name: "Alaska Air", logo: "🇺🇸" },
  JB: { name: "JetBlue Airways", logo: "🇺🇸" },
  NK: { name: "Spirit Airlines", logo: "🇺🇸" },
  F9: { name: "Frontier Airlines", logo: "🇺🇸" },
  
} as const;

// Travel class options
export const TRAVEL_CLASSES = [
  { value: "ECONOMY", label: "Economy" },
  { value: "PREMIUM_ECONOMY", label: "Premium Economy" },
  { value: "BUSINESS", label: "Business" },
  { value: "FIRST", label: "First Class" },
] as const;

// Price ranges for filtering
export const PRICE_RANGES = {
  BUDGET: { min: 0, max: 300 },
  MODERATE: { min: 300, max: 600 },
  PREMIUM: { min: 600, max: 1200 },
  LUXURY: { min: 1200, max: Infinity },
} as const;

// Duration ranges
export const DURATION_RANGES = {
  SHORT: { min: 0, max: 360 }, // 6 hours
  MODERATE: { min: 360, max: 720 }, // 12 hours
  LONG: { min: 720, max: Infinity },
} as const;

// API Configuration
export const API_CONFIG = {
  AMADEUS_BASE_URL: "https://test.api.amadeus.com",
  AMADEUS_VERSION: "v2",
  DEFAULT_CURRENCY: "USD",
  MAX_RESULTS_PER_SEARCH: 250,
  TOKEN_CACHE_DURATION: 1800000, // 30 minutes in milliseconds
  REQUEST_TIMEOUT: 30000, // 30 seconds
} as const;

// Default search parameters
export const DEFAULT_SEARCH = {
  ADULTS: 1,
  CHILDREN: 0,
  INFANTS: 0,
  TRAVEL_CLASS: "ECONOMY",
  MAX_PRICE: 10000,
} as const;

// UI/UX Configuration
export const UI_CONFIG = {
  RESULTS_PER_PAGE: 20,
  RECENT_SEARCHES_LIMIT: 5,
  CHART_MONTHS_TO_SHOW: 30,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  MISSING_CREDENTIALS: "API credentials not configured. Please check .env.local",
  INVALID_AIRPORTS: "Please enter valid 3-letter airport codes",
  INVALID_DATE: "Please select a valid date",
  SEARCH_FAILED: "Failed to search flights. Please try again.",
  NO_FLIGHTS_FOUND: "No flights found for your search. Try different criteria.",
  API_ERROR: "An error occurred while contacting the flight API.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  RATE_LIMIT: "Too many requests. Please wait a moment and try again.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SEARCH_COMPLETE: "Search complete! Showing available flights.",
  FILTERS_APPLIED: "Filters applied",
  SEARCH_SAVED: "Search saved to recent searches",
} as const;

// Format presets
export const FORMAT_CONFIG = {
  DATE_FORMAT: "MMM DD, YYYY",
  TIME_FORMAT: "HH:mm",
  CURRENCY: "USD",
  TIMEZONE: "UTC",
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Validation rules
export const VALIDATION = {
  MIN_ADULTS: 1,
  MAX_ADULTS: 9,
  MAX_CHILDREN: 8,
  MAX_INFANTS: 4,
  MIN_FUTURE_DAYS: 0, // Allow same-day searches
  MAX_ADVANCE_DAYS: 365,
  IATA_CODE_LENGTH: 3,
} as const;

// Color configuration (matches globals.css theme)
export const COLORS = {
  PRIMARY: {
    light: "oklch(0.43 0.15 258)", // Deep Sky Blue
    dark: "oklch(0.62 0.18 258)",
  },
  SECONDARY: {
    light: "oklch(0.94 0.008 258)",
    dark: "oklch(0.28 0.02 258)",
  },
  ACCENT: {
    light: "oklch(0.52 0.18 186)", // Vibrant Teal
    dark: "oklch(0.62 0.18 186)",
  },
  SUCCESS: "oklch(0.52 0.15 142)", // Green
  WARNING: "oklch(0.72 0.12 32)",  // Orange
  DANGER: "oklch(0.62 0.22 29)",   // Red
  CHART: {
    1: "oklch(0.43 0.15 258)", // Primary blue
    2: "oklch(0.52 0.18 186)", // Teal
    3: "oklch(0.62 0.15 142)", // Green
    4: "oklch(0.72 0.12 32)",  // Orange
    5: "oklch(0.45 0.16 20)",  // Red
  },
} as const;

// Badge configuration
export const BADGE_CONFIG = {
  CHEAPEST: { label: "Cheapest", color: "green" },
  FASTEST: { label: "Fastest", color: "blue" },
  BEST_VALUE: { label: "Best Value", color: "purple" },
} as const;

// Time slot labels
export const TIME_SLOTS = {
  EARLY_MORNING: { start: 0, end: 6, label: "Early Morning (12am-6am)" },
  MORNING: { start: 6, end: 12, label: "Morning (6am-12pm)" },
  AFTERNOON: { start: 12, end: 18, label: "Afternoon (12pm-6pm)" },
  EVENING: { start: 18, end: 24, label: "Evening (6pm-12am)" },
} as const;

export default {
  POPULAR_AIRPORTS,
  AIRLINES,
  TRAVEL_CLASSES,
  PRICE_RANGES,
  DURATION_RANGES,
  API_CONFIG,
  DEFAULT_SEARCH,
  UI_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FORMAT_CONFIG,
  PAGINATION,
  VALIDATION,
  COLORS,
  BADGE_CONFIG,
  TIME_SLOTS,
} as const;
