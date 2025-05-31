"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import {
  Menu,
  Home,
  Users,
  MessageSquare,
  DollarSign,
  BarChart2,
  CalendarIcon,
  CheckCircle2,
  Map,
  ChevronDown,
  ChevronRight,
  FileText,
  Bell,
  Building,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react"

interface MobileNavProps {
  unreadNotifications: number
}

export default function MobileNav({ unreadNotifications }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const [propertiesOpen, setPropertiesOpen] = useState(false)
  const [agentsOpen, setAgentsOpen] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const [usersOpen, setUsersOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Home className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg">M&L</span>
        </div>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="p-4 space-y-1">
            <Link href="/dashboard/overview" passHref onClick={() => setOpen(false)}>
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
                <Link href="/dashboard/add-listing" passHref onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Add Property
                  </Button>
                </Link>
                <Link href="/dashboard/properties" passHref onClick={() => setOpen(false)}>
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
                <Link href="/dashboard/agents-add" passHref onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Add Agent
                  </Button>
                </Link>
                <Link href="/dashboard/agents" passHref onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Manage Agents
                  </Button>
                </Link>
              </CollapsibleContent>
            </Collapsible>

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
                <Link href="/dashboard/FeaturedLocations/add" passHref onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Add Location
                  </Button>
                </Link>
                <Link href="/dashboard/FeaturedLocations" passHref onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Manage Locations
                  </Button>
                </Link>
              </CollapsibleContent>
            </Collapsible>

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
                <Link href="/dashboard/users" passHref onClick={() => setOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm">
                    Manage Users
                  </Button>
                </Link>
              </CollapsibleContent>
            </Collapsible>

            {/*<Link href="/dashboard/inquiries" passHref onClick={() => setOpen(false)}>*/}
            {/*  <Button variant="ghost" className="w-full justify-start">*/}
            {/*    <MessageSquare className="mr-2 h-4 w-4" /> Inquiries*/}
            {/*  </Button>*/}
            {/*</Link>*/}

            <Link href="/dashboard/payments" passHref onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" /> Payments
              </Button>
            </Link>

            {/*<Link href="/dashboard/analytics" passHref onClick={() => setOpen(false)}>*/}
            {/*  <Button variant="ghost" className="w-full justify-start">*/}
            {/*    <BarChart2 className="mr-2 h-4 w-4" /> Analytics*/}
            {/*  </Button>*/}
            {/*</Link>*/}

            <Link href="/dashboard/calendar" passHref onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" /> Calendar
              </Button>
            </Link>

            {/*<Link href="/dashboard/tasks" passHref onClick={() => setOpen(false)}>*/}
            {/*  <Button variant="ghost" className="w-full justify-start">*/}
            {/*    <CheckCircle2 className="mr-2 h-4 w-4" /> Tasks*/}
            {/*  </Button>*/}
            {/*</Link>*/}

            <Link href="/dashboard/documents" passHref onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" /> Documents
              </Button>
            </Link>

            <Link href="/dashboard/notifications" passHref onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start relative">
                <Bell className="mr-2 h-4 w-4" />
                <span className="flex-1 text-left">Notifications</span>
                {unreadNotifications > 0 && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                  </span>
                )}
              </Button>
            </Link>

            {/*<Link href="/dashboard/map" passHref onClick={() => setOpen(false)}>*/}
            {/*  <Button variant="ghost" className="w-full justify-start">*/}
            {/*    <Map className="mr-2 h-4 w-4" /> Map View*/}
            {/*  </Button>*/}
            {/*</Link>*/}

            {/*<div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">*/}
            {/*  <p className="mb-2 text-xs font-semibold text-muted-foreground">REPORTS</p>*/}
            {/*  <div className="space-y-1">*/}
            {/*    <Link href="/dashboard/reports/sales" passHref onClick={() => setOpen(false)}>*/}
            {/*      <Button variant="ghost" className="w-full justify-start">*/}
            {/*        <DollarSign className="mr-2 h-4 w-4" /> Sales Reports*/}
            {/*      </Button>*/}
            {/*    </Link>*/}
            {/*    <Link href="/dashboard/reports/performance" passHref onClick={() => setOpen(false)}>*/}
            {/*      <Button variant="ghost" className="w-full justify-start">*/}
            {/*        <TrendingUp className="mr-2 h-4 w-4" /> Performance*/}
            {/*      </Button>*/}
            {/*    </Link>*/}
            {/*    <Link href="/dashboard/reports/inventory" passHref onClick={() => setOpen(false)}>*/}
            {/*      <Button variant="ghost" className="w-full justify-start">*/}
            {/*        <Building className="mr-2 h-4 w-4" /> Inventory*/}
            {/*      </Button>*/}
            {/*    </Link>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/*<div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">*/}
            {/*  <div className="flex items-center gap-3 p-2">*/}
            {/*    <Avatar className="h-10 w-10">*/}
            {/*      <AvatarImage src="/placeholder.svg" />*/}
            {/*      <AvatarFallback>JD</AvatarFallback>*/}
            {/*    </Avatar>*/}
            {/*    <div>*/}
            {/*      <p className="text-sm font-medium">John Doe</p>*/}
            {/*      <p className="text-xs text-muted-foreground">john.doe@example.com</p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
