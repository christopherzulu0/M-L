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
import { TestimonialsDisplay } from "@/components/testimonials-display"
import FeaturedLocations from "@/components/FeaturedLocations"
import Properties from "@/components/Properties"
import Blog from "@/components/Blog"

interface Agent {
  id: number
  name: string
  agency: string
  image: string
  listings: number
  rating: number
  ratingLabel: string
  verified: boolean
  bio: string
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const slidesPerView = 3
  const totalSlides = Math.ceil(agents.length / slidesPerView)

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/agent')
        if (!response.ok) {
          throw new Error('Failed to fetch agents')
        }
        const data = await response.json()
        setAgents(data)
      } catch (error) {
        console.error('Error fetching agents:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgents()
  }, [])

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

  // Calculate visible agents based on current slide
  const visibleAgents = agents.slice(currentSlide * slidesPerView, currentSlide * slidesPerView + slidesPerView)

  return (
    <main className="bg-gray-50 ">
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

          <TestimonialsDisplay />
        </div>
      </section>

      {/* Agents Section */}
      <section className="relative py-16 bg-gray-50/50">
        <PatternBackground />
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader title="Meet Our Top Agents" subtitle="Expert professionals to help you find your dream home" />

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No agents found. Please check back later.</p>
            </div>
          ) : (
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
                disabled={currentSlide === 0 || totalSlides <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="grid gap-8 md:grid-cols-3">
                {visibleAgents.map((agent, index) => (
                  <AgentCard key={`agent-${agent.id}-${index}`} {...agent} bio={agent.bio} />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="absolute -right-4 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white shadow-md hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1 || totalSlides <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Slide indicators */}
              {totalSlides > 1 && (
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
              )}
            </div>
          )}
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
