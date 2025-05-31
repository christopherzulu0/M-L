"use client"

import { useState, useEffect } from "react"
import { PropertyCard } from "@/components/property-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PatternBackground } from "@/components/ui/pattern-background"
import { Heart, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load favorites from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      setFavorites(storedFavorites)
    }
  }, [])

  // Fetch favorited properties
  useEffect(() => {
    const fetchFavoriteProperties = async () => {
      if (favorites.length === 0) {
        setIsLoading(false)
        setProperties([])
        return
      }

      setIsLoading(true)
      try {
        // Fetch each favorited property
        const propertyPromises = favorites.map(id =>
          fetch(`/api/properties/${id}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }).then(res => {
            if (!res.ok) {
              throw new Error(`Failed to fetch property ${id}`)
            }
            return res.json()
          })
        )

        const propertiesData = await Promise.all(propertyPromises)
        setProperties(propertiesData.filter(Boolean))
      } catch (error) {
        console.error("Error fetching favorite properties:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavoriteProperties()
  }, [favorites])

  // Handle removing a property from favorites
  const handleRemoveFromFavorites = (propertyId: string) => {
    const updatedFavorites = favorites.filter(id => id !== propertyId)
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    setFavorites(updatedFavorites)

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('favoritesUpdated'))
  }

  return (
    <main className="bg-gray-50">
      <section className="relative py-20">
        <PatternBackground />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Favorite Properties</h1>
            <p className="mt-2 text-lg text-muted-foreground">Properties you've saved for later</p>
          </div>

          {isLoading ? (
            // Loading state
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array(3).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/3] rounded-xl bg-gray-200"></div>
                  <div className="mt-4 h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>
                  <div className="mt-4 h-8 w-full rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            // No favorites
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">No favorites yet</AlertTitle>
              <AlertDescription className="text-blue-700">
                You haven't added any properties to your favorites yet. Browse properties and click the heart icon to add them here.
              </AlertDescription>
              <Button className="mt-4" asChild>
                <Link href="/">Browse Properties</Link>
              </Button>
            </Alert>
          ) : properties.length === 0 ? (
            // Favorites exist but couldn't fetch properties
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Couldn't load favorites</AlertTitle>
              <AlertDescription className="text-amber-700">
                We couldn't load your favorite properties. They may have been removed or there might be a connection issue.
              </AlertDescription>
              <Button className="mt-4" asChild>
                <Link href="/">Browse Properties</Link>
              </Button>
            </Alert>
          ) : (
            // Display favorited properties
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => {
                // Determine badges based on listing type
                const badges = []
                if (property.listingType?.name === "For Sale") {
                  badges.push("Sale")
                } else if (property.listingType?.name === "For Rent") {
                  badges.push("Rent")
                }

                // Add a favorite badge
                badges.push("Favorite")

                // Get the first image from media array or use a default
                const propertyMedia = property.media || [];
                const imageUrl = propertyMedia.length > 0 && propertyMedia[0]?.filePath
                  ? propertyMedia[0].filePath
                  : "https://digiestateorg.wordpress.com/wp-content/uploads/2023/11/ask-us-1024x583-1.jpg"

                // Format price with currency
                const formattedPrice = `ZMW ${property.price.toLocaleString()}`

                // Determine if it's monthly or total price
                const period = property.listingType?.name === "For Rent" ? "month" : "total"

                return (
                  <div key={property.id} className="relative group">
                    <Link href={`/listing-single/${property.id}`} className="block hover:no-underline">
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
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFromFavorites(property.id.toString())}
                    >
                      <Heart className="h-4 w-4 mr-2 fill-white" /> Remove
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
