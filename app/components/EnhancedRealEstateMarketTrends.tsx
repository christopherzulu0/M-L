"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Building2, DollarSign, TrendingUp, Clock } from "lucide-react"

interface MarketData {
  year: number
  averagePrice: number
  medianPrice: number
  priceChange: number
  listings: number
  daysOnMarket: number
}

const locations = ["New York", "Los Angeles"]
const propertyTypes = ["Residential", "Commercial"]

export default function EnhancedRealEstateMarketTrends() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0])
  const [selectedPropertyType, setSelectedPropertyType] = useState(propertyTypes[0])
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [dateRange, setDateRange] = useState([2018, 2022])
  const [showBarChart, setShowBarChart] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/real-estate?location=${encodeURIComponent(selectedLocation)}&propertyType=${selectedPropertyType}&startYear=${dateRange[0]}&endYear=${dateRange[1]}`,
      )
      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }
      const data = await response.json()
      setMarketData(data)
    }

    fetchData()
  }, [selectedLocation, selectedPropertyType, dateRange])

  const formatCurrency = (value: number) => `ZMW ${value.toLocaleString()}`

  const getLatestData = () => marketData[marketData.length - 1] || {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-2 py-2 sm:px-4 lg:px-8">
        <div
          className="relative py-6 sm:py-8 lg:py-16 mb-4 sm:mb-6 lg:mb-8 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="relative z-10 text-center text-white px-2 sm:px-4">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 lg:mb-4">
              Real Estate Market Trends
            </h1>
            <p className="text-sm sm:text-base md:text-lg">Explore property market data and insights</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6">
              <Select onValueChange={setSelectedLocation} defaultValue={selectedLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
                Property Type
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6">
              <Select onValueChange={setSelectedPropertyType} defaultValue={selectedPropertyType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
                Date Range
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6">
              <Slider min={2018} max={2022} step={1} value={dateRange} onValueChange={setDateRange} className="mt-2" />
              <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-300">
                <span>{dateRange[0]}</span>
                <span>{dateRange[1]}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between p-2 sm:p-3 lg:p-4">
              <CardTitle className="text-xs sm:text-sm lg:text-base font-semibold truncate">Average Price</CardTitle>
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-2 sm:p-3 lg:p-4">
              <p className="text-sm sm:text-lg lg:text-2xl font-bold truncate">
                {formatCurrency(getLatestData().averagePrice || 0)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between p-2 sm:p-3 lg:p-4">
              <CardTitle className="text-xs sm:text-sm lg:text-base font-semibold truncate">Median Price</CardTitle>
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-2 sm:p-3 lg:p-4">
              <p className="text-sm sm:text-lg lg:text-2xl font-bold truncate">
                {formatCurrency(getLatestData().medianPrice || 0)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between p-2 sm:p-3 lg:p-4">
              <CardTitle className="text-xs sm:text-sm lg:text-base font-semibold truncate">Price Change</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-2 sm:p-3 lg:p-4">
              <p className="text-sm sm:text-lg lg:text-2xl font-bold truncate">
                {(getLatestData().priceChange || 0).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between p-2 sm:p-3 lg:p-4">
              <CardTitle className="text-xs sm:text-sm lg:text-base font-semibold truncate">
                Avg. Days on Market
              </CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-2 sm:p-3 lg:p-4">
              <p className="text-sm sm:text-lg lg:text-2xl font-bold truncate">{getLatestData().daysOnMarket || 0}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-4 sm:mb-6 lg:mb-8 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base sm:text-lg lg:text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Price Trends
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Historical price data for {selectedLocation} ({selectedPropertyType})
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Switch
                  id="chart-type"
                  checked={showBarChart}
                  onCheckedChange={setShowBarChart}
                  className="scale-75 sm:scale-100"
                />
                <Label htmlFor="chart-type" className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Show as Bar Chart
                </Label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-1 sm:p-2 lg:p-4">
            <div className="w-full overflow-hidden">
              <ChartContainer
                config={{
                  averagePrice: {
                    label: "Average Price",
                    color: "hsl(215, 100%, 50%)",
                  },
                  medianPrice: {
                    label: "Median Price",
                    color: "hsl(145, 100%, 50%)",
                  },
                }}
                className="h-[200px] sm:h-[300px] lg:h-[400px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  {showBarChart ? (
                    <BarChart data={marketData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="year" stroke="#888888" tick={{ fontSize: 10 }} tickMargin={8} axisLine={false} />
                      <YAxis
                        tickFormatter={formatCurrency}
                        stroke="#888888"
                        tick={{ fontSize: 10 }}
                        tickMargin={8}
                        width={60}
                        axisLine={false}
                        tickCount={5}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                      <Bar dataKey="averagePrice" fill="hsl(215, 100%, 50%)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="medianPrice" fill="hsl(145, 100%, 50%)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  ) : (
                    <LineChart data={marketData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="year" stroke="#888888" tick={{ fontSize: 10 }} tickMargin={8} axisLine={false} />
                      <YAxis
                        tickFormatter={formatCurrency}
                        stroke="#888888"
                        tick={{ fontSize: 10 }}
                        tickMargin={8}
                        width={60}
                        axisLine={false}
                        tickCount={5}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        cursor={{ stroke: "rgba(0,0,0,0.05)", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="averagePrice"
                        stroke="hsl(215, 100%, 50%)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="medianPrice"
                        stroke="hsl(145, 100%, 50%)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="p-3 sm:p-4 lg:p-6">
            <CardTitle className="text-base sm:text-lg lg:text-2xl font-bold text-gray-800 dark:text-gray-100">
              Market Activity
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
              Number of listings and average days on market
            </CardDescription>
          </CardHeader>
          <CardContent className="p-1 sm:p-2 lg:p-4">
            <div className="w-full overflow-hidden">
              <ChartContainer
                config={{
                  listings: {
                    label: "Number of Listings",
                    color: "hsl(280, 100%, 50%)",
                  },
                  daysOnMarket: {
                    label: "Days on Market",
                    color: "hsl(30, 100%, 50%)",
                  },
                }}
                className="h-[200px] sm:h-[300px] lg:h-[400px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="year" stroke="#888888" tick={{ fontSize: 10 }} tickMargin={8} axisLine={false} />
                    <YAxis
                      yAxisId="left"
                      stroke="#888888"
                      tick={{ fontSize: 10 }}
                      tickMargin={8}
                      width={40}
                      axisLine={false}
                      tickCount={5}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#888888"
                      tick={{ fontSize: 10 }}
                      tickMargin={8}
                      width={40}
                      axisLine={false}
                      tickCount={5}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ stroke: "rgba(0,0,0,0.05)", strokeWidth: 2 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="listings"
                      stroke="hsl(280, 100%, 50%)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="daysOnMarket"
                      stroke="hsl(30, 100%, 50%)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
