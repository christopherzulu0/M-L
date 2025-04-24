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
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import dynamic from "next/dynamic"

const MapWithNoSSR = dynamic(() => import("@/components/map"), { ssr: false })

export default function ListingSingle({ params }: { params: { id: string } }) {
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
            <h1 className="text-5xl font-bold mb-4 text-primary">Modern Apartment in Downtown</h1>
            <p className="text-xl text-muted-foreground flex items-center">
              <MapPin className="w-5 h-5 mr-2" /> 123 Main St, New York, NY 10001 (ID: {unwrappedParams.id})
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
                <Image src={activeImage || "/placeholder.svg"} alt="Property Image" fill className="object-cover" />
              </div>
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((img, index) => (
                    <CarouselItem key={index} className="basis-1/5">
                      <div className="p-1">
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`Property Image ${index + 1}`}
                          width={200}
                          height={150}
                          className="rounded-md cursor-pointer hover:opacity-75 transition-opacity"
                          onClick={() => setActiveImage(img)}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <div className="space-y-4">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-4xl font-bold mb-4 text-primary">ZMW 2,500 / month</h2>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col items-center p-3 bg-secondary rounded-lg">
                      <Bed className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">3 Beds</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-secondary rounded-lg">
                      <Bath className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">2 Baths</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-secondary rounded-lg">
                      <Square className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">1,200 sqft</span>
                    </div>
                  </div>
                  <Button className="w-full mb-4 text-lg py-6">Schedule a Tour</Button>
                  <div className="flex justify-between">
                    <Button variant="outline" className="flex-1 mr-2">
                      <Phone className="w-4 h-4 mr-2" /> Call
                    </Button>
                    <Button variant="outline" className="flex-1 ml-2">
                      <Mail className="w-4 h-4 mr-2" /> Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-between">
                <Button variant="ghost" className="text-primary hover:text-primary-foreground hover:bg-primary">
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
                <Button variant="ghost" className="text-primary hover:text-primary-foreground hover:bg-primary">
                  <Heart className="w-4 h-4 mr-2" /> Save
                </Button>
                <Button variant="ghost" className="text-primary hover:text-primary-foreground hover:bg-primary">
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
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              <p className="mb-4">
                This modern apartment in downtown offers a perfect blend of comfort and style. With 3 bedrooms and 2
                bathrooms, it's ideal for small families or professionals. The open-plan living area is flooded with
                natural light, and the kitchen is equipped with high-end appliances. Enjoy city views from the private
                balcony.
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
                Located in the heart of downtown, this apartment is within walking distance of popular restaurants,
                shops, and public transportation. Enjoy easy access to parks, museums, and entertainment venues.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Agent</h2>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <Image src="/placeholder.svg" alt="Agent" width={64} height={64} className="rounded-full mr-4" />
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
