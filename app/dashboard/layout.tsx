"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Home,
  Search,
  Users,
  Bell,
  CalendarIcon,
  CheckCircle2,
  Settings,
  HelpCircle,
  LogOut,
  User,
  BarChart2,
  Map,
  Menu,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Building,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  FileText,
  Sun,
  Moon,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"
import MobileNav from "./components/MobileNav"
import AdminGuard from "./admin-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [progress, setProgress] = useState(13)
  const [propertiesOpen, setPropertiesOpen] = useState(false)
  const [agentsOpen, setAgentsOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [usersOpen, setUsersOpen] = useState(false)
  const [blogOpen, setBlogOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const { theme, setTheme } = useTheme()

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  // Simulate loading progress
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    const timer2 = setTimeout(() => setProgress(100), 1000)
    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
    }
  }, [])

  // Fetch unread notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await fetch('/api/notifications?unread=true')
        if (response.ok) {
          const data = await response.json()
          setUnreadNotifications(data.unreadCount)
        }
      } catch (error) {
        console.error('Error fetching notification count:', error)
      }
    }

    fetchNotificationCount()

    // Refresh notification count every 5 minutes
    const interval = setInterval(fetchNotificationCount, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex  items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <MobileNav unreadNotifications={unreadNotifications} />
              {/*<div className="hidden md:flex items-center gap-2">*/}
              {/*  <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">*/}
              {/*    <Home className="h-4 w-4 text-white" />*/}
              {/*  </div>*/}
              {/*  <span className="font-bold text-lg">M&L</span>*/}
              {/*</div>*/}
              {/*<div className="relative hidden md:flex items-center">*/}
              {/*  <Search className="absolute left-3 h-4 w-4 text-gray-400" />*/}
              {/*  <Input*/}
              {/*    type="text"*/}
              {/*    placeholder="Search properties, agents..."*/}
              {/*    className="pl-9 pr-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-indigo-500 w-64"*/}
              {/*  />*/}
              {/*</div>*/}
            </div>
            {/*<nav className="hidden md:flex items-center gap-1">*/}
            {/*  <Link href="/dashboard">*/}
            {/*    <Button variant="ghost" className="text-indigo-600 font-medium">*/}
            {/*      Dashboard*/}
            {/*    </Button>*/}
            {/*  </Link>*/}
            {/*  <Link href="/properties">*/}
            {/*    <Button variant="ghost">Properties</Button>*/}
            {/*  </Link>*/}
            {/*  <Link href="/agents">*/}
            {/*    <Button variant="ghost">Agents</Button>*/}
            {/*  </Link>*/}
            {/*  <Link href="/clients">*/}
            {/*    <Button variant="ghost">Clients</Button>*/}
            {/*  </Link>*/}
            {/*  <Link href="/reports">*/}
            {/*    <Button variant="ghost">Reports</Button>*/}
            {/*  </Link>*/}
            {/*</nav>*/}
            {/*<div className="flex items-center gap-3">*/}
            {/*  <Button*/}
            {/*    variant="ghost"*/}
            {/*    size="icon"*/}
            {/*    onClick={toggleTheme}*/}
            {/*    className="relative"*/}
            {/*    aria-label="Toggle theme"*/}
            {/*  >*/}
            {/*    {theme === 'dark' ? (*/}
            {/*      <Sun className="h-5 w-5" />*/}
            {/*    ) : (*/}
            {/*      <Moon className="h-5 w-5" />*/}
            {/*    )}*/}
            {/*  </Button>*/}
            {/*  <Link href="/dashboard/notifications">*/}
            {/*    <Button variant="ghost" size="icon" className="relative">*/}
            {/*      <Bell className="h-5 w-5" />*/}
            {/*      {unreadNotifications > 0 && (*/}
            {/*        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">*/}
            {/*          {unreadNotifications > 99 ? '99+' : unreadNotifications}*/}
            {/*        </span>*/}
            {/*      )}*/}
            {/*    </Button>*/}
            {/*  </Link>*/}
            {/*  <DropdownMenu>*/}
            {/*    <DropdownMenuTrigger asChild>*/}
            {/*      <Button variant="ghost" size="icon" className="rounded-full">*/}
            {/*        <Avatar className="h-8 w-8 border-2 border-white shadow-sm">*/}
            {/*          <AvatarImage src="/placeholder.svg" />*/}
            {/*          <AvatarFallback>JD</AvatarFallback>*/}
            {/*        </Avatar>*/}
            {/*      </Button>*/}
            {/*    </DropdownMenuTrigger>*/}
            {/*    <DropdownMenuContent align="end" className="w-56">*/}
            {/*      <div className="flex items-center justify-start gap-2 p-2">*/}
            {/*        <div className="flex flex-col space-y-0.5">*/}
            {/*          <p className="text-sm font-medium">John Doe</p>*/}
            {/*          <p className="text-xs text-muted-foreground">john.doe@example.com</p>*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*      <DropdownMenuSeparator />*/}
            {/*      <DropdownMenuItem>*/}
            {/*        <User className="mr-2 h-4 w-4" />*/}
            {/*        Profile*/}
            {/*      </DropdownMenuItem>*/}
            {/*      <DropdownMenuItem>*/}
            {/*        <Settings className="mr-2 h-4 w-4" />*/}
            {/*        Settings*/}
            {/*      </DropdownMenuItem>*/}
            {/*      <DropdownMenuSeparator />*/}
            {/*      <DropdownMenuItem>*/}
            {/*        <HelpCircle className="mr-2 h-4 w-4" />*/}
            {/*        Help*/}
            {/*      </DropdownMenuItem>*/}
            {/*      <DropdownMenuSeparator />*/}
            {/*      <DropdownMenuItem>*/}
            {/*        <LogOut className="mr-2 h-4 w-4" />*/}
            {/*        Logout*/}
            {/*      </DropdownMenuItem>*/}
            {/*    </DropdownMenuContent>*/}
            {/*  </DropdownMenu>*/}
            {/*</div>*/}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 md:block">
          <div className="flex h-full flex-col">
            <div className="p-4">
              {/*<div className="mb-8 flex items-center justify-center">*/}
              {/*  <div className="h-12 w-12 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">*/}
              {/*    <Home className="h-6 w-6 text-white" />*/}
              {/*  </div>*/}
              {/*  <span className="ml-2 font-bold text-xl">EstateHub</span>*/}
              {/*</div>*/}
              <nav className="space-y-1">
                <Link href="/dashboard/overview" passHref>
                  <Button
                    variant="ghost"
                    className="w-full justify-start bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </Button>
                </Link>
                <Collapsible
                  className="w-full"
                  open={propertiesOpen}
                  onOpenChange={setPropertiesOpen}
                >
                  <CollapsibleTrigger asChild className="w-full">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="mr-2 h-4 w-4" /> Properties
                      {propertiesOpen ? (
                        <ChevronDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 mt-1 space-y-1">
                    <Link href="/dashboard/add-listing" passHref>
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        Add Property
                      </Button>
                    </Link>
                    <Link href="/dashboard/properties" passHref>
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        Manage Properties
                      </Button>
                    </Link>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible
                  className="w-full"
                  open={agentsOpen}
                  onOpenChange={setAgentsOpen}
                >
                  <CollapsibleTrigger asChild className="w-full">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" /> Agents
                      {agentsOpen ? (
                        <ChevronDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 mt-1 space-y-1">
                    <Link href="/dashboard/agents-add" passHref>
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        Add Agent
                      </Button>
                    </Link>
                    <Link href="/dashboard/agents" passHref>
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        Manage Agents
                      </Button>
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                {/** Start of Location */}
                <Collapsible
                    className="w-full"
                    open={locationOpen}
                    onOpenChange={setLocationOpen}
                >
                  <CollapsibleTrigger asChild className="w-full">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" /> Locations
                      {locationOpen ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                      ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 mt-1 space-y-1">
                    <Link href="/dashboard/FeaturedLocations/add" passHref>
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        Add Location
                      </Button>
                    </Link>
                    <Link href="/dashboard/FeaturedLocations" passHref>
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        Manage Locations
                      </Button>
                    </Link>
                  </CollapsibleContent>
                </Collapsible>
                {/** End of Location*/}

                <Collapsible
                  className="w-full"
                  open={usersOpen}
                  onOpenChange={setUsersOpen}
                >
                  <CollapsibleTrigger asChild className="w-full">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" /> Users
                      {usersOpen ? (
                        <ChevronDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 mt-1 space-y-1">
                    <Link href="/dashboard/users" passHref>
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        Manage Users
                      </Button>
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible
                  className="w-full"
                  open={blogOpen}
                  onOpenChange={setBlogOpen}
                >
                  <CollapsibleTrigger asChild className="w-full">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" /> Blog
                      {blogOpen ? (
                        <ChevronDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 mt-1 space-y-1">
                    <Link href="/dashboard/blog/add" passHref>
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        Add Post
                      </Button>
                    </Link>
                    <Link href="/dashboard/blog" passHref>
                      <Button variant="ghost" className="w-full justify-start text-sm">
                        Manage Posts
                      </Button>
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                {/*<Link href="/dashboard/inquiries" passHref>*/}
                {/*  <Button variant="ghost" className="w-full justify-start">*/}
                {/*    <MessageSquare className="mr-2 h-4 w-4" /> Inquiries*/}
                {/*  </Button>*/}
                {/*</Link>*/}
                <Link href="/dashboard/payments" passHref>
                  <Button variant="ghost" className="w-full justify-start">
                    <DollarSign className="mr-2 h-4 w-4" /> Payments
                  </Button>
                </Link>
                {/*<Link href="/dashboard/analytics" passHref>*/}
                {/*  <Button variant="ghost" className="w-full justify-start">*/}
                {/*    <BarChart2 className="mr-2 h-4 w-4" /> Analytics*/}
                {/*  </Button>*/}
                {/*</Link>*/}
                {/*<Link href="/dashboard/calendar" passHref>*/}
                {/*  <Button variant="ghost" className="w-full justify-start">*/}
                {/*    <CalendarIcon className="mr-2 h-4 w-4" /> Calendar*/}
                {/*  </Button>*/}
                {/*</Link>*/}
                {/*<Link href="/dashboard/tasks" passHref>*/}
                {/*  <Button variant="ghost" className="w-full justify-start">*/}
                {/*    <CheckCircle2 className="mr-2 h-4 w-4" /> Tasks*/}
                {/*  </Button>*/}
                {/*</Link>*/}

                {/*<Link href="/dashboard/documents" passHref>*/}
                {/*  <Button variant="ghost" className="w-full justify-start">*/}
                {/*    <FileText className="mr-2 h-4 w-4" /> Documents*/}
                {/*  </Button>*/}
                {/*</Link>*/}

                <Link href="/dashboard/notifications" passHref>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    <span className="flex-1 text-left">Notifications</span>
                    {unreadNotifications > 0 && (
                      <Badge className="ml-auto bg-red-500 text-white hover:bg-red-600">
                        {unreadNotifications > 99 ? '99+' : unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/*<Link href="/dashboard/map" passHref>*/}
                {/*  <Button variant="ghost" className="w-full justify-start">*/}
                {/*    <Map className="mr-2 h-4 w-4" /> Map View*/}
                {/*  </Button>*/}
                {/*</Link>*/}
              </nav>

              {/*<div className="mt-8">*/}
              {/*  <p className="mb-2 text-xs font-semibold text-muted-foreground">REPORTS</p>*/}
              {/*  <nav className="space-y-1">*/}
              {/*    <Link href="/dashboard/reports/sales" passHref>*/}
              {/*      <Button variant="ghost" className="w-full justify-start">*/}
              {/*        <DollarSign className="mr-2 h-4 w-4" /> Sales Reports*/}
              {/*      </Button>*/}
              {/*    </Link>*/}
              {/*    <Link href="/dashboard/reports/performance" passHref>*/}
              {/*      <Button variant="ghost" className="w-full justify-start">*/}
              {/*        <TrendingUp className="mr-2 h-4 w-4" /> Performance*/}
              {/*      </Button>*/}
              {/*    </Link>*/}
              {/*    <Link href="/dashboard/reports/inventory" passHref>*/}
              {/*      <Button variant="ghost" className="w-full justify-start">*/}
              {/*        <Building className="mr-2 h-4 w-4" /> Inventory*/}
              {/*      </Button>*/}
              {/*    </Link>*/}
              {/*  </nav>*/}
              {/*</div>*/}
            </div>
            {/*<div className="mt-auto p-4">*/}
            {/*  <Card className="border-0 shadow-md overflow-hidden">*/}
            {/*    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">*/}
            {/*      <p className="font-medium">Premium Plan</p>*/}
            {/*      <p className="text-xs text-indigo-100">Upgrade to unlock all features</p>*/}
            {/*    </div>*/}
            {/*    <CardContent className="p-4">*/}
            {/*      <Progress value={progress} className="h-2 mb-2" />*/}
            {/*      <div className="flex justify-between text-xs">*/}
            {/*        <span>{progress}% completed</span>*/}
            {/*        <span className="text-indigo-600 font-medium">Upgrade</span>*/}
            {/*      </div>*/}
            {/*    </CardContent>*/}
            {/*  </Card>*/}
            {/*</div>*/}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
