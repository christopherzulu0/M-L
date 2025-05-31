"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bell,
  Plus,
  Menu,
  Search,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  MapPin,
  TrendingUp,
  BookOpen,
  Users,
  Heart,
  Calendar,
  Filter,
  Globe,
  Phone,
  Mail,
  Star,
  Zap,
  Calculator,
  Save,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { companyInfo, navigation } from "@/lib/config"

// Map icon strings from config to actual icon components
const getIconComponent = (iconName: string | null) => {
  if (!iconName) return null;

  const iconMap: Record<string, any> = {
    MapPin,
    TrendingUp,
    BookOpen,
    Users,
    Star,
    Calendar,
    Globe,
    Calculator,
    Zap,
    Save
  };

  return iconMap[iconName] || null;
};

// Process navigation links to convert icon strings to components
const navigationLinks = navigation.main.map(item => ({
  ...item,
  icon: getIconComponent(item.icon as string | null),
  submenu: item.submenu
    ? item.submenu.map(subItem => ({
        ...subItem,
        icon: getIconComponent(subItem.icon as string)
      }))
    : undefined
}))

const searchSuggestions = [
  { type: "location", text: "Manhattan, NY", count: "1,234 properties" },
  { type: "location", text: "Brooklyn Heights", count: "567 properties" },
  { type: "property", text: "Luxury Condos", count: "89 properties" },
  { type: "property", text: "Penthouse Apartments", count: "23 properties" },
]

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const pathname = usePathname()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  // Update favorites count from localStorage
  useEffect(() => {
    const updateFavoritesCount = () => {
      if (typeof window !== 'undefined') {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavoritesCount(favorites.length);
      }
    };

    // Update count on mount
    updateFavoritesCount();

    // Listen for storage events to update count when favorites change
    window.addEventListener('storage', updateFavoritesCount);

    // Custom event for when favorites are updated within the same window
    window.addEventListener('favoritesUpdated', updateFavoritesCount);

    return () => {
      window.removeEventListener('storage', updateFavoritesCount);
      window.removeEventListener('favoritesUpdated', updateFavoritesCount);
    };
  }, [])

  return (
      <>
        {/* Top Bar - Hidden on mobile */}
        <div className="hidden xl:block bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2 text-sm">
              <div className="flex items-center space-x-4 lg:space-x-6">
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3" />
                  <span className="hidden lg:inline">{companyInfo.phone}</span>
                  <span className="lg:hidden">Call Us</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3" />
                  <span className="hidden lg:inline">{companyInfo.email}</span>
                  <span className="lg:hidden">Email</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-slate-300 hidden lg:inline">Follow us:</span>
                <div className="flex space-x-2">
                  {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                      <Button
                          key={social}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-slate-300 hover:text-white hover:bg-white/10"
                      >
                        <Globe className="h-3 w-3" />
                      </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-500 ${
                scrolled
                    ? "backdrop-blur-2xl bg-white/90 border-b border-slate-200/60 shadow-2xl shadow-slate-900/10"
                    : "backdrop-blur-xl bg-white/80 border-b border-slate-200/40"
            }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 sm:h-20 lg:h-24 items-center justify-between gap-4">
              {/* Logo Section */}
              <Link href="/" className="group flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl lg:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl lg:rounded-2xl p-2 sm:p-2.5 lg:p-3 transition-transform duration-300 group-hover:scale-105">
                    <Image
                        src="/placeholder.svg?height=32&width=32"
                        alt="M & L Real Estate Logo"
                        fill
                        className="object-contain filter brightness-0 invert"
                    />
                  </div>
                </div>

              </Link>

              {/* Desktop Search - Hidden on mobile and tablet */}
              <div className="hidden xl:flex flex-1 max-w-xl 2xl:max-w-2xl mx-4 lg:mx-8" ref={searchRef}>
                <div className="relative w-full">
                  <div
                      className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                          isSearchOpen
                              ? "border-blue-500 shadow-2xl shadow-blue-500/20 bg-white"
                              : "border-slate-200 bg-slate-50/80 hover:border-slate-300"
                      }`}
                  >
                    <div className="flex items-center">
                      <div className="flex items-center pl-4 pr-2">
                        <Search className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                          placeholder="Search luxury properties, locations..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => setIsSearchOpen(true)}
                          className="border-0 bg-transparent text-base placeholder:text-slate-400 focus-visible:ring-0 h-12 lg:h-14"
                      />
                      <div className="flex items-center pr-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg">
                          <Filter className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>
                    </div>

                    {/* Search Dropdown */}
                    {isSearchOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/10 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                          <div className="p-4">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                              Popular Searches
                            </div>
                            <div className="space-y-2">
                              {searchSuggestions.map((suggestion, index) => (
                                  <button
                                      key={index}
                                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                        <MapPin className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                                          {suggestion.text}
                                        </div>
                                        <div className="text-sm text-slate-500">{suggestion.count}</div>
                                      </div>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-slate-400 rotate-[-90deg]" />
                                  </button>
                              ))}
                            </div>
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop Navigation - Responsive breakpoints */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navigationLinks.map((item) => (
                    <div key={item.name} className="relative">
                      {item.submenu ? (
                          <DropdownMenu onOpenChange={(open) => setActiveDropdown(open ? item.name : null)}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                  variant="ghost"
                                  className={`relative h-10 lg:h-12 px-2 lg:px-4 font-semibold transition-all duration-200 rounded-xl group text-sm lg:text-base ${
                                      pathname.startsWith(item.href)
                                          ? "text-blue-600 bg-blue-50"
                                          : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                                  } ${item.featured ? "ring-1 ring-blue-200" : ""}`}
                              >
                                <div className="flex items-center space-x-1 lg:space-x-2">
                                  {item.icon && <item.icon className="w-4 h-4" />}
                                  <span className="hidden xl:inline">{item.name}</span>
                                  <span className="xl:hidden">{item.name.split(" ")[0]}</span>
                                  <ChevronDown
                                      className={`w-3 h-3 transition-transform duration-200 ${
                                          activeDropdown === item.name ? "rotate-180" : ""
                                      }`}
                                  />
                                </div>
                                {item.featured && (
                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                className="w-64 lg:w-72 p-2 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl shadow-slate-900/10 rounded-2xl"
                            >
                              {item.submenu.map((subItem, index) => (
                                  <DropdownMenuItem key={subItem.name} asChild className="p-0">
                                    <Link
                                        href={subItem.href}
                                        className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
                                          {subItem.icon && (
                                              <subItem.icon className="h-4 w-4 text-slate-600 group-hover:text-blue-600" />
                                          )}
                                        </div>
                                        <span className="font-medium text-slate-900 group-hover:text-blue-600 text-sm lg:text-base">
                                  {subItem.name}
                                </span>
                                      </div>
                                      {subItem.badge && (
                                          <Badge
                                              variant="secondary"
                                              className={`text-xs ${
                                                  subItem.badge === "Hot" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                              }`}
                                          >
                                            {subItem.badge}
                                          </Badge>
                                      )}
                                    </Link>
                                  </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                      ) : (
                          <Link
                              href={item.href}
                              className={`relative flex items-center space-x-1 lg:space-x-2 h-10 lg:h-12 px-2 lg:px-4 font-semibold rounded-xl transition-all duration-200 group text-sm lg:text-base ${
                                  pathname === item.href
                                      ? "text-blue-600 bg-blue-50"
                                      : "text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                              }`}
                          >
                            {item.icon && <item.icon className="w-4 h-4" />}
                            <span className="hidden xl:inline">{item.name}</span>
                            <span className="xl:hidden">{item.name.split(" ")[0]}</span>
                            {pathname === item.href && (
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                            )}
                          </Link>
                      )}
                    </div>
                ))}
              </nav>

              {/* Right Actions */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Mobile/Tablet Search */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="xl:hidden h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-xl hover:bg-slate-100"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>

                {/* Favorites - Hidden on small mobile */}
                <Link href="/favorites">
                  <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-xl hover:bg-slate-100 relative group"
                  >
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 transition-colors group-hover:text-red-500" />
                    {favoritesCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 text-[10px] bg-red-500 text-white favorite-count">
                        {favoritesCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-xl hover:bg-slate-100 relative group"
                    >
                      <Bell className="h-4 w-4 sm:h-5 sm:w-5 transition-colors group-hover:text-blue-600" />
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                      align="end"
                      className="w-80 sm:w-96 p-0 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl shadow-slate-900/10 rounded-2xl overflow-hidden"
                  >
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          3 new
                        </Badge>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {[
                        {
                          title: "New luxury listing in Manhattan",
                          desc: "A stunning penthouse just hit the market",
                          time: "2 min ago",
                          type: "listing",
                        },
                        {
                          title: "Price drop alert",
                          desc: "Property on your watchlist reduced by $50K",
                          time: "1 hour ago",
                          type: "price",
                        },
                        {
                          title: "Market report available",
                          desc: "Q4 2024 Manhattan market insights",
                          time: "3 hours ago",
                          type: "report",
                        },
                      ].map((notification, index) => (
                          <div
                              key={index}
                              className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
                                      notification.type === "listing"
                                          ? "bg-green-100"
                                          : notification.type === "price"
                                              ? "bg-orange-100"
                                              : "bg-blue-100"
                                  }`}
                              >
                                {notification.type === "listing" ? (
                                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                ) : notification.type === "price" ? (
                                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                                ) : (
                                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 text-sm">{notification.title}</p>
                                <p className="text-sm text-slate-500 mt-1">{notification.desc}</p>
                                <p className="text-xs text-slate-400 mt-2">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200">
                      <Button variant="ghost" className="w-full text-blue-600 hover:bg-blue-50">
                        View all notifications
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Profile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-xl hover:bg-slate-100">
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-slate-200">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                          JD
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                      align="end"
                      className="w-64 sm:w-72 p-0 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl shadow-slate-900/10 rounded-2xl overflow-hidden"
                  >
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-white">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                            JD
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-slate-900">John Doe</p>
                          <p className="text-sm text-slate-500">Premium Member</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-slate-500">VIP Status</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      {[
                        { icon: User, label: "My Profile", href: "/profile" },
                        { icon: Heart, label: "Saved Properties", href: "/favorites", badge: "2" },
                        { icon: Calendar, label: "Appointments", href: "/appointments" },
                        { icon: Settings, label: "Settings", href: "/settings" },
                      ].map((item, index) => (
                          <DropdownMenuItem key={index} asChild className="p-0">
                            <Link
                                href={item.href}
                                className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                            >
                              <div className="flex items-center space-x-3">
                                <item.icon className="h-4 w-4 text-slate-600 group-hover:text-blue-600" />
                                <span className="font-medium text-slate-900 group-hover:text-blue-600">{item.label}</span>
                              </div>
                              {item.badge && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                    {item.badge}
                                  </Badge>
                              )}
                            </Link>
                          </DropdownMenuItem>
                      ))}
                    </div>
                    <Separator />
                    <div className="p-2">
                      <DropdownMenuItem className="p-3 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 cursor-pointer">
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* CTA Button - Responsive text */}
                <Link href="/listings/add" className="hidden sm:block">
                  <Button className="h-9 sm:h-10 lg:h-12 px-3 sm:px-4 lg:px-6 font-semibold bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 rounded-xl group text-sm lg:text-base">
                    <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:rotate-90" />
                    <span className="hidden lg:inline">List Property</span>
                    <span className="lg:hidden">List</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-xl" />
                  </Button>
                </Link>

                {/* Mobile Menu */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden h-9 w-9 sm:h-10 sm:w-10 p-0 rounded-xl hover:bg-slate-100"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
                </Button>
              </div>
            </div>

            {/* Mobile/Tablet Search Bar */}
            {isSearchOpen && (
                <div className="xl:hidden pb-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="relative">
                    <div className="flex items-center bg-white rounded-2xl border-2 border-blue-500 shadow-lg">
                      <div className="flex items-center pl-4 pr-2">
                        <Search className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                          placeholder="Search properties, locations..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="border-0 bg-transparent text-base placeholder:text-slate-400 focus-visible:ring-0 h-12"
                          autoFocus
                      />
                      <div className="flex items-center pr-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg"
                            onClick={() => setIsSearchOpen(false)}
                        >
                          <X className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
              <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white/95 backdrop-blur-2xl shadow-2xl animate-in slide-in-from-right duration-300">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-2">
                          <Image
                              src="/placeholder.svg?height=24&width=24"
                              alt="Logo"
                              width={24}
                              height={24}
                              className="filter brightness-0 invert"
                          />
                        </div>
                        <div>
                          <h2 className="font-bold text-slate-900">Menu</h2>
                          <p className="text-xs text-slate-500">Premium Experience</p>
                        </div>
                      </div>
                      <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMenuOpen(false)}
                          className="h-8 w-8 p-0 rounded-lg"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Mobile Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                          placeholder="Search properties..."
                          className="pl-10 bg-white/80 border-slate-200 rounded-xl h-12"
                      />
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-2">
                      {navigationLinks.map((item) => (
                          <div key={item.name} className="space-y-2">
                            <Link
                                href={item.href}
                                className={`flex items-center justify-between p-4 rounded-xl font-semibold transition-all duration-200 ${
                                    pathname === item.href || pathname.startsWith(item.href)
                                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-sm"
                                        : "text-slate-700 hover:bg-slate-50"
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                              <div className="flex items-center space-x-3">
                                {item.icon && <item.icon className="w-5 h-5" />}
                                <span>{item.name}</span>
                              </div>
                              {item.featured && (
                                  <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse" />
                              )}
                            </Link>
                            {item.submenu && (
                                <div className="ml-8 space-y-1">
                                  {item.submenu.map((subItem) => (
                                      <Link
                                          key={subItem.name}
                                          href={subItem.href}
                                          className="flex items-center justify-between p-3 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          onClick={() => setIsMenuOpen(false)}
                                      >
                                        <div className="flex items-center space-x-2">
                                          {subItem.icon && <subItem.icon className="w-4 h-4" />}
                                          <span>{subItem.name}</span>
                                        </div>
                                        {subItem.badge && (
                                            <Badge
                                                variant="secondary"
                                                className={`text-xs ${
                                                    subItem.badge === "Hot" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                              {subItem.badge}
                                            </Badge>
                                        )}
                                      </Link>
                                  ))}
                                </div>
                            )}
                          </div>
                      ))}
                    </div>
                  </nav>

                  {/* Mobile Actions */}
                  <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 space-y-3">
                    <Link href="/listings/add" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg">
                        <Plus className="mr-2 h-4 w-4" />
                        List Your Property
                      </Button>
                    </Link>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-10 rounded-xl border-slate-300">
                        Sign In
                      </Button>
                      <Button variant="outline" className="h-10 rounded-xl border-slate-300">
                        Register
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}
      </>
  )
}
