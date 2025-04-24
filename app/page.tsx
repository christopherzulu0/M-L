"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Key,
  Users,
  Building,
  HomeIcon,
  DollarSign,
  Award,
  CheckCircle,
  Clock,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { StarRating } from "@/components/star-rating"
import { HeroSection } from "@/components/hero-section"
import { SectionHeader } from "@/components/ui/section-header"
import { PatternBackground } from "@/components/ui/pattern-background"
import { PropertyComparison } from "@/components/property-comparison"
import { MortgageCalculator } from "@/components/mortgage-calculator"
import { AgentCard } from "@/components/agent-card"
import FeaturedLocations from "@/components/FeaturedLocations"
import Properties from "@/components/Properties"
import Blog from "@/components/Blog"

const agents = [
  {
    name: "Anna Lips",
    agency: "CondorHome RealEstate agency",
    image:
      "data:image/jpeg;base64,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",
    listings: 4,
    rating: 5,
    ratingLabel: "Excellent",
    verified: true,
    bio: "Specializing in luxury properties with over 10 years of experience in the real estate market.",
  },
  {
    name: "Jane Kobart",
    agency: "Mavers RealEstate agency",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr9XNnzg8MCVrzATMDGtTquKJqlk-eAJxqzw&s",
    listings: 6,
    rating: 3,
    ratingLabel: "Average",
    verified: false,
    bio: "Passionate about helping first-time homebuyers find their perfect starter home.",
  },
  {
    name: "Bill Trust",
    agency: "Your Sweet Home agency",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO2WDbm7iRz66qlVJndq24O9wGt9EMEs48XQ&s",
    listings: 23,
    rating: 5,
    ratingLabel: "Excellent",
    verified: true,
    bio: "Commercial property expert with a strong track record in office and retail spaces.",
  },
  {
    name: "Sarah Johnson",
    agency: "Prime Properties",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0gg1sFdX7CPGbOVyA1wTOut60wHzy5W82Hw&s",
    listings: 15,
    rating: 4,
    ratingLabel: "Very Good",
    verified: true,
    bio: "Residential property specialist focusing on family homes and luxury apartments.",
  },
  {
    name: "Michael Chen",
    agency: "Global Realty",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCrRMzCW4b_nJhIhHcWm-VR4prHCmIrlX6Bw&s",
    listings: 19,
    rating: 5,
    ratingLabel: "Excellent",
    verified: true,
    bio: "Investment property expert helping clients build their real estate portfolios.",
  },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const slidesPerView = 3
  const totalSlides = Math.ceil(agents.length / slidesPerView)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  // Auto-play functionality
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isAutoPlaying) {
      intervalId = setInterval(() => {
        nextSlide()
      }, 7000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isAutoPlaying, nextSlide])

  const visibleAgents = agents.slice(currentSlide * slidesPerView, currentSlide * slidesPerView + slidesPerView)

  return (
    <main className="bg-gray-50">
      <HeroSection />
      <FeaturedLocations />
      <Properties />

      {/* Property Tools Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Property Tools" subtitle="Compare properties and calculate mortgages" />
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="col-span-1">
              <PropertyComparison />
            </div>
            <div className="col-span-1">
              <MortgageCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="How It Works" subtitle="Find your dream home in 3 easy steps" />
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Search Property",
                description: "Browse through our extensive collection of properties",
              },
              {
                icon: Users,
                title: "Meet Agent",
                description: "Connect with our experienced real estate agents",
              },
              {
                icon: Key,
                title: "Get Your Key",
                description: "Close the deal and move into your dream home",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full gradient-bg">
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="gradient-bg py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: HomeIcon, number: "15K+", label: "Properties" },
              { icon: Users, number: "10K+", label: "Happy Clients" },
              { icon: Building, number: "100+", label: "Cities" },
              { icon: DollarSign, number: "$500M+", label: "Total Sales" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                  <stat.icon className="h-10 w-10" />
                </div>
                <div className="text-4xl font-bold">{stat.number}</div>
                <div className="mt-2 text-lg text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="What Our Clients Say" subtitle="Trusted by thousands of happy customers" />

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="rounded-2xl bg-white p-8 card-shadow subtle-border">
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-200">
                    <Image
                      src="/placeholder.svg"
                      alt="Client"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Client Name</h4>
                    <p className="text-sm text-muted-foreground">Property Buyer</p>
                  </div>
                </div>
                <p className="mb-6 text-muted-foreground">
                  "Amazing experience working with this team. They helped me find my dream home within my budget. Highly
                  recommended!"
                </p>
                <StarRating rating={5} label="Excellent" className="text-yellow-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section className="relative py-16 bg-gray-50/50">
        <PatternBackground />
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader title="Meet Our Top Agents" subtitle="Expert professionals to help you find your dream home" />

          <div
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white shadow-md hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="grid gap-8 md:grid-cols-3">
              {visibleAgents.map((agent, index) => (
                <AgentCard key={currentSlide * slidesPerView + index} {...agent} bio={agent.bio} />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute -right-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white shadow-md hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Slide indicators */}
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    currentSlide === index ? "bg-blue-600 w-4" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Choose Our Property Platform"
            subtitle="Discover the advantages of working with us"
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ThumbsUp,
                title: "Trusted by Thousands",
                description: "Join our community of satisfied homeowners and investors.",
              },
              {
                icon: Award,
                title: "Award-Winning Service",
                description: "Recognized for excellence in real estate services.",
              },
              {
                icon: CheckCircle,
                title: "Verified Listings",
                description: "All our properties are thoroughly vetted for your peace of mind.",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Our team is always available to assist you with any queries.",
              },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center group hover-lift">
                <div className="mb-6 rounded-full p-4 text-white bg-blue-600 group-hover:bg-blue-700 transition-colors">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Blog />
      {/* Newsletter Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-8 shadow-2xl md:p-12">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold sm:text-4xl">Subscribe to Our Newsletter</h2>
              <p className="text-lg text-muted-foreground">
                Get the latest updates on new properties and real estate tips
              </p>
            </div>
            <form className="mx-auto flex max-w-xl flex-col gap-4 sm:flex-row">
              <Input type="email" placeholder="Enter your email" className="h-12 flex-grow" />
              <Button size="lg" className="h-12 gradient-bg text-white transition-all hover:brightness-110">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
