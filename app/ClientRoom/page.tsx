"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UserGuard from './user-guard'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Home, DollarSign, Calendar, CheckCircle2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Property {
  id: number
  title: string
  address: string
  price: number
  status: string
  listingType: {
    name: string
  }
  propertyType: {
    name: string
  }
  location: {
    name: string
    city: string
  }
  media: {
    filePath: string
    isPrimary: boolean
  }[]
}

interface Purchase {
  id: number
  propertyId: number
  totalAmount: number
  downPayment: number
  remainingAmount: number
  status: string
  purchaseDate: string
  property: Property
  payments: Payment[]
}

interface Payment {
  id: number
  purchaseId: number
  amount: number
  paymentMethod: string
  paymentDate: string
  status: string
}

export default function ClientRoom() {
  return (
    <UserGuard>
      <ClientRoomContent />
    </UserGuard>
  );
}

function ClientRoomContent() {
  const [properties, setProperties] = useState<Property[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [downPayment, setDownPayment] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("bank_transfer")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Fetch available properties
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties')
        if (!response.ok) {
          throw new Error('Failed to fetch properties')
        }
        const data = await response.json()
        console.log('API Response:', data)
        if (data.properties && Array.isArray(data.properties)) {
          console.log('Properties found:', data.properties.length)
          setProperties(data.properties)
          console.log('Properties set to:', data.properties)
        } else {
          console.error('Expected properties array in response but got:', data)
          setProperties([])
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
        setProperties([]) // Ensure properties is set to empty array on error
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again later.",
          variant: "destructive"
        })
      }
    }

    // Fetch user's purchases
    const fetchPurchases = async () => {
      try {
        const response = await fetch('/api/purchases/me')
        if (!response.ok) {
          throw new Error('Failed to fetch purchases')
        }
        const data = await response.json()
        setPurchases(data)
      } catch (error) {
        console.error('Error fetching purchases:', error)
        setPurchases([]) // Ensure purchases is set to empty array on error
      }
    }

    // Execute both fetches and update loading state when both are done
    Promise.all([fetchProperties(), fetchPurchases()])
      .finally(() => {
        setLoading(false)
      })
  }, [toast])

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property)
    // Default down payment to 10% of property price
    setDownPayment((property.price * 0.1).toString())
  }

  const handlePurchase = async () => {
    if (!selectedProperty) return

    setPurchaseLoading(true)
    try {
      const downPaymentAmount = parseFloat(downPayment)

      if (isNaN(downPaymentAmount) || downPaymentAmount <= 0) {
        throw new Error('Please enter a valid down payment amount')
      }

      if (downPaymentAmount > selectedProperty.price) {
        throw new Error('Down payment cannot exceed the property price')
      }

      const purchaseData = {
        propertyId: selectedProperty.id,
        totalAmount: selectedProperty.price,
        downPayment: downPaymentAmount,
        remainingAmount: selectedProperty.price - downPaymentAmount,
        paymentMethod: paymentMethod
      }

      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Failed to complete purchase')
      }

      toast({
        title: "Purchase Initiated",
        description: "Your property purchase has been initiated successfully!",
        variant: "default"
      })

      // Refresh purchases
      const purchasesResponse = await fetch('/api/purchases/me')
      const purchasesData = await purchasesResponse.json()
      setPurchases(purchasesData)

      // Reset form
      setSelectedProperty(null)
      setDownPayment("")
    } catch (error: any) {
      console.error('Error making purchase:', error)
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to complete purchase. Please try again.",
        variant: "destructive"
      })
    } finally {
      setPurchaseLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Client Room</h1>

      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="purchases">My Purchases</TabsTrigger>
          <TabsTrigger value="buy">Buy Property</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases">
          <div className="grid gap-6">
            <h2 className="text-2xl font-semibold">My Property Purchases</h2>

            {purchases.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">You haven't purchased any properties yet.</p>
                  <Button
                    className="mt-4"
                    onClick={() => document.querySelector('[data-value="buy"]')?.click()}
                  >
                    Browse Properties
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {purchases.map((purchase) => (
                  <Card key={purchase.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{purchase.property.title}</CardTitle>
                          <CardDescription>{purchase.property.address}</CardDescription>
                        </div>
                        <Badge
                          variant={purchase.status === 'completed' ? 'default' : 'outline'}
                          className={
                            purchase.status === 'completed'
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                          }
                        >
                          {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Purchase Date</p>
                            <p className="font-medium">{formatDate(purchase.purchaseDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="font-medium">{formatCurrency(purchase.totalAmount)}</p>
                          </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Down Payment</p>
                            <p className="font-medium">{formatCurrency(purchase.downPayment)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Remaining Amount</p>
                            <p className="font-medium">{formatCurrency(purchase.remainingAmount)}</p>
                          </div>
                        </div>

                        {purchase.payments.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <p className="text-sm font-medium mb-2">Payment History</p>
                              <div className="space-y-2">
                                {purchase.payments.map((payment) => (
                                  <div key={payment.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                                    <div className="flex items-center gap-2">
                                      {payment.status === 'completed' ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <AlertCircle className="h-4 w-4 text-amber-500" />
                                      )}
                                      <span>{formatDate(payment.paymentDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="text-sm text-muted-foreground capitalize">{payment.paymentMethod.replace('_', ' ')}</span>
                                      <span className="font-medium">{formatCurrency(payment.amount)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t">
                      <div className="w-full flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          {purchase.status === 'completed'
                            ? 'Purchase completed'
                            : `${formatCurrency(purchase.remainingAmount)} remaining`}
                        </p>
                        {purchase.status !== 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => router.push(`/ClientRoom/payment/${purchase.id}`)}
                          >
                            Make Payment
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="buy">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">Available Properties</h2>
              {console.log('Rendering properties, length:', properties.length)}
              {properties.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No properties available at the moment.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {console.log('Mapping properties:', properties)}
                  {properties.map((property) => (
                    <Card
                      key={property.id}
                      className={`cursor-pointer transition-all ${selectedProperty?.id === property.id ? 'ring-2 ring-indigo-500' : 'hover:shadow-md'}`}
                      onClick={() => handlePropertySelect(property)}
                    >
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={property?.media && Array.isArray(property.media) && property.media.length > 0
                            ? (property.media.find(m => m?.isPrimary)?.filePath || property.media[0]?.filePath || '/placeholder.svg')
                            : '/placeholder.svg'}
                          alt={property?.title || 'Property Image'}
                          className="object-cover w-full h-full"
                          onError={(e) => { e.currentTarget.src = '/placeholder.svg' }}
                        />
                        <div className="absolute top-2 right-2">
                          <Badge>{property?.listingType?.name || 'For Sale'}</Badge>
                        </div>
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="font-semibold text-lg">{property?.title || 'Untitled Property'}</h3>
                        <p className="text-muted-foreground text-sm">{property?.address || 'No address provided'}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="font-bold text-indigo-600">{formatCurrency(property?.price || 0)}</p>
                          <p className="text-sm">{property?.propertyType?.name || 'Property'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Purchase Property</CardTitle>
                  <CardDescription>Complete your property purchase</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedProperty ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">{selectedProperty.title}</h3>
                        <p className="text-sm text-muted-foreground">{selectedProperty.address}</p>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm text-muted-foreground">Property Price</p>
                        <p className="font-bold text-lg">{formatCurrency(selectedProperty.price)}</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="downPayment">Down Payment</Label>
                        <Input
                          id="downPayment"
                          type="number"
                          value={downPayment}
                          onChange={(e) => setDownPayment(e.target.value)}
                          placeholder="Enter down payment amount"
                        />
                        <p className="text-xs text-muted-foreground">
                          Minimum 10% of property price recommended
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select
                          value={paymentMethod}
                          onValueChange={setPaymentMethod}
                        >
                          <SelectTrigger id="paymentMethod">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {downPayment && !isNaN(parseFloat(downPayment)) && (
                        <div className="bg-gray-50 p-3 rounded-md space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Down Payment:</span>
                            <span>{formatCurrency(parseFloat(downPayment))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Remaining Amount:</span>
                            <span>{formatCurrency(selectedProperty.price - parseFloat(downPayment))}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Home className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p>Select a property to purchase</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={!selectedProperty || purchaseLoading || !downPayment}
                    onClick={handlePurchase}
                  >
                    {purchaseLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Purchase
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
