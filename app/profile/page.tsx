"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User, Mail, Phone, Calendar, Shield, Clock,
  Home, Building, Award, DollarSign, Star,
  FileText, MapPin, Briefcase, CheckCircle,
  AlertCircle, Loader2
} from "lucide-react"

interface UserData {
  id: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  profileImage: string
  role: string
  status: string
  emailVerified: boolean
  createdAt: string
  lastLogin: string | null
  isAgent: boolean
  agent: {
    id: number
    bio: string
    specialization: string
    licenseNumber: string
    commissionRate: number
    joinDate: string
    status: string
    rating: number | null
    totalSales: number
    totalListings: number
    totalRevenue: number
  } | null
  recentProperties: {
    id: number
    title: string
    address: string
    price: number
    status: string
    createdAt: string
  }[]
  recentPurchases: {
    id: number
    propertyId: number
    propertyTitle: string
    totalAmount: number
    downPayment: number
    remainingAmount: number
    status: string
    purchaseDate: string
  }[]
  recentAppointments: {
    id: number
    propertyId: number | null
    propertyTitle: string
    agentId: number | null
    agentName: string
    appointmentDate: string
    appointmentTime: string
    status: string
  }[]
  testimonials: {
    id: number
    comment: string
    rating: number
    isApproved: boolean
    createdAt: string
  }[]
}

export default function ProfilePage() {
  const { isLoaded, isSignedIn } = useUser()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/me')
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const data = await response.json()
        setUserData(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Failed to load user data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && isSignedIn) {
      fetchUserData()
    } else if (isLoaded && !isSignedIn) {
      router.push('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
      minimumFractionDigits: 2
    }).format(amount)
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-lg text-muted-foreground">Loading profile data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-lg text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-8 w-8 text-amber-500" />
          <p className="text-lg text-muted-foreground">User profile not found</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Go to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <CardContent className="pt-0 relative">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24 -mt-12 border-4 border-white shadow-lg">
                  <AvatarImage src={userData.profileImage} alt={userData.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl">
                    {userData.firstName[0]}{userData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="text-center mt-3">
                <h2 className="text-xl font-bold">{userData.fullName}</h2>
                <p className="text-muted-foreground">{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</p>

                <div className="flex justify-center mt-2 space-x-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
                  </Badge>
                  {userData.isAgent && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Briefcase className="mr-1 h-3 w-3" />
                      Agent
                    </Badge>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{userData.phone || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">{formatDate(userData.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="font-medium">{userData.lastLogin ? formatDate(userData.lastLogin) : "Never"}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-center">
                <Button variant="outline" className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {userData.isAgent && userData.agent && (
            <Card className="border-0 shadow-lg mt-6">
              <CardHeader>
                <CardTitle>Agent Information</CardTitle>
                <CardDescription>Your professional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Specialization</p>
                  <p className="font-medium">{userData.agent.specialization || "Not specified"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">License Number</p>
                  <p className="font-medium">{userData.agent.licenseNumber || "Not provided"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Commission Rate</p>
                  <p className="font-medium">{userData.agent.commissionRate}%</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Agent Since</p>
                  <p className="font-medium">{formatDate(userData.agent.joinDate)}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="ml-1 font-medium">{userData.agent.rating || "Not rated"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Account Overview</CardTitle>
                  <CardDescription>Summary of your account and recent activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {userData.isAgent && userData.agent && (
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
                        <CardContent className="p-4 text-center">
                          <Home className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                          <p className="text-2xl font-bold text-indigo-600">{userData.agent.totalListings}</p>
                          <p className="text-sm text-muted-foreground">Total Listings</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0">
                        <CardContent className="p-4 text-center">
                          <CheckCircle className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                          <p className="text-2xl font-bold text-emerald-600">{userData.agent.totalSales}</p>
                          <p className="text-sm text-muted-foreground">Properties Sold</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0">
                        <CardContent className="p-4 text-center">
                          <DollarSign className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                          <p className="text-2xl font-bold text-purple-600">{formatCurrency(Number(userData.agent.totalRevenue))}</p>
                          <p className="text-sm text-muted-foreground">Total Revenue</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>

                    {userData.recentPurchases.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-md font-medium mb-2">Recent Purchases</h4>
                        <div className="space-y-2">
                          {userData.recentPurchases.map(purchase => (
                            <div key={purchase.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{purchase.propertyTitle}</p>
                                <p className="text-sm text-muted-foreground">{formatDate(purchase.purchaseDate)}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-indigo-600">{formatCurrency(Number(purchase.totalAmount))}</p>
                                <Badge variant={purchase.status === 'completed' ? 'default' : 'outline'}>
                                  {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {userData.recentAppointments.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-md font-medium mb-2">Recent Appointments</h4>
                        <div className="space-y-2">
                          {userData.recentAppointments.map(appointment => (
                            <div key={appointment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{appointment.propertyTitle}</p>
                                <p className="text-sm text-muted-foreground">
                                  With: {appointment.agentName} • {formatDate(appointment.appointmentDate)}
                                </p>
                              </div>
                              <Badge variant={appointment.status === 'completed' ? 'default' : 'outline'}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {userData.testimonials.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium mb-2">Your Testimonials</h4>
                        <div className="space-y-2">
                          {userData.testimonials.map(testimonial => (
                            <div key={testimonial.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-start">
                                <p className="font-medium">"{testimonial.comment.substring(0, 100)}..."</p>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="ml-1">{testimonial.rating}/5</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-sm text-muted-foreground">{formatDate(testimonial.createdAt)}</p>
                                <Badge variant={testimonial.isApproved ? 'default' : 'outline'}>
                                  {testimonial.isApproved ? 'Approved' : 'Pending'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {userData.recentPurchases.length === 0 &&
                     userData.recentAppointments.length === 0 &&
                     userData.testimonials.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No recent activity found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>My Properties</CardTitle>
                  <CardDescription>Properties you own or have listed</CardDescription>
                </CardHeader>
                <CardContent>
                  {userData.recentProperties.length > 0 ? (
                    <div className="space-y-4">
                      {userData.recentProperties.map(property => (
                        <div key={property.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{property.title}</p>
                            <p className="text-sm text-muted-foreground">{property.address}</p>
                            <p className="text-xs text-muted-foreground mt-1">Listed on {formatDate(property.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-indigo-600">{formatCurrency(Number(property.price))}</p>
                            <Badge variant={property.status === 'published' ? 'default' : 'outline'}>
                              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-center mt-4">
                        <Button variant="outline">View All Properties</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">You don't have any properties yet</p>
                      <Button className="mt-4">
                        List a Property
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                  <CardDescription>Your recent actions and transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="purchases">
                    <TabsList className="w-full">
                      <TabsTrigger value="purchases">Purchases</TabsTrigger>
                      <TabsTrigger value="appointments">Appointments</TabsTrigger>
                      <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                    </TabsList>

                    <TabsContent value="purchases" className="mt-4">
                      {userData.recentPurchases.length > 0 ? (
                        <div className="space-y-4">
                          {userData.recentPurchases.map(purchase => (
                            <div key={purchase.id} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{purchase.propertyTitle}</p>
                                  <p className="text-sm text-muted-foreground">Purchased on {formatDate(purchase.purchaseDate)}</p>
                                </div>
                                <Badge variant={purchase.status === 'completed' ? 'default' : 'outline'}>
                                  {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-3 gap-4 mt-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Total Amount</p>
                                  <p className="font-medium">{formatCurrency(Number(purchase.totalAmount))}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Down Payment</p>
                                  <p className="font-medium">{formatCurrency(Number(purchase.downPayment))}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Remaining</p>
                                  <p className="font-medium">{formatCurrency(Number(purchase.remainingAmount))}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No purchases found</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="appointments" className="mt-4">
                      {userData.recentAppointments.length > 0 ? (
                        <div className="space-y-4">
                          {userData.recentAppointments.map(appointment => (
                            <div key={appointment.id} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{appointment.propertyTitle}</p>
                                  <p className="text-sm text-muted-foreground">
                                    With: {appointment.agentName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(appointment.appointmentDate)} at {new Date(appointment.appointmentTime).toLocaleTimeString()}
                                  </p>
                                </div>
                                <Badge variant={appointment.status === 'completed' ? 'default' : 'outline'}>
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No appointments found</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="testimonials" className="mt-4">
                      {userData.testimonials.length > 0 ? (
                        <div className="space-y-4">
                          {userData.testimonials.map(testimonial => (
                            <div key={testimonial.id} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start gap-2">
                                  <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                  <div>
                                    <p className="font-medium">{testimonial.comment}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Submitted on {formatDate(testimonial.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant={testimonial.isApproved ? 'default' : 'outline'}>
                                  {testimonial.isApproved ? 'Approved' : 'Pending'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No testimonials found</p>
                          <Button className="mt-4">
                            Write a Testimonial
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
