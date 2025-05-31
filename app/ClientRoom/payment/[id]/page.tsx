"use client"
import React, { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Home, DollarSign, CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Property {
  id: number
  title: string
  address: string
  price: number
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

export default function PaymentPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params)
  const purchaseId = unwrappedParams.id

  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("bank_transfer")
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const response = await fetch(`/api/purchases/${purchaseId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch purchase details')
        }
        const data = await response.json()
        setPurchase(data)

        // Default payment amount to remaining amount or 0 if completed
        if (data.remainingAmount > 0) {
          setPaymentAmount(data.remainingAmount.toString())
        }
      } catch (error) {
        console.error('Error fetching purchase:', error)
        toast({
          title: "Error",
          description: "Failed to load purchase details. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPurchase()
  }, [purchaseId, toast])

  const handlePayment = async () => {
    if (!purchase) return

    setPaymentLoading(true)
    try {
      const amount = parseFloat(paymentAmount)

      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid payment amount')
      }

      if (amount > purchase.remainingAmount) {
        throw new Error('Payment amount cannot exceed the remaining amount')
      }

      const paymentData = {
        purchaseId: purchase.id,
        amount: amount,
        paymentMethod: paymentMethod
      }

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to process payment')
      }

      const result = await response.json()

      // Refresh purchase data
      const purchaseResponse = await fetch(`/api/purchases/${purchaseId}`)
      const purchaseData = await purchaseResponse.json()
      setPurchase(purchaseData)

      // Show success state
      setPaymentSuccess(true)

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully!",
        variant: "default"
      })
    } catch (error: any) {
      console.error('Error making payment:', error)
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setPaymentLoading(false)
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

  if (!purchase) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Purchase Not Found</h2>
          <p className="text-muted-foreground mb-6">The purchase you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => router.push('/ClientRoom')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Client Room
          </Button>
        </div>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 pb-4 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your payment of {formatCurrency(parseFloat(paymentAmount))} has been processed successfully.
            </p>

            {purchase.remainingAmount <= 0 ? (
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="font-medium text-green-800">
                  Congratulations! You've completed all payments for this property.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="font-medium text-blue-800">
                  Remaining balance: {formatCurrency(purchase.remainingAmount)}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push('/ClientRoom')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Client Room
              </Button>

              {purchase.remainingAmount > 0 && (
                <Button 
                  className="flex-1"
                  onClick={() => setPaymentSuccess(false)}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Make Another Payment
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => router.push('/ClientRoom')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Client Room
      </Button>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Information about your purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                <img 
                  src={purchase.property.media && purchase.property.media.length > 0 ? purchase.property.media.find(m => m.isPrimary)?.filePath || purchase.property.media[0].filePath : '/placeholder.svg'} 
                  alt={purchase.property.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <h3 className="font-semibold text-lg">{purchase.property.title}</h3>
              <p className="text-muted-foreground">{purchase.property.address}</p>

              <Separator className="my-4" />

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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Paid Amount</p>
                    <p className="font-medium">{formatCurrency(purchase.totalAmount - purchase.remainingAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining Amount</p>
                    <p className="font-medium text-indigo-600">{formatCurrency(purchase.remainingAmount)}</p>
                  </div>
                </div>
              </div>

              {purchase.payments.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h4 className="font-medium mb-2">Payment History</h4>
                    <div className="space-y-2">
                      {purchase.payments.map((payment, index) => (
                        <div key={payment.id} className="flex justify-between p-2 bg-gray-50 rounded-md">
                          <div>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(payment.paymentDate)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">{formatCurrency(payment.amount)}</span>
                            <p className="text-xs text-muted-foreground capitalize">
                              {payment.paymentMethod.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>Complete your payment for this property</CardDescription>
            </CardHeader>
            <CardContent>
              {purchase.remainingAmount <= 0 ? (
                <div className="text-center py-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Payment Completed</h3>
                  <p className="text-muted-foreground">
                    You have already paid the full amount for this property.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="font-medium text-indigo-800">
                      Remaining Balance: {formatCurrency(purchase.remainingAmount)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentAmount">Payment Amount</Label>
                    <Input
                      id="paymentAmount"
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Enter payment amount"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the amount you wish to pay
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

                  {paymentAmount && !isNaN(parseFloat(paymentAmount)) && (
                    <div className="bg-gray-50 p-3 rounded-md space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Payment Amount:</span>
                        <span>{formatCurrency(parseFloat(paymentAmount))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Remaining After Payment:</span>
                        <span>{formatCurrency(Math.max(0, purchase.remainingAmount - parseFloat(paymentAmount)))}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    disabled={
                      paymentLoading || 
                      !paymentAmount || 
                      isNaN(parseFloat(paymentAmount)) || 
                      parseFloat(paymentAmount) <= 0 ||
                      parseFloat(paymentAmount) > purchase.remainingAmount
                    }
                    onClick={handlePayment}
                  >
                    {paymentLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Payment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Need Assistance?</h3>
                <p className="mb-4">
                  If you have any questions about your payment or purchase, our support team is here to help.
                </p>
                <Button variant="secondary" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
