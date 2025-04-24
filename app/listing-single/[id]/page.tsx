"use client"

import React, { useState } from "react"
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

export default function ListingSingle({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params)
  const [activeImage, setActiveImage] = useState("/placeholder.svg")

  const images = [
    "/placeholder.svg",
    "/placeholder.svg?text=Living+Room",
    "/placeholder.svg?text=Kitchen",
    "/placeholder.svg?text=Bedroom",
    "/placeholder.svg?text=Bathroom",
  ]

  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20">
        <PatternBackground />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Modern Apartment in Downtown (ID: {unwrappedParams.id})</h1>
            <p className="text-xl text-muted-foreground flex items-center">
              <MapPin className="w-5 h-5 mr-2" /> 123 Main St, New York, NY 10001
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
                <h2 className="text-3xl font-bold mb-4">ZMW 2,500 / month</h2>
                <div className="flex justify-between mb-4">
                  <div className="flex items-center">
                    <Bed className="w-5 h-5 mr-2" />
                    <span>3 Bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-5 h-5 mr-2" />
                    <span>2 Bathrooms</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-5 h-5 mr-2" />
                    <span>1,200 sqft</span>
                  </div>
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
                        This modern apartment in downtown offers a perfect blend of comfort and style. With 3 bedrooms
                        and 2 bathrooms, it's ideal for small families or professionals. The open-plan living area is
                        flooded with natural light, and the kitchen is equipped with high-end appliances. Enjoy city
                        views from the private balcony.
                      </p>
                      <h3 className="text-xl font-semibold mb-2">Features</h3>
                      <ul className="list-disc list-inside mb-4">
                        <li>Central air conditioning</li>
                        <li>In-unit laundry</li>
                        <li>Hardwood floors</li>
                        <li>Stainless steel appliances</li>
                        <li>Walk-in closets</li>
                        <li>Fitness center access</li>
                      </ul>
                      <h3 className="text-xl font-semibold mb-2">Location</h3>
                      <p className="mb-4">
                        Located in the heart of downtown, this apartment is within walking distance of popular
                        restaurants, shops, and public transportation. Enjoy easy access to parks, museums, and
                        entertainment venues.
                      </p>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Contact Agent</h2>
                      <div className="bg-white rounded-lg p-6 shadow-md">
                        <div className="flex items-center mb-4">
                          <Image
                            src="/placeholder.svg"
                            alt="Agent"
                            width={64}
                            height={64}
                            className="rounded-full mr-4"
                          />
                          <div>
                            <h3 className="font-semibold">John Doe</h3>
                            <p className="text-sm text-muted-foreground">Real Estate Agent</p>
                          </div>
                        </div>
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
                    <Image src="/placeholder.svg?text=Floor+Plan" alt="Floor Plan" fill className="object-contain" />
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
                    <iframe
                      src="https://my.matterport.com/show/?m=SxQL3iGyoDo"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
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
            {[1, 2, 3].map((item) => (
              <PropertyCard
                key={item}
                image="/placeholder.svg"
                title="Cozy Studio Apartment"
                address="456 Elm St, New York, NY 10002"
                price="ZMW 1,800"
                period="month"
                type="Apartment"
                badges={["Rent", "Studio"]}
              />
            ))}
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
    </main>
  )
}
