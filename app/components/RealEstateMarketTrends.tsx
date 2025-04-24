"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const locations = ["California", "New York", "Texas", "Florida", "Illinois"]

export default function RealEstateMarketTrends() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0])
  const [marketData, setMarketData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/zillow?location=${selectedLocation}`)
      const data = await response.json()
      setMarketData(data)
    }

    fetchData()
  }, [selectedLocation])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Real Estate Market Trends</CardTitle>
        <CardDescription>Historical price data and market trends for different locations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select onValueChange={setSelectedLocation} defaultValue={selectedLocation}>
            <SelectTrigger className="w-[180px]">
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
        </div>
        <div className="space-y-8">
          <ChartContainer
            config={{
              median: {
                label: "Median Price",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="median" stroke="var(--color-median)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ChartContainer
            config={{
              change: {
                label: "Price Change",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="change" fill="var(--color-change)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
