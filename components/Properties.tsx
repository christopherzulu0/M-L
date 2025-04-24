"use client"

import { useState } from "react"
import { PropertyCard } from "./property-card"
import Link from "next/link"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { PatternBackground } from "./ui/pattern-background"
import { cn } from "@/lib/utils"

export default function Properties() {
  const [activeTab, setActiveTab] = useState<"all" | "sale" | "rent">("all")

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
            {[
              {
                id: 1,
                image:
                  "https://images.lifestyleasia.com/wp-content/uploads/sites/3/2020/09/15155131/9th-Floor-Infinity-Pool-Aman-Nai-Lert-Bangkok-Thailand-c-Aman-Nai-Lert-Bangkok-min-scaled.jpg",
                title: "Modern Apartment with Pool View",
                address: "Minsundu RD,Ndola",
                price: "ZMW 2,500,000",
                period: "total",
                type: "Apartment",
                badges: ["Sale", "Featured"],
                features: {
                  beds: 3,
                  baths: 2,
                  sqft: 1200,
                },
              },
              {
                id: 2,
                image:
                  "https://www.conradvillas.com/uploads/properties/116/koh-samui-luxury-villas-for-sale-bangpor-89875071.jpg",
                title: "Luxury Family Villa",
                address: "45 Independence Ave, Kitwe, Zambia",
                price: "ZMW 3,200",
                period: "month",
                type: "House",
                badges: ["Rent", "New"],
                features: {
                  beds: 4,
                  baths: 3,
                  sqft: 2500,
                },
              },
              {
                id: 3,
                image:
                  "https://portablepartitions.com.au/wp-content/uploads/2022/06/Commercial-Office-Space-Design-Revolutionising-the-Workplace.jpeg",
                title: "Commercial Office Space",
                address: "78 Cairo Rd, Ndola, Zambia",
                price: "ZMW 1,800,000",
                period: "total",
                type: "Commercial",
                badges: ["Sale", "Hot Deal"],
                features: {
                  sqft: 3500,
                },
              },
            ]
              .filter((property) => {
                if (activeTab === "all") return true
                if (activeTab === "sale") return property.badges.includes("Sale")
                if (activeTab === "rent") return property.badges.includes("Rent")
                return true
              })
              .map((property) => (
                <Link key={property.id} href={`/listing-single/${property.id}`} className="block hover:no-underline">
                  <div className="transition-transform hover:scale-105">
                    <PropertyCard
                      image={property.image}
                      title={property.title}
                      address={property.address}
                      price={property.price}
                      period={property.period}
                      type={property.type}
                      badges={property.badges}
                      features={property.features}
                    />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}
