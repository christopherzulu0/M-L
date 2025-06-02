"use client"

import { useState, useEffect } from "react"
import { PropertyCard } from "./property-card"
import Link from "next/link"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { PatternBackground } from "./ui/pattern-background"
import { cn } from "@/lib/utils"
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

interface Property {
  id: number
  title: string
  address: string
  price: number
  listingType: {
    name: string
  }
  propertyType: {
    name: string
  }
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  media: {
    filePath: string
    mediaType: string
    isPrimary: boolean
  }[]
}

export default function Properties() {
  // Base URL for media files
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""

  const [activeTab, setActiveTab] = useState<"all" | "sale" | "rent">("all")
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    minBeds: "",
    minBaths: ""
  })

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true)
      try {
        // Determine status filter based on activeTab
        const statusParam = activeTab !== "all"
          ? `&status=${activeTab === "sale" ? "For Sale" : "For Rent"}`
          : ""

        const response = await fetch(`/api/properties?limit=6${statusParam}`, {
          credentials: 'include', // Include cookies for authentication
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        if (data.properties) {
          setProperties(data.properties)
        } else {
          console.error("No properties found in response:", data)
          setProperties([])
        }
      } catch (error) {
        console.error("Error fetching properties:", error)
        setProperties([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [activeTab])

  // Filter properties based on search query and filters
  useEffect(() => {
    let filtered = [...properties]

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.propertyType?.name.toLowerCase().includes(query)
      )
    }

    // Apply property type filter
    if (filters.propertyType) {
      filtered = filtered.filter(property =>
        property.propertyType?.name === filters.propertyType
      )
    }

    // Apply price range filters
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice)
      filtered = filtered.filter(property => property.price >= minPrice)
    }

    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice)
      filtered = filtered.filter(property => property.price <= maxPrice)
    }

    // Apply bedroom filter
    if (filters.minBeds) {
      const minBeds = parseInt(filters.minBeds)
      filtered = filtered.filter(property =>
        property.bedrooms !== undefined && property.bedrooms >= minBeds
      )
    }

    // Apply bathroom filter
    if (filters.minBaths) {
      const minBaths = parseFloat(filters.minBaths)
      filtered = filtered.filter(property =>
        property.bathrooms !== undefined && property.bathrooms >= minBaths
      )
    }

    setFilteredProperties(filtered)
  }, [searchQuery, properties, filters])

  return (
    <>
      {/* Properties Section */}
      <section className="relative py-20">
        <PatternBackground />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Latest Properties</h2>
              <p className="mt-2 text-lg text-muted-foreground">BROWSE HOT OFFERS</p>
            </div>
            <div className="inline-flex p-1 bg-gray-100 rounded-lg">
              <Button
                variant="ghost"
                className={cn("rounded-md px-6", activeTab === "all" && "bg-white shadow-sm text-blue-600")}
                onClick={() => setActiveTab("all")}
              >
                All Categories
              </Button>
              <Button
                variant="ghost"
                className={cn("rounded-md px-6", activeTab === "sale" && "bg-white shadow-sm text-blue-600")}
                onClick={() => setActiveTab("sale")}
              >
                For Sale
              </Button>
              <Button
                variant="ghost"
                className={cn("rounded-md px-6", activeTab === "rent" && "bg-white shadow-sm text-blue-600")}
                onClick={() => setActiveTab("rent")}
              >
                For Rent
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-grow max-w-md">
                <Input
                  type="text"
                  placeholder="Search properties..."
                  className="pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filters
                {showFilters ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            {showFilters && (
              <Card className="mt-4 border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Property Type</label>
                      <Select
                        value={filters.propertyType}
                        onValueChange={(value) => setFilters({...filters, propertyType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any type</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Villa">Villa</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Land">Land</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Min Price</label>
                      <Input
                        type="number"
                        placeholder="Min price"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Max Price</label>
                      <Input
                        type="number"
                        placeholder="Max price"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Min Bedrooms</label>
                      <Select
                        value={filters.minBeds}
                        onValueChange={(value) => setFilters({...filters, minBeds: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">Min Bathrooms</label>
                      <Select
                        value={filters.minBaths}
                        onValueChange={(value) => setFilters({...filters, minBaths: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFilters({
                          propertyType: "",
                          minPrice: "",
                          maxPrice: "",
                          minBeds: "",
                          minBaths: ""
                        });
                      }}
                      className="mr-2"
                    >
                      Reset Filters
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowFilters(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              // Loading state
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/3] rounded-xl bg-gray-200"></div>
                  <div className="mt-4 h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>
                  <div className="mt-4 h-8 w-full rounded bg-gray-200"></div>
                </div>
              ))
            ) : filteredProperties.length === 0 ? (
              // No properties found
              <div className="col-span-3 py-10 text-center">
                <p className="text-lg text-muted-foreground">
                  {properties.length === 0 ? "No properties found" : "No properties match your search"}
                </p>
              </div>
            ) : (
              // Properties list
              filteredProperties.map((property) => {
                // Determine badges based on listing type
                const badges = []
                if (property.listingType?.name === "For Sale") {
                  badges.push("Sale")
                } else if (property.listingType?.name === "For Rent") {
                  badges.push("Rent")
                }

                // Add a featured badge for some properties (optional)
                if (property.id % 2 === 0) {
                  badges.push("Featured")
                }

                // Get the first image from media array or use a default
                // Make sure we're accessing the correct property's media
                const propertyMedia = property.media || [];

                // Find primary image first, then fall back to first image
                const primaryImage = propertyMedia.find(m => m.isPrimary);
                let filePath = primaryImage?.filePath || (propertyMedia.length > 0 ? propertyMedia[0]?.filePath : null);

                // Add baseUrl if needed
                let imageUrl;
                if (filePath) {
                  // Check if filePath is already a full URL
                  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
                    imageUrl = filePath;
                  } else {
                    // Otherwise, prefix with baseUrl
                    imageUrl = `${baseUrl}${filePath}`;
                  }
                } else {
                  // Default image if no media is available
                  imageUrl = "https://digiestateorg.wordpress.com/wp-content/uploads/2023/11/ask-us-1024x583-1.jpg";
                }

                // Format price with currency
                const formattedPrice = `ZMW ${property.price.toLocaleString()}`

                // Determine if it's monthly or total price
                const period = property.listingType?.name === "For Rent" ? "month" : "total"

                return (
                  <Link key={property.id} href={`/listing-single/${property.id}`} className="block hover:no-underline">
                    <div className="transition-transform hover:scale-105">
                      <PropertyCard
                        image={imageUrl}
                        title={property.title}
                        address={property.address}
                        price={formattedPrice}
                        period={period}
                        type={property.propertyType?.name || "Property"}
                        badges={badges}
                        features={{
                          beds: property.bedrooms,
                          baths: property.bathrooms,
                          sqft: property.squareFeet
                        }}
                        propertyId={property.id}
                        disableLink={true}
                      />
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </section>
    </>
  )
}
