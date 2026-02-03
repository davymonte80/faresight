"use client";

import { FlightOffer } from "@/types/flight";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp, Calendar, DollarSign, BarChart3 } from "lucide-react";

interface PriceTrendChartProps {
  flights: FlightOffer[];
  departureDate: string;
  origin?: string;
  destination?: string;
}

type ChartType = "line" | "bar" | "area";
type TimePeriod = "week" | "month" | "3months" | "6months" | "year";

export function PriceTrendChart({
  flights,
  departureDate,
  origin,
  destination,
}: PriceTrendChartProps) {
  const [chartType, setChartType] = useState<ChartType>("area");
  const [showMinMax, setShowMinMax] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [loading, setLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState<Array<{ date: string; price: number; minPrice?: number; maxPrice?: number; count?: number }>>([]);

  // Group data by period to avoid X-axis congestion
  const groupDataByPeriod = (
    data: Array<{
      date: string;
      price: number;
      minPrice?: number;
      maxPrice?: number;
      count?: number;
    }>,
    period: TimePeriod
  ) => {
    if (period === "week" || period === "month") {
      return data; // Show all points for short periods
    }

    // For longer periods, group by week or month
    const grouped: Record<string, { prices: number[]; date: string }> = {};
    const groupBy = period === "year" ? "month" : "week";

    data.forEach((item) => {
      const date = new Date(item.date);
      let key: string;

      if (groupBy === "month") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      } else {
        const weekNum = Math.floor(date.getDate() / 7);
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-W${weekNum}`;
      }

      if (!grouped[key]) {
        grouped[key] = { prices: [], date: item.date };
      }
      grouped[key].prices.push(item.price);
    });

    return Object.values(grouped).map((group) => ({
      date: group.date,
      price: Math.round(group.prices.reduce((a, b) => a + b, 0) / group.prices.length),
      minPrice: Math.round(Math.min(...group.prices)),
      maxPrice: Math.round(Math.max(...group.prices)),
      count: group.prices.length,
    }));
  };

  // Format date labels based on period
  const formatDateLabel = (date: Date, period: TimePeriod) => {
    if (period === "week") {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else if (period === "month") {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else if (period === "3months" || period === "6months") {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else {
      // Year - show month only
      return date.toLocaleDateString("en-US", { month: "short" });
    }
  };

  // Fetch price trends when component mounts or dependencies change
  useEffect(() => {
    if (origin && destination && departureDate) {
      fetchPriceTrends();
    }
  }, [timePeriod, origin, destination, departureDate, flights.length]);

  // Fetch historical/future price trends from Amadeus API
  const fetchPriceTrends = async () => {
    if (!origin || !destination || !departureDate) return;
    
    setLoading(true);
    try {
      console.log(`Fetching trends for ${origin} -> ${destination}, period: ${timePeriod}`);
      const response = await fetch(
        `/api/flights/price-trends?origin=${origin}&destination=${destination}&departureDate=${departureDate}&period=${timePeriod}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(`Received ${data.trends?.length || 0} trend data points`);
        
        // If we have actual flight prices, use them to adjust trend data
        if (flights.length > 0 && data.trends?.length > 0) {
          const avgFlightPrice = flights.reduce((sum, f) => sum + parseFloat(f.price.total), 0) / flights.length;
          const avgTrendPrice = data.trends.reduce((sum: number, t: { price: number }) => sum + t.price, 0) / data.trends.length;
          const ratio = avgFlightPrice / avgTrendPrice;
          
          // Adjust trend prices to match actual search results
          const adjustedTrends = data.trends.map((t: { date: string; price: number }) => ({
            date: t.date,
            price: Math.round(t.price * ratio),
          }));
          setHistoricalData(adjustedTrends);
        } else {
          setHistoricalData(data.trends || []);
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch trends:", response.status, errorData);
        setHistoricalData([]);
      }
    } catch (error) {
      console.error("Failed to fetch price trends:", error);
      setHistoricalData([]);
    } finally {
      setLoading(false);
    }
  };

  
  const getChartData = () => {
   
    if (historicalData.length > 0) {
      console.log(`Displaying ${historicalData.length} trend data points from API`);
      
    
      const groupedData = groupDataByPeriod(historicalData, timePeriod);
      
      const trendData = groupedData.map((item) => {
        const date = new Date(item.date);
        return {
          date: formatDateLabel(date, timePeriod),
          fullDate: date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          rawDate: item.date,
          price: Math.round(item.price),
          minPrice: Math.round(item.minPrice || item.price * 0.95),
          maxPrice: Math.round(item.maxPrice || item.price * 1.05),
          count: item.count || 1,
          isSearchResult: false,
        };
      });
      return trendData;
    }

    console.log("No API trend data, using search results");
    if (!flights || flights.length === 0) {
      return [];
    }

    const priceByDate: Record<
      string,
      { prices: number[]; count: number; rawDate: Date }
    > = {};

    flights.forEach((flight) => {
      try {
        const departureStr =
          flight.itineraries[0].segments[0].departure.at.split("T")[0];
        const date = new Date(departureStr);
        const price = parseFloat(flight.price.total);

        if (!isNaN(price) && date) {
          const dateKey = date.toISOString().split("T")[0];

          if (!priceByDate[dateKey]) {
            priceByDate[dateKey] = { prices: [], count: 0, rawDate: date };
          }

          priceByDate[dateKey].prices.push(price);
          priceByDate[dateKey].count++;
        }
      } catch (error) {
        console.warn("⚠️ Error processing flight:", error);
      }
    });

    const sortedDates = Object.keys(priceByDate)
      .map((key) => ({ key, date: priceByDate[key].rawDate }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const data = sortedDates.map(({ key, date }) => {
      const dayData = priceByDate[key];
      const avgPrice =
        dayData.prices.reduce((sum, p) => sum + p, 0) / dayData.prices.length;
      const minPrice = Math.min(...dayData.prices);
      const maxPrice = Math.max(...dayData.prices);

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        fullDate: date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        rawDate: key,
        price: Math.round(avgPrice),
        minPrice: Math.round(minPrice),
        maxPrice: Math.round(maxPrice),
        count: dayData.count,
        isSearchResult: true,
      };
    });

    return data;
  };

  const chartData = getChartData();

  // Calculate price statistics
  const getStats = () => {
    if (chartData.length === 0) return null;
    const prices = chartData.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    return { min, max, avg };
  };

  // Calculate interval for X-axis based on data length
  const getXAxisInterval = () => {
    const dataLength = chartData.length;
    if (dataLength <= 7) return 0; // Show all for week
    if (dataLength <= 30) return Math.floor(dataLength / 10); // Show ~10 labels for month
    if (dataLength <= 90) return Math.floor(dataLength / 12); // Show ~12 labels for 3 months
    return Math.floor(dataLength / 12); // Show ~12 labels for longer periods
  };

  const stats = getStats();

  if (chartData.length === 0 && flights.length > 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="text-center text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">No price trend data available</p>
          <p className="text-xs mt-2">Try searching for different dates or routes</p>
        </div>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700 shadow-lg">
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-foreground text-base sm:text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Price Trends Over Time
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {origin && destination
                  ? `${origin} → ${destination} • `
                  : ""}Real-time price analysis
              </p>
            </div>
            <div className="flex gap-2">
              {["area", "line", "bar"].map((type) => (
                <Button
                  key={type}
                  variant={chartType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType(type as ChartType)}
                  className="text-xs capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { value: "week" as TimePeriod, label: "Next Week" },
              { value: "month" as TimePeriod, label: "Next Month" },
              { value: "3months" as TimePeriod, label: "3 Months" },
              { value: "6months" as TimePeriod, label: "6 Months" },
              { value: "year" as TimePeriod, label: "1 Year" },
            ].map((period) => (
              <Button
                key={period.value}
                variant={timePeriod === period.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimePeriod(period.value)}
                className="text-xs"
                disabled={loading}
              >
                {loading && timePeriod === period.value ? (
                  <span className="flex items-center gap-1">
                    <span className="animate-spin">⏳</span>
                    {period.label}
                  </span>
                ) : (
                  period.label
                )}
              </Button>
            ))}
          </div>

          {stats && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">
                    Lowest
                  </span>
                </div>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">
                  ${stats.min}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    Average
                  </span>
                </div>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  ${stats.avg}
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    Highest
                  </span>
                </div>
                <p className="text-xl font-bold text-amber-900 dark:text-amber-100">
                  ${stats.max}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              {loading ? (
                <span className="flex items-center gap-1">
                  <span className="animate-pulse">Loading trends...</span>
                </span>
              ) : (
                `${chartData.length} data points ${historicalData.length > 0 ? "from Amadeus API" : "from search results"}`
              )}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMinMax(!showMinMax)}
              className="text-xs h-7"
            >
              {showMinMax ? "Hide" : "Show"} Min/Max
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={350}>
          {chartType === "line" ? (
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-700"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                stroke="currentColor"
                className="text-slate-600 dark:text-slate-300"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 10 }}
                interval={"preserveStartEnd"}
                tickMargin={10}
              />
              <YAxis
                stroke="currentColor"
                className="text-slate-600 dark:text-slate-300"
                tick={{ fontSize: 11 }}
                width={60}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  padding: "12px",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
                itemStyle={{
                  color: "hsl(var(--foreground))",
                  fontSize: "13px",
                }}
                formatter={(
                  value: number | string | undefined,
                  name?: string,
                ) => [
                  `$${value ?? 0}`,
                  name === "price"
                    ? "Avg Price"
                    : name === "minPrice"
                      ? "Min Price"
                      : name === "maxPrice"
                        ? "Max Price"
                        : name || "Price",
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", r: 4, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#1d4ed8" }}
                name="Average Price"
              />
              {showMinMax && (
                <>
                  <Line
                    type="monotone"
                    dataKey="minPrice"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#10b981", r: 3 }}
                    name="Minimum Price"
                  />
                  <Line
                    type="monotone"
                    dataKey="maxPrice"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#f59e0b", r: 3 }}
                    name="Maximum Price"
                  />
                </>
              )}
            </LineChart>
          ) : chartType === "area" ? (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-700"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                stroke="currentColor"
                className="text-slate-600 dark:text-slate-300"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 10 }}
                interval={"preserveStartEnd"}
                tickMargin={10}
              />
              <YAxis
                stroke="currentColor"
                className="text-slate-600 dark:text-slate-300"
                tick={{ fontSize: 11 }}
                width={60}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  padding: "12px",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
                itemStyle={{
                  color: "hsl(var(--foreground))",
                  fontSize: "13px",
                }}
                formatter={(
                  value: number | string | undefined,
                  name?: string,
                ) => [
                  `$${value ?? 0}`,
                  name === "price"
                    ? "Avg Price"
                    : name === "minPrice"
                      ? "Min Price"
                      : name === "maxPrice"
                        ? "Max Price"
                        : name || "Price",
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                iconType="rect"
              />
              {showMinMax && (
                <Area
                  type="monotone"
                  dataKey="maxPrice"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  fill="url(#colorMax)"
                  name="Maximum Price"
                />
              )}
              <Area
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={3}
                fill="url(#colorPrice)"
                name="Average Price"
              />
              {showMinMax && (
                <Area
                  type="monotone"
                  dataKey="minPrice"
                  stroke="#10b981"
                  strokeWidth={1.5}
                  fill="url(#colorMin)"
                  name="Minimum Price"
                />
              )}
            </AreaChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-700"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                stroke="currentColor"
                className="text-slate-600 dark:text-slate-300"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 10 }}
                interval={"preserveStartEnd"}
                tickMargin={10}
              />
              <YAxis
                stroke="currentColor"
                className="text-slate-600 dark:text-slate-300"
                tick={{ fontSize: 11 }}
                width={60}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  padding: "12px",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
                itemStyle={{
                  color: "hsl(var(--foreground))",
                  fontSize: "13px",
                }}
                formatter={(value: number | string | undefined) => [
                  `$${value ?? 0}`,
                  "Average Price",
                ]}
              />
              <Bar
                dataKey="price"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
