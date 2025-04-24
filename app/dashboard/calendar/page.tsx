"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Home,
  Filter,
} from "lucide-react"

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Sample data for events
  const events = [
    {
      id: 1,
      title: "Property Viewing",
      property: "Modern Apartment with Pool View",
      client: "John Smith",
      date: "2023-08-15",
      time: "10:00 AM",
      type: "viewing",
    },
    {
      id: 2,
      title: "Client Meeting",
      property: "Luxury Villa with Garden",
      client: "Lisa Wong",
      date: "2023-08-15",
      time: "2:00 PM",
      type: "meeting",
    },
    {
      id: 3,
      title: "Property Inspection",
      property: "Cozy Townhouse",
      client: "Internal",
      date: "2023-08-16",
      time: "11:30 AM",
      type: "inspection",
    },
    {
      id: 4,
      title: "Contract Signing",
      property: "Modern Apartment with Pool View",
      client: "Maria Garcia",
      date: "2023-08-18",
      time: "4:00 PM",
      type: "contract",
    },
  ]

  // Helper functions for calendar
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  // Get events for a specific day
  const getEventsForDay = (day) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth() + 1
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    return events.filter(event => event.date === dateStr)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendar</h2>
          <p className="text-sm text-muted-foreground">
            Manage your appointments and schedule
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{formatMonth(currentMonth)}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Month</DropdownMenuItem>
                <DropdownMenuItem>Week</DropdownMenuItem>
                <DropdownMenuItem>Day</DropdownMenuItem>
                <DropdownMenuItem>List</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center">
            <div className="p-2 text-sm font-medium">Sun</div>
            <div className="p-2 text-sm font-medium">Mon</div>
            <div className="p-2 text-sm font-medium">Tue</div>
            <div className="p-2 text-sm font-medium">Wed</div>
            <div className="p-2 text-sm font-medium">Thu</div>
            <div className="p-2 text-sm font-medium">Fri</div>
            <div className="p-2 text-sm font-medium">Sat</div>

            {blanks.map((blank, index) => (
              <div key={`blank-${index}`} className="aspect-square p-1"></div>
            ))}

            {days.map((day) => {
              const dayEvents = getEventsForDay(day)
              return (
                <div
                  key={`day-${day}`}
                  className="aspect-square border p-1 text-sm hover:bg-muted/50"
                >
                  <div className="flex justify-between">
                    <span>{day}</span>
                    {dayEvents.length > 0 && (
                      <Badge variant="outline" className="h-5 px-1">
                        {dayEvents.length}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`truncate rounded px-1 py-0.5 text-xs ${
                          event.type === "viewing"
                            ? "bg-blue-100 text-blue-800"
                            : event.type === "meeting"
                            ? "bg-purple-100 text-purple-800"
                            : event.type === "inspection"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-start justify-between rounded-lg border p-4">
                <div className="flex gap-4">
                  <div
                    className={`rounded-full p-2 ${
                      event.type === "viewing"
                        ? "bg-blue-100 text-blue-600"
                        : event.type === "meeting"
                        ? "bg-purple-100 text-purple-600"
                        : event.type === "inspection"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {event.type === "viewing" ? (
                      <Home className="h-5 w-5" />
                    ) : event.type === "meeting" ? (
                      <User className="h-5 w-5" />
                    ) : event.type === "inspection" ? (
                      <Home className="h-5 w-5" />
                    ) : (
                      <CalendarIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Home className="mr-1 h-3.5 w-3.5" />
                        {event.property}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-1 h-3.5 w-3.5" />
                        {event.client}
                      </div>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}