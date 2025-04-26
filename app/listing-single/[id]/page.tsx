"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import { PropertyCard } from "@/components/property-card"
import { SectionHeader } from "@/components/ui/section-header"
import { PatternBackground } from "@/components/ui/pattern-background"
import { Bed, Bath, Square, MapPin, Phone, Mail, Share2, Heart, Printer } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import dynamic from "next/dynamic"

const MapWithNoSSR = dynamic(() => import("@/components/map"), { ssr: false })

interface Property {
  id: number
  title: string
  description: string
  address: string
  price: number
  priceType: string
  bedrooms: number | null
  bathrooms: number | null
  squareFeet: number | null
  yearBuilt: number | null
  parkingSpaces: number | null
  FloorPlan: string | null
  DView: string | null
  listingType: {
    id?: number
    name: string
  }
  propertyType: {
    id?: number
    name: string
  }
  location: {
    id?: number
    name: string
    city: string
    country: string
  }
  agent: {
    user: {
      firstName: string
      lastName: string
      email: string
      phone: string | null
      profileImage: string | null
    }
  } | null
  features: {
    feature: {
      id: number
      name: string
      category: string
    }
  }[]
  media: {
    id: number
    filePath: string
    fileName: string
    mediaType: string
    isPrimary: boolean
  }[]
}

export default function ListingSingle({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params)
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeImage, setActiveImage] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [similarProperties, setSimilarProperties] = useState<Property[]>([])
  const [isSimilarLoading, setIsSimilarLoading] = useState(true)

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/properties/${unwrappedParams.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch property')
        }
        const data = await response.json()
        setProperty(data)

        // Set up images
        if (data.media && data.media.length > 0) {
          const mediaUrls = data.media.map((item: any) => item.filePath)
          setImages(mediaUrls)
          setActiveImage(mediaUrls[0])
        } else {
          // Fallback images if no media is available
          const fallbackImages = [
            "/placeholder.svg",
            "/placeholder.svg?text=Living+Room",
            "/placeholder.svg?text=Kitchen",
            "/placeholder.svg?text=Bedroom",
            "/placeholder.svg?text=Bathroom",
          ]
          setImages(fallbackImages)
          setActiveImage(fallbackImages[0])
        }
      } catch (error) {
        console.error("Error fetching property:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [unwrappedParams.id])

  // Fetch similar properties when the main property is loaded
  useEffect(() => {
    const fetchSimilarProperties = async () => {
      if (!property) return

      setIsSimilarLoading(true)
      try {
        // Build query parameters for similar properties
        const queryParams = new URLSearchParams({
          propertyType: property.propertyType?.id?.toString() || '',
          location: property.location?.id?.toString() || '',
          limit: '3'
        })

        // Add price range (±20% of current property price)
        const minPrice = Math.max(0, property.price * 0.8)
        const maxPrice = property.price * 1.2
        queryParams.append('minPrice', minPrice.toString())
        queryParams.append('maxPrice', maxPrice.toString())

        const response = await fetch(`/api/properties?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch similar properties')
        }

        const data = await response.json()

        // Filter out the current property
        const filtered = data.properties.filter((p: Property) => p.id !== property.id)

        // Take only the first 3 properties
        setSimilarProperties(filtered.slice(0, 3))
      } catch (error) {
        console.error("Error fetching similar properties:", error)
        setSimilarProperties([])
      } finally {
        setIsSimilarLoading(false)
      }
    }

    fetchSimilarProperties()
  }, [property])

  return (
    <main className="bg-gray-50">
      {isLoading ? (
        // Loading state
        <section className="relative py-20">
          <PatternBackground />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-10 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-8"></div>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="aspect-video bg-gray-200 rounded-lg"></div>
                </div>
                <div>
                  <div className="h-64 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : property ? (
        // Property found
        <>
          <section className="relative py-20">
            <PatternBackground />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
                <p className="text-xl text-muted-foreground flex items-center">
                  <MapPin className="w-5 h-5 mr-2" /> {property.address}
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image src={activeImage || "/placeholder.svg"} alt="Property Image" fill className="object-cover" />
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <Image
                        key={index}
                        src={img || "/placeholder.svg"}
                        alt={`Property Image ${index + 1}`}
                        width={100}
                        height={75}
                        className="rounded-md cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => setActiveImage(img)}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h2 className="text-3xl font-bold mb-4">
                      ZMW {property.price.toLocaleString()}
                      {property.listingType.name === "For Rent" ? " / month" : ""}
                    </h2>
                    <div className="flex justify-between mb-4">
                      {property.bedrooms !== null && (
                        <div className="flex items-center">
                          <Bed className="w-5 h-5 mr-2" />
                          <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                        </div>
                      )}
                      {property.bathrooms !== null && (
                        <div className="flex items-center">
                          <Bath className="w-5 h-5 mr-2" />
                          <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                        </div>
                      )}
                      {property.squareFeet !== null && (
                        <div className="flex items-center">
                          <Square className="w-5 h-5 mr-2" />
                          <span>{property.squareFeet.toLocaleString()} sqft</span>
                        </div>
                      )}
                    </div>
                    <Button className="w-full mb-4">Schedule a Tour</Button>
                    <div className="flex justify-between">
                      <Button variant="outline" className="flex-1 mr-2">
                        <Phone className="w-4 h-4 mr-2" /> Call
                      </Button>
                      <Button variant="outline" className="flex-1 ml-2">
                        <Mail className="w-4 h-4 mr-2" /> Email
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="ghost">
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                    <Button variant="ghost">
                      <Heart className="w-4 h-4 mr-2" /> Save
                    </Button>
                    <Button variant="ghost">
                      <Printer className="w-4 h-4 mr-2" /> Print
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Property Details */}
          <section className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
                  <TabsTrigger value="map">Map</TabsTrigger>
                  <TabsTrigger value="3d-view">3D View</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid gap-8 md:grid-cols-3">
                        <div className="md:col-span-2">
                          <h2 className="text-2xl font-bold mb-4">Property Details</h2>
                          <p className="mb-4">
                            {property.description || "No description available."}
                          </p>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">Property Type</h3>
                              <p>{property.propertyType.name}</p>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">Listing Type</h3>
                              <p>{property.listingType.name}</p>
                            </div>
                            {property.yearBuilt && (
                              <div>
                                <h3 className="text-lg font-semibold">Year Built</h3>
                                <p>{property.yearBuilt}</p>
                              </div>
                            )}
                            {property.parkingSpaces !== null && (
                              <div>
                                <h3 className="text-lg font-semibold">Parking Spaces</h3>
                                <p>{property.parkingSpaces}</p>
                              </div>
                            )}
                          </div>

                          <h3 className="text-xl font-semibold mb-2">Features</h3>
                          {property.features && property.features.length > 0 ? (
                            <ul className="list-disc list-inside mb-4">
                              {property.features.map((item) => (
                                <li key={item.feature.id}>{item.feature.name}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mb-4">No features listed.</p>
                          )}

                          <h3 className="text-xl font-semibold mb-2">Location</h3>
                          <p className="mb-4">
                            {property.location.name}, {property.location.city}, {property.location.country}
                          </p>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold mb-4">Contact Agent</h2>
                          <div className="bg-white rounded-lg p-6 shadow-md">
                            {property.agent ? (
                              <div className="flex items-center mb-4">
                                <Image
                                  src={property.agent.user.profileImage || "/placeholder.svg"}
                                  alt={`${property.agent.user.firstName} ${property.agent.user.lastName}`}
                                  width={64}
                                  height={64}
                                  className="rounded-full mr-4"
                                />
                                <div>
                                  <h3 className="font-semibold">{property.agent.user.firstName} {property.agent.user.lastName}</h3>
                                  <p className="text-sm text-muted-foreground">Real Estate Agent</p>
                                  {property.agent.user.phone && (
                                    <p className="text-sm">{property.agent.user.phone}</p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center mb-4">
                                <Image
                                  src="/placeholder.svg"
                                  alt="Agent"
                                  width={64}
                                  height={64}
                                  className="rounded-full mr-4"
                                />
                                <div>
                                  <h3 className="font-semibold">Contact Us</h3>
                                  <p className="text-sm text-muted-foreground">No agent assigned</p>
                                </div>
                              </div>
                            )}
                            <form className="space-y-4">
                              <Input placeholder="Your Name" />
                              <Input type="email" placeholder="Your Email" />
                              <Input type="tel" placeholder="Your Phone" />
                              <Textarea placeholder="Your Message" rows={4} />
                              <Button className="w-full">Send Message</Button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="floorplan">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-2xl font-bold mb-4">Floor Plan</h2>
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                        {property.FloorPlan ? (
                          <Image src={property.FloorPlan} alt="Floor Plan" fill className="object-contain" />
                        ) : (
                          <Image src="/placeholder.svg?text=Floor+Plan" alt="Floor Plan" fill className="object-contain" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="map">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-2xl font-bold mb-4">Location</h2>
                      <div className="h-[400px]">
                        <MapWithNoSSR />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="3d-view">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-2xl font-bold mb-4">3D View</h2>
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        {property.DView ? (
                          <iframe
                            src={property.DView}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-100">
                            <p className="text-muted-foreground">No 3D view available for this property</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Similar Properties */}
          <section className="py-20 bg-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeader title="Similar Properties" subtitle="You might also like these properties" />
              <div className="mt-12 grid gap-8 md:grid-cols-3">
                {isSimilarLoading ? (
                  // Loading state for similar properties
                  Array(3).fill(0).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                      <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                    </div>
                  ))
                ) : similarProperties.length > 0 ? (
                  // Render actual similar properties
                  similarProperties.map((property) => {
                    // Get primary image or fallback
                    const primaryImage = property.media?.find(m => m.isPrimary)?.filePath ||
                                        (property.media?.length ? property.media[0].filePath : "/placeholder.svg");

                    return (
                      <PropertyCard
                        key={property.id}
                        propertyId={property.id}
                        image={primaryImage}
                        title={property.title}
                        address={property.address}
                        price={`ZMW ${property.price.toLocaleString()}`}
                        period={property.listingType.name === "For Rent" ? "month" : undefined}
                        type={property.propertyType.name}
                        badges={[property.listingType.name.replace("For ", "")]}
                        features={{
                          beds: property.bedrooms,
                          baths: property.bathrooms,
                          sqft: property.squareFeet
                        }}
                      />
                    );
                  })
                ) : (
                  // No similar properties found
                  <div className="md:col-span-3 text-center py-8">
                    <p className="text-muted-foreground">No similar properties found.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeader title="Property Reviews" subtitle="What our clients say about this property" />
              <div className="mt-12 grid gap-8 md:grid-cols-2">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                    <div className="flex items-center mb-4">
                      <Image src="/placeholder.svg" alt="Reviewer" width={48} height={48} className="rounded-full mr-4" />
                      <div>
                        <h3 className="font-semibold">Jane Smith</h3>
                        <p className="text-sm text-muted-foreground">Tenant</p>
                      </div>
                    </div>
                    <StarRating rating={5} label="Excellent" className="mb-2" />
                    <p className="text-muted-foreground">
                      "I absolutely love living in this apartment. The location is perfect, and the amenities are top-notch.
                      The management team is responsive and always keeps the building in great condition."
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        // Property not found
        <section className="relative py-20">
          <PatternBackground />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
              <p className="text-muted-foreground">The property you're looking for could not be found.</p>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
