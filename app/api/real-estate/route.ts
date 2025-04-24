import { NextResponse } from "next/server"

// Enhanced mock data
const mockData = {
  "New York": {
    Residential: [
      { year: 2018, averagePrice: 1000000, medianPrice: 950000, priceChange: 5.2, listings: 5000, daysOnMarket: 45 },
      { year: 2019, averagePrice: 1050000, medianPrice: 1000000, priceChange: 5.0, listings: 5200, daysOnMarket: 42 },
      { year: 2020, averagePrice: 1100000, medianPrice: 1050000, priceChange: 4.8, listings: 4800, daysOnMarket: 50 },
      { year: 2021, averagePrice: 1160000, medianPrice: 1100000, priceChange: 5.5, listings: 5100, daysOnMarket: 38 },
      { year: 2022, averagePrice: 1230000, medianPrice: 1170000, priceChange: 6.0, listings: 5300, daysOnMarket: 35 },
    ],
    Commercial: [
      { year: 2018, averagePrice: 2000000, medianPrice: 1900000, priceChange: 4.5, listings: 1000, daysOnMarket: 60 },
      { year: 2019, averagePrice: 2100000, medianPrice: 2000000, priceChange: 5.0, listings: 1100, daysOnMarket: 58 },
      { year: 2020, averagePrice: 2150000, medianPrice: 2050000, priceChange: 2.4, listings: 900, daysOnMarket: 75 },
      { year: 2021, averagePrice: 2250000, medianPrice: 2150000, priceChange: 4.7, listings: 950, daysOnMarket: 65 },
      { year: 2022, averagePrice: 2400000, medianPrice: 2300000, priceChange: 6.7, listings: 1050, daysOnMarket: 55 },
    ],
  },
  "Los Angeles": {
    Residential: [
      { year: 2018, averagePrice: 900000, medianPrice: 850000, priceChange: 4.8, listings: 4500, daysOnMarket: 40 },
      { year: 2019, averagePrice: 940000, medianPrice: 890000, priceChange: 4.4, listings: 4700, daysOnMarket: 38 },
      { year: 2020, averagePrice: 980000, medianPrice: 930000, priceChange: 4.3, listings: 4300, daysOnMarket: 45 },
      { year: 2021, averagePrice: 1030000, medianPrice: 980000, priceChange: 5.1, listings: 4600, daysOnMarket: 35 },
      { year: 2022, averagePrice: 1090000, medianPrice: 1040000, priceChange: 5.8, listings: 4800, daysOnMarket: 32 },
    ],
    Commercial: [
      { year: 2018, averagePrice: 1800000, medianPrice: 1700000, priceChange: 4.0, listings: 900, daysOnMarket: 55 },
      { year: 2019, averagePrice: 1880000, medianPrice: 1780000, priceChange: 4.4, listings: 950, daysOnMarket: 52 },
      { year: 2020, averagePrice: 1920000, medianPrice: 1820000, priceChange: 2.1, listings: 800, daysOnMarket: 70 },
      { year: 2021, averagePrice: 2010000, medianPrice: 1910000, priceChange: 4.7, listings: 850, daysOnMarket: 60 },
      { year: 2022, averagePrice: 2140000, medianPrice: 2040000, priceChange: 6.5, listings: 920, daysOnMarket: 50 },
    ],
  },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location")
  const propertyType = searchParams.get("propertyType") || "Residential"
  const startYear = Number.parseInt(searchParams.get("startYear") || "2018")
  const endYear = Number.parseInt(searchParams.get("endYear") || "2022")

  if (!location) {
    return NextResponse.json({ error: "Location is required" }, { status: 400 })
  }

  const locationData = mockData[location as keyof typeof mockData]

  if (!locationData) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 })
  }

  const filteredData = locationData[propertyType as keyof typeof locationData].filter(
    (item) => item.year >= startYear && item.year <= endYear,
  )

  return NextResponse.json(filteredData)
}
