import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plane, TrendingDown, Filter, BarChart3, MapPin, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-primary bg-clip-text text-transparent">
            ✈️ FareSight
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
            Smart Flight Search with Real-Time Price Tracking & AI-Powered Recommendations
          </p>
          <Link href="/search">
            <Button size="lg" className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all">
              Start Searching Flights
              <Plane className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <TrendingDown className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Live Price Trends</h3>
            <p className="text-slate-600 dark:text-slate-400">Track flight prices over time with interactive charts</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Filter className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Advanced Filters</h3>
            <p className="text-slate-600 dark:text-slate-400">Filter by price, stops, airlines, and departure time</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <BarChart3 className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Price Analytics</h3>
            <p className="text-slate-600 dark:text-slate-400">View min, max, and average prices across dates</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <MapPin className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">50+ Airports</h3>
            <p className="text-slate-600 dark:text-slate-400">Search flights from major airports worldwide</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Clock className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Real-Time Data</h3>
            <p className="text-slate-600 dark:text-slate-400">Powered by Amadeus API with 22 endpoints</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Plane className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Smart Booking</h3>
            <p className="text-slate-600 dark:text-slate-400">Complete booking with seat selection</p>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Built with Next.js 16, React 19, and Amadeus API</p>
          <p className="text-sm text-slate-500">Created by <a href="https://github.com/davidmonte" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">David Monte</a></p>
        </div>
      </div>
    </div>
  );
}
