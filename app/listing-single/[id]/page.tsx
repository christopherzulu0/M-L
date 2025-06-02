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
import { Bed, Bath, Square, MapPin, Phone, Mail, Share2, Heart, Printer, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import dynamic from "next/dynamic"
import {SiteHeader} from "@/components/site-header";

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
  latitude: string | null
  longitude: string | null
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
  const [showDirections, setShowDirections] = useState(false)

  // Base URL for media files
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""

  // Contact form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("I'm interested in this property. Please contact me.")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

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
          const mediaUrls = data.media.map((item: any) => {
            // Check if filePath is already a full URL
            if (item.filePath.startsWith('http://') || item.filePath.startsWith('https://')) {
              return item.filePath;
            }
            // Otherwise, prefix with baseUrl
            return `${baseUrl}${item.filePath}`;
          })
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

        // Check if data has properties array
        if (!data.properties || !Array.isArray(data.properties)) {
          console.error("Expected properties array in response but got:", data)
          setSimilarProperties([])
          return
        }

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

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError("")
    setFormSuccess("")

    try {
      // Validate form
      if (!name || !email || !message) {
        throw new Error("Please fill in all required fields")
      }

      // Get agent ID if available
      const agentId = property?.agent?.user?.email
        ? property.agent.id?.toString()
        : undefined

      // Prepare form data
      const formData = {
        name,
        email,
        subject: `Property Inquiry: ${property?.title || `Property #${unwrappedParams.id}`}`,
        message: `${message}\n\nProperty: ${property?.title || `Property #${unwrappedParams.id}`} (ID: ${unwrappedParams.id})`,
        agentId
      }

      // Send the form data to the API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message')
      }

      // Reset form on success
      setFormSuccess("Your message has been sent! The agent will contact you soon.")
      setName("")
      setEmail("")
      setPhone("")
      setMessage("I'm interested in this property. Please contact me.")
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to send message')
      console.error('Error sending contact form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <>
        {/*<SiteHeader/>*/}
        <main className="bg-gray-50 pt-24">
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
                    <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
                      <div className="md:col-span-2 space-y-4">
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <Image src={activeImage || "/placeholder.svg"} alt="Property Image" fill className="object-cover" />
                        </div>
                        <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 -mx-2 px-2">
                          {images.map((img, index) => (
                              <Image
                                  key={index}
                                  src={img || "/placeholder.svg"}
                                  alt={`Property Image ${index + 1}`}
                                  width={80}
                                  height={60}
                                  className="rounded-md cursor-pointer hover:opacity-75 transition-opacity flex-shrink-0 sm:w-[100px] sm:h-[75px]"
                                  onClick={() => setActiveImage(img)}
                              />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                            ZMW {property.price.toLocaleString()}
                            {property.listingType.name === "For Rent" ? " / month" : ""}
                          </h2>
                          <div className="grid grid-cols-1 sm:flex sm:justify-between gap-2 mb-4">
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
                            <Button
                              variant="outline"
                              className="flex-1 mr-2 text-xs sm:text-sm"
                              onClick={() => {
                                if (property?.agent?.user?.phone) {
                                  window.location.href = `tel:${property.agent.user.phone}`;
                                } else {
                                  alert("Agent phone number is not available");
                                }
                              }}
                            >
                              <Phone className="w-4 h-4 mr-1 sm:mr-2" /> Call
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 ml-2 text-xs sm:text-sm"
                              onClick={() => {
                                if (property?.agent?.user?.email) {
                                  window.location.href = `mailto:${property.agent.user.email}?subject=Inquiry about ${property.title}&body=I'm interested in this property (ID: ${property.id})`;
                                } else {
                                  alert("Agent email is not available");
                                }
                              }}
                            >
                              <Mail className="w-4 h-4 mr-1 sm:mr-2" /> Email
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <Button variant="ghost" className="text-xs sm:text-sm p-2 sm:p-3">
                            <Share2 className="w-4 h-4 mr-1 sm:mr-2" /> Share
                          </Button>
                          <Button variant="ghost" className="text-xs sm:text-sm p-2 sm:p-3">
                            <Heart className="w-4 h-4 mr-1 sm:mr-2" /> Save
                          </Button>
                          <Button variant="ghost" className="text-xs sm:text-sm p-2 sm:p-3">
                            <Printer className="w-4 h-4 mr-1 sm:mr-2" /> Print
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
                      <TabsList className="flex w-full overflow-x-auto snap-x snap-mandatory py-1 sm:grid sm:grid-cols-4">
                        <TabsTrigger value="details" className="flex-1 min-w-[100px] snap-start text-xs sm:text-sm">Details</TabsTrigger>
                        <TabsTrigger value="floorplan" className="flex-1 min-w-[100px] snap-start text-xs sm:text-sm">Floor Plan</TabsTrigger>
                        <TabsTrigger value="map" className="flex-1 min-w-[100px] snap-start text-xs sm:text-sm">Map</TabsTrigger>
                        <TabsTrigger value="3d-view" className="flex-1 min-w-[100px] snap-start text-xs sm:text-sm">3D View</TabsTrigger>
                      </TabsList>
                      <TabsContent value="details">
                        <Card>
                          <CardContent className="pt-4 sm:pt-6">
                            <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
                              <div className="md:col-span-2">
                                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Property Details</h2>
                                <p className="mb-4 text-sm sm:text-base">
                                  {property.description || "No description available."}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <h3 className="text-base sm:text-lg font-semibold">Property Type</h3>
                                    <p className="text-sm sm:text-base">{property.propertyType.name}</p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <h3 className="text-base sm:text-lg font-semibold">Listing Type</h3>
                                    <p className="text-sm sm:text-base">{property.listingType.name}</p>
                                  </div>
                                  {property.yearBuilt && (
                                      <div className="bg-gray-50 p-3 rounded-lg">
                                        <h3 className="text-base sm:text-lg font-semibold">Year Built</h3>
                                        <p className="text-sm sm:text-base">{property.yearBuilt}</p>
                                      </div>
                                  )}
                                  {property.parkingSpaces !== null && (
                                      <div className="bg-gray-50 p-3 rounded-lg">
                                        <h3 className="text-base sm:text-lg font-semibold">Parking Spaces</h3>
                                        <p className="text-sm sm:text-base">{property.parkingSpaces}</p>
                                      </div>
                                  )}
                                </div>

                                <h3 className="text-lg sm:text-xl font-semibold mb-2">Features</h3>
                                {property.features && property.features.length > 0 ? (
                                    <ul className="list-disc list-inside mb-4 grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm sm:text-base">
                                      {property.features.map((item) => (
                                          <li key={item.feature.id}>{item.feature.name}</li>
                                      ))}
                                    </ul>
                                ) : (
                                    <p className="mb-4 text-sm sm:text-base">No features listed.</p>
                                )}

                                <h3 className="text-lg sm:text-xl font-semibold mb-2">Location</h3>
                                <p className="mb-4 text-sm sm:text-base">
                                  {property.location.name}, {property.location.city}, {property.location.country}
                                </p>
                              </div>
                              <div>
                                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Contact Agent</h2>
                                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                                  {property.agent ? (
                                      <div className="flex items-center mb-4">
                                        <Image
                                            src={
                                              property.agent.user.profileImage
                                                ? (property.agent.user.profileImage.startsWith('http')
                                                    ? property.agent.user.profileImage
                                                    : `${baseUrl}${property.agent.user.profileImage}`)
                                                : "/placeholder.svg"
                                            }
                                            alt={`${property.agent.user.firstName} ${property.agent.user.lastName}`}
                                            width={48}
                                            height={48}
                                            className="rounded-full mr-3 sm:mr-4 sm:w-[64px] sm:h-[64px]"
                                        />
                                        <div>
                                          <h3 className="font-semibold text-sm sm:text-base">{property.agent.user.firstName} {property.agent.user.lastName}</h3>
                                          <p className="text-xs sm:text-sm text-muted-foreground">Real Estate Agent</p>
                                          {property.agent.user.phone && (
                                              <p className="text-xs sm:text-sm">{property.agent.user.phone}</p>
                                          )}
                                        </div>
                                      </div>
                                  ) : (
                                      <div className="flex items-center mb-4">
                                        <Image
                                            src="/placeholder.svg"
                                            alt="Agent"
                                            width={48}
                                            height={48}
                                            className="rounded-full mr-3 sm:mr-4 sm:w-[64px] sm:h-[64px]"
                                        />
                                        <div>
                                          <h3 className="font-semibold text-sm sm:text-base">Contact Us</h3>
                                          <p className="text-xs sm:text-sm text-muted-foreground">No agent assigned</p>
                                        </div>
                                      </div>
                                  )}
                                  {formSuccess && (
                                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                                      {formSuccess}
                                    </div>
                                  )}
                                  {formError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                                      {formError}
                                    </div>
                                  )}
                                  <form className="space-y-3 sm:space-y-4" onSubmit={handleContactSubmit}>
                                    <Input
                                      placeholder="Your Name"
                                      className="text-sm"
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                      required
                                    />
                                    <Input
                                      type="email"
                                      placeholder="Your Email"
                                      className="text-sm"
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      required
                                    />
                                    <Input
                                      type="tel"
                                      placeholder="Your Phone"
                                      className="text-sm"
                                      value={phone}
                                      onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <Textarea
                                      placeholder="Your Message"
                                      rows={3}
                                      className="text-sm"
                                      value={message}
                                      onChange={(e) => setMessage(e.target.value)}
                                      required
                                    />
                                    <Button
                                      type="submit"
                                      className="w-full text-sm sm:text-base"
                                      disabled={isSubmitting}
                                    >
                                      {isSubmitting ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Sending...
                                        </>
                                      ) : (
                                        "Send Message"
                                      )}
                                    </Button>
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
                                  <Image src={property.FloorPlan.startsWith('http') ? property.FloorPlan : `${baseUrl}${property.FloorPlan}`} alt="Floor Plan" fill className="object-contain" />
                              ) : property.media?.find(m => m.mediaType === "floorplan")?.filePath ? (
                                  <Image
                                    src={
                                      (() => {
                                        const filePath = property.media.find(m => m.mediaType === "floorplan")?.filePath || "";
                                        return filePath.startsWith('http') ? filePath : `${baseUrl}${filePath}`;
                                      })()
                                    }
                                    alt="Floor Plan"
                                    fill
                                    className="object-contain"
                                  />
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
                            <div className="flex justify-between items-center mb-4">
                              <h2 className="text-2xl font-bold">Location</h2>
                              <Button
                                  onClick={() => setShowDirections(!showDirections)}
                                  variant={showDirections ? "default" : "outline"}
                                  className="flex items-center"
                              >
                                <MapPin className="w-4 h-4 mr-2" />
                                {showDirections ? "Hide Directions" : "Get Directions"}
                              </Button>
                            </div>
                            {showDirections && (
                                <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm">
                                  <p>Directions will be calculated from your current location to this property.</p>
                                  <p className="mt-1 text-muted-foreground">Note: You may need to allow location access in your browser.</p>
                                </div>
                            )}
                            <div className="h-[400px]">
                              <MapWithNoSSR
                                  latitude={property.latitude}
                                  longitude={property.longitude}
                                  address={property.address}
                                  showDirections={showDirections}
                              />
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
                                      src={property.DView.startsWith('http') ? property.DView : `${baseUrl}${property.DView}`}
                                      width="100%"
                                      height="100%"
                                      frameBorder="0"
                                      allowFullScreen
                                  ></iframe>
                              ) : property.media?.find(m => m.mediaType === "3dview")?.filePath ? (
                                  <iframe
                                      src={
                                        (() => {
                                          const filePath = property.media.find(m => m.mediaType === "3dview")?.filePath || "";
                                          return filePath.startsWith('http') ? filePath : `${baseUrl}${filePath}`;
                                        })()
                                      }
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
                <section className="py-12 sm:py-16 lg:py-20 bg-gray-100">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeader title="Similar Properties" subtitle="You might also like these properties" />
                    <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                      {isSimilarLoading ? (
                          // Loading state for similar properties
                          Array(3).fill(0).map((_, index) => (
                              <div key={index} className="animate-pulse bg-white p-3 rounded-lg shadow-sm">
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
                            let primaryImage = property.media?.find(m => m.isPrimary)?.filePath ||
                                (property.media?.length ? property.media[0].filePath : "/placeholder.svg");

                            // Add baseUrl if needed
                            if (primaryImage && !primaryImage.startsWith('http') && !primaryImage.startsWith('/placeholder')) {
                              primaryImage = `${baseUrl}${primaryImage}`;
                            }

                            return (
                                <div key={property.id} className="hover:shadow-md transition-shadow duration-200 bg-white rounded-lg overflow-hidden">
                                  <PropertyCard
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
                                </div>
                            );
                          })
                      ) : (
                          // No similar properties found
                          <div className="col-span-full text-center py-8 bg-white rounded-lg shadow-sm">
                            <p className="text-muted-foreground">No similar properties found.</p>
                          </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Reviews Section */}
                <section className="py-12 sm:py-16 lg:py-20">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeader title="Property Reviews" subtitle="What our clients say about this property" />
                    <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                      {[1, 2, 3, 4].map((index) => (
                          <div key={index} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center mb-3 sm:mb-4">
                              <Image
                                src="/placeholder.svg"
                                alt="Reviewer"
                                width={40}
                                height={40}
                                className="rounded-full mr-3 sm:mr-4 sm:w-[48px] sm:h-[48px]"
                              />
                              <div>
                                <h3 className="font-semibold text-sm sm:text-base">Jane Smith</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">Tenant</p>
                              </div>
                            </div>
                            <StarRating rating={5} label="Excellent" className="mb-2" />
                            <p className="text-sm sm:text-base text-muted-foreground">
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
      </>

  )
}
