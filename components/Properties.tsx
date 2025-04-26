"use client"

import { useState, useEffect } from "react"
import { PropertyCard } from "./property-card"
import Link from "next/link"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { PatternBackground } from "./ui/pattern-background"
import { cn } from "@/lib/utils"

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
    type: string
  }[]
}

export default function Properties() {
  const [activeTab, setActiveTab] = useState<"all" | "sale" | "rent">("all")
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true)
      try {
        // Determine status filter based on activeTab
        const statusParam = activeTab !== "all" 
          ? `&status=${activeTab === "sale" ? "For Sale" : "For Rent"}` 
          : ""

        const response = await fetch(`/api/properties?limit=6${statusParam}`)
        const data = await response.json()

        if (data.properties) {
          setProperties(data.properties)
        }
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [activeTab])

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
            <Input type="text" placeholder="Search properties..." className="max-w-md" />
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
            ) : properties.length === 0 ? (
              // No properties found
              <div className="col-span-3 py-10 text-center">
                <p className="text-lg text-muted-foreground">No properties found</p>
              </div>
            ) : (
              // Properties list
              properties.map((property) => {
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
                const imageUrl = propertyMedia.length > 0 && propertyMedia[0]?.filePath
                  ? propertyMedia[0].filePath 
                  : "https://digiestateorg.wordpress.com/wp-content/uploads/2023/11/ask-us-1024x583-1.jpg"

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
