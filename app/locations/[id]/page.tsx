"use client"

import React, { useState, useEffect } from "react"
import { PropertyCard } from "@/components/property-card"
import { SectionHeader } from "@/components/ui/section-header"
import { PatternBackground } from "@/components/ui/pattern-background"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Filter, X, ChevronDown, ChevronUp, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
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

interface Location {
  id: number
  name: string
  city: string
  region?: string
  description?: string
  featured: boolean
  order: number
  image?: string
}

export default function LocationPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params)

  // Base URL for media files
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""

  const [location, setLocation] = useState<Location | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "sale" | "rent">("all")
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

  // Fetch location details and properties
  useEffect(() => {
    const fetchLocationAndProperties = async () => {
      setIsLoading(true)
      try {
        // Fetch location details
        const locationResponse = await fetch(`/api/locations/${unwrappedParams.id}`)
        if (!locationResponse.ok) {
          throw new Error(`Failed to fetch location: ${locationResponse.status} ${locationResponse.statusText}`)
        }
        const locationData = await locationResponse.json()
        setLocation(locationData)

        // Determine status filter based on activeTab
        const statusParam = activeTab !== "all"
          ? `&status=${activeTab === "sale" ? "For Sale" : "For Rent"}`
          : ""

        // Fetch properties for this location
        const propertiesResponse = await fetch(`/api/properties?locationId=${unwrappedParams.id}${statusParam}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!propertiesResponse.ok) {
          throw new Error(`Failed to fetch properties: ${propertiesResponse.status} ${propertiesResponse.statusText}`)
        }

        const propertiesData = await propertiesResponse.json()

        if (propertiesData.properties) {
          setProperties(propertiesData.properties)
        } else {
          console.error("No properties found in response:", propertiesData)
          setProperties([])
        }
      } catch (error: any) {
        console.error("Error fetching data:", error)
        setError(error.message || "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocationAndProperties()
  }, [unwrappedParams.id, activeTab])

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

  if (error) {
    return (
      <div className="container mx-auto py-20 px-4">
        <div className="text-center text-red-500">
          {error}. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Location Header */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <PatternBackground className="opacity-10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 w-1/3 bg-white/20 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-white/20 rounded"></div>
            </div>
          ) : location ? (
            <>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Properties in {location.name}
              </h1>
              <div className="flex items-center text-lg mb-6">
                <MapPin className="h-5 w-5 mr-2" />
                {location.city}{location.region ? `, ${location.region}` : ''}
              </div>
              {location.description && (
                <p className="text-lg max-w-3xl">{location.description}</p>
              )}
            </>
          ) : (
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Location not found
            </h1>
          )}
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={`Properties in ${location?.name || 'this location'}`}
            subtitle={`Explore available properties in ${location?.name || 'this location'}`}
          />

          <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
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
              Array(6).fill(0).map((_, index) => (
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
                  {properties.length === 0
                    ? `No properties found in ${location?.name || 'this location'}`
                    : "No properties match your search criteria"}
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

          {/* Show "View More" button if there are more than 6 properties */}
          {filteredProperties.length > 6 && (
            <div className="mt-12 text-center">
              <Button size="lg" variant="outline">
                View More Properties
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
