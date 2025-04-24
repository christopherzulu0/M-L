"use client"

import { SectionHeader } from "./ui/section-header"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton"

type Location = {
  id: number
  name: string
  city: string
  region?: string
  description?: string
  featured: boolean
  order: number
  image?: string
  properties: any[]
}

export default function FeaturedLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/locations')
        
        if (!response.ok) {
          throw new Error('Failed to fetch locations')
        }
        
        const data = await response.json()
        // Filter to only featured locations and sort by order
        const featuredLocations = data
          .filter((location: Location) => location.featured)
          .sort((a: Location, b: Location) => a.order - b.order)
        
        setLocations(featuredLocations)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching locations:', error)
        setError('Failed to load locations')
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  if (error) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Featured Locations" subtitle="Explore properties in popular cities" />
          <div className="mt-12 text-center text-red-500">
            {error}. Please try again later.
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Featured Locations */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Featured Locations" subtitle="Explore properties in popular cities" />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              // Loading skeletons
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="relative overflow-hidden rounded-2xl">
                  <Skeleton className="aspect-[4/3] w-full" />
                </div>
              ))
            ) : locations.length > 0 ? (
              // Actual locations
              locations.map((location) => (
                <Link key={location.id} href={`/locations/${location.id}`} className="group relative overflow-hidden rounded-2xl">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={location.image || "/placeholder.svg"}
                      alt={location.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-semibold">{location.name}</h3>
                      <p className="text-sm">{location.properties.length} Properties</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // No locations found
              <div className="col-span-full text-center text-gray-500">
                No featured locations found.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}