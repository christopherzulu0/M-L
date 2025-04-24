"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface CityData {
  year: number
  averagePrice: number
  changePercent: number
}

export default function ZambianRealEstateMarketTrends() {
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [marketData, setMarketData] = useState<CityData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/zambia-real-estate-data.json")
      const data = await response.json()
      const cityNames = Object.keys(data)
      setCities(cityNames)
      setSelectedCity(cityNames[0])
      setMarketData(data[cityNames[0]])
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchCityData = async () => {
      const response = await fetch("/zambia-real-estate-data.json")
      const data = await response.json()
      setMarketData(data[selectedCity])
    }

    if (selectedCity) {
      fetchCityData()
    }
  }, [selectedCity])

  const formatKwacha = (value: number) => `K${value.toLocaleString()}`

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Zambian Real Estate Market Trends</CardTitle>
        <CardDescription>Historical price data and market trends for different cities in Zambia</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select onValueChange={setSelectedCity} value={selectedCity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-8">
          <ChartContainer
            config={{
              averagePrice: {
                label: "Average Price",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData}>
                <XAxis dataKey="year" />
                <YAxis tickFormatter={formatKwacha} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="averagePrice" stroke="var(--color-averagePrice)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ChartContainer
            config={{
              changePercent: {
                label: "Price Change (%)",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketData}>
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="changePercent" fill="var(--color-changePercent)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
