# FareSight - Smart Flight Search & Booking Platform

A comprehensive flight search, booking, and analytics platform featuring real-time price tracking, advanced filtering, and complete Amadeus API integration.

## Features

###  Smart Flight Search
- **Global Airport Coverage**: Search 50+ airports
- **Origin & Destination Search**: Easy IATA code input with autocomplete
- **Flexible Travel Options**: Round-trip and one-way flights
- **Passenger Selection**: Support for adults, children, and infants
- **Travel Class Options**: Economy, Premium Economy, Business, First Class
- **Recent Searches**: Quick access to your previous searches (stored locally)

###  Advanced Price Trends & Analytics
- **Interactive Charts**: Line and bar chart visualizations with 250 data points
- **Time Period Selection**: 7 Days, 1 Month, 3 Months, 6 Months, 1 Year
- **Dual Data Sources**: Amadeus API + Search Results fallback
- **Price Analytics**: View min, max, and average prices across dates
- **Flight Count**: See availability at different price points
- **Date-Based Trends**: Identify the best days to travel
- **Responsive Charts**: Optimized for mobile, tablet, and desktop

### Complete Booking Flow
- **Flight Offers Price**: Confirm real-time pricing before booking
- **Create Orders**: Complete booking with traveler details
- **Order Management**: View and cancel bookings
- **Seatmap Display**: Select seats with pricing
- **Branded Fares**: Upsell to premium fare options

### Advanced Filtering
- **Price Range Slider**: Filter flights by maximum price
- **Stops Filter**: Non-stop, 1 stop, 2+ stops options
- **Airlines Filter**: Select specific airlines from results
- **Departure Time Range**: Choose preferred departure hours (0-24)
- **Arrival Time Range**: Choose preferred arrival hours (0-24)
- **Duration Limits**: Filter by total flight duration
- **Clear All**: Reset filters with one click

### Smart Sorting & Recommendations
- **Multiple Sort Options**: Price, Duration, or Departure time
- **Smart Badges**: "Cheapest", "Fastest", or "Best Value" indicators
- **Detailed Flight Information**: View all segments, stops, and timings
- **Flight Choice Prediction**: AI-powered recommendations
- **Travel Recommendations**: Personalized destination suggestions

### Analytics & Insights
- **Flight Price Analysis**: Price metrics, quartiles, and trends
- **Flight Delay Prediction**: AI-powered delay probability
- **On Demand Flight Status**: Real-time flight tracking
- **Airport On-Time Performance**: Delay statistics by airport
- **Airport Routes**: All direct destinations from an airport

### Fully Responsive Design
- **Mobile First**: Optimized for phones and tablets
- **Desktop View**: Advanced layout with side-by-side filters and charts
- **Adaptive UI**: Filters and charts adapt to screen size
- **Dark Mode**: Full dark mode support

## Tech Stack

- **Frontend**: React 19 with Next.js 16.1.6 (App Router)
- **Styling**: Tailwind CSS 3.4.17
- **Charts**: Recharts 3.7.0
- **API**: Amadeus Self-Service API (22 endpoints integrated)
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Type Safety**: TypeScript 5.7.3
- **Build**: Turbopack

## Amadeus API Integration (22 APIs)

### Flight Shopping & Search
✅ Flight Offers Search  
✅ Flight Offers Price  
✅ Flight Inspiration Search  
✅ Flight Cheapest Date Search  
✅ Flight Availabilities Search  
✅ Flight Choice Prediction  

### Booking & Management
✅ Flight Create Orders  
✅ Flight Order Management (GET/DELETE)  

### Upselling
✅ Seatmap Display  
✅ Branded Fares Upsell  

### Analytics & Predictions
✅ Flight Price Analysis  
✅ Flight Delay Prediction  
✅ On Demand Flight Status  

### Airport Services
✅ Airport & City Search  
✅ Airport Nearest Relevant  
✅ Airport Routes API  
✅ Airport On-Time Performance  

### Airline Information
✅ Airline Code Lookup  
✅ Airline Routes  
✅ Flight Check-in Links  

### Travel Recommendations
✅ Travel Recommendations  

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
echo "AMADEUS_API_KEY=your_key" > .env.local
echo "AMADEUS_API_SECRET=your_secret" >> .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
faresight/
├── app/
│   ├── api/flights/search/    # Flight search API endpoint
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── flight-card.tsx
│   ├── flight-filters.tsx
│   ├── flight-search-form.tsx
│   ├── price-trend-chart.tsx
│   └── ui/
├── lib/
│   ├── amadeus.ts
│   ├── flight-utils.ts
│   └── utils.ts
└── types/
    └── flight.ts
```

## Implementation Checklist

- [x] Search & Results with Origin, Destination, Dates inputs
- [x] Flight results list with detailed information
- [x] Live price trend chart with line/bar options
- [x] Complex filtering (stops, price, airlines, times)
- [x] Real-time chart updates with filters
- [x] Fully responsive mobile & desktop design
- [x] Smart flight badges (cheapest, fastest, best value)
- [x] Expandable flight details
- [x] Recent searches with localStorage
- [x] Error handling and loading states
- [x] Dark mode support
- [x] TypeScript for type safety

## Design Features

- Clean, modern UI with gradient backgrounds
- Smooth animations and transitions
- Accessible color contrasts
- Responsive grid layouts
- Dark mode with Tailwind CSS
- Professional typography with system fonts
