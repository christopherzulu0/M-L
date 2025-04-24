import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/bg.jpg"
          alt="Modern interior with plants"
          width={1920}
          height={1080}
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-900/50" />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="animate-fade-down max-w-3xl">
          <p className="mb-4 inline-block rounded-full bg-blue-600/10 px-4 py-1.5 text-sm font-medium text-blue-200">
            Real Estate Searching Platform
          </p>
          <h1 className="mb-8 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Find The House of Your Dream Using Our Platform
          </h1>
        </div>

        <div className="animate-fade-up">
          <div className="rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-sm md:p-6">
            <form className="grid gap-4 md:grid-cols-[1fr_200px_200px_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input placeholder="What are you looking for?" className="h-12 pl-10" />
              </div>
              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="la">Los Angeles</SelectItem>
                  <SelectItem value="ch">Chicago</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="lg"
                className="h-12 w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 transition-all hover:from-blue-700 hover:to-blue-800"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
            <div className="mt-4">
              <Button variant="link" className="h-auto p-0 text-sm text-blue-600 hover:text-blue-700">
                Advanced Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
