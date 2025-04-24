"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Home,
} from "lucide-react"

export default function InquiriesPage() {
  const [inquiryView, setInquiryView] = useState("all")

  // Sample data for inquiries
  const inquiries = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+260 97 1234567",
      property: "Modern Apartment with Pool View",
      date: "2023-08-15",
      status: "New",
      message: "I'm interested in scheduling a viewing for this property. Is it available this weekend?",
      assignedTo: "Sarah Johnson",
    },
    {
      id: 2,
      name: "Lisa Wong",
      email: "lisa.wong@example.com",
      phone: "+260 97 7654321",
      property: "Luxury Villa with Garden",
      date: "2023-08-14",
      status: "Contacted",
      message: "I'd like to know more about the financing options for this property.",
      assignedTo: "Michael Chen",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "+260 97 2468135",
      property: "Cozy Townhouse",
      date: "2023-08-12",
      status: "Viewing Scheduled",
      message: "Looking forward to our appointment on Saturday at 2 PM.",
      assignedTo: "Emily Rodriguez",
    },
    {
      id: 4,
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "+260 97 3698521",
      property: "Modern Apartment with Pool View",
      date: "2023-08-10",
      status: "Closed",
      message: "Thank you for your help, but I've decided to go with another property.",
      assignedTo: "Sarah Johnson",
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inquiries</h2>
          <p className="text-sm text-muted-foreground">
            Manage customer inquiries and leads
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Inquiry
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inquiries..." className="pl-8" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ChevronDown className="mr-2 h-4 w-4" />
              Assigned To
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>All Agents</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sarah Johnson</DropdownMenuItem>
            <DropdownMenuItem>Michael Chen</DropdownMenuItem>
            <DropdownMenuItem>Emily Rodriguez</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs value={inquiryView} onValueChange={setInquiryView} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="viewing">Viewing</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>
            {inquiryView === "all"
              ? "All Inquiries"
              : inquiryView === "new"
              ? "New Inquiries"
              : inquiryView === "contacted"
              ? "Contacted Inquiries"
              : inquiryView === "viewing"
              ? "Scheduled Viewings"
              : "Closed Inquiries"}
          </CardTitle>
          <CardDescription>
            {inquiryView === "all"
              ? "Manage all customer inquiries"
              : inquiryView === "new"
              ? "Respond to new customer inquiries"
              : inquiryView === "contacted"
              ? "Follow up with contacted customers"
              : inquiryView === "viewing"
              ? "Manage scheduled property viewings"
              : "Review closed inquiries"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries
                .filter((inquiry) => {
                  if (inquiryView === "all") return true
                  if (inquiryView === "new") return inquiry.status === "New"
                  if (inquiryView === "contacted") return inquiry.status === "Contacted"
                  if (inquiryView === "viewing") return inquiry.status === "Viewing Scheduled"
                  if (inquiryView === "closed") return inquiry.status === "Closed"
                  return true
                })
                .map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{inquiry.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{inquiry.name}</p>
                          <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{inquiry.property}</TableCell>
                    <TableCell>{inquiry.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          inquiry.status === "New"
                            ? "default"
                            : inquiry.status === "Contacted"
                            ? "secondary"
                            : inquiry.status === "Viewing Scheduled"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{inquiry.assignedTo.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{inquiry.assignedTo}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Schedule Viewing</DropdownMenuItem>
                            <DropdownMenuItem>Reassign</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Mark as Closed</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}