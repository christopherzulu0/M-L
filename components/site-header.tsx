"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Plus, Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

const navigationLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Listings",
    href: "/Listings",
  },
  {
    name: "Agents",
    href: "/Agents",
  },
  {
    name: "News",
    href: "/Blog",
  },
  {
    name: "Market Trends",
    href: "/market-trends",
  },
  {
    name: "Buyers Guide",
    href: "/buyers-guide",
  },
]

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <div className="glass-effect border-b">
          <div className="mx-auto flex h-28 max-w-6xl items-center justify-between gap-4 px-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-40 h-40">
                <Image src="/logo.png" alt="M & L Real Estate Logo" fill className="object-contain" priority />
              </div>
              {/* <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              M & L Real Estate Limited
            </span> */}
            </Link>

            <div className="flex flex-1 items-center justify-end gap-4">
              <nav
                className={`${isMenuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-16 flex-col items-center gap-4 bg-white p-4 shadow-lg md:static md:flex md:flex-row md:bg-transparent md:p-0 md:shadow-none`}
              >
                {navigationLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative font-medium transition-colors hover:text-blue-600 ${
                      pathname === item.href
                        ? "text-blue-600 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-blue-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white">
                    3
                  </span>
                </Button>
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="hidden font-medium shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600 md:inline-flex"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/listings/add">
                  <Button className="hidden group font-medium shadow-md transition-all hover:bg-blue-700 md:inline-flex">
                    <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" /> Add Listing
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
