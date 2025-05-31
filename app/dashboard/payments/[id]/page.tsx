"use client"
import React, { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Loader2, 
  ArrowLeft, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock,
  X,
  Calendar,
  DollarSign,
  CreditCard,
  Building,
  User
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

interface Property {
  id: number
  title: string
  address: string
  price: number
  status: string
}

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
}

interface Purchase {
  id: number
  propertyId: number
  buyerId: number
  totalAmount: number
  downPayment: number
  remainingAmount: number
  status: string
  purchaseDate: string
  completionDate: string | null
  property: Property
  buyer: User
}

interface Payment {
  id: number
  purchaseId: number
  amount: number
  paymentMethod: string
  paymentDate: string
  status: string
  purchase: Purchase
}

export default function PaymentDetailsPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params)
  const paymentId = unwrappedParams.id

  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingInvoice, setGeneratingInvoice] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/payments/${paymentId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch payment details')
        }

        const data = await response.json()
        setPayment(data)
      } catch (error) {
        console.error('Error fetching payment:', error)
        toast({
          title: "Error",
          description: "Failed to load payment details. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPayment()
  }, [paymentId, toast])

  const handleGenerateInvoice = async () => {
    if (!payment) return

    setGeneratingInvoice(true)
    try {
      const response = await fetch(`/api/invoices/generate/${payment.id}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to generate invoice')
      }

      // Get the PDF blob from the response
      const blob = await response.blob()

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)

      // Create a temporary link element
      const link = document.createElement('a')
      link.href = url

      // Set the download attribute with a filename
      const fileName = `invoice-${payment.id}-${new Date().toISOString().split('T')[0]}.pdf`
      link.setAttribute('download', fileName)

      // Append the link to the body
      document.body.appendChild(link)

      // Trigger the download
      link.click()

      // Clean up
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "Invoice has been generated and downloaded.",
        variant: "default"
      })
    } catch (error) {
      console.error('Error generating invoice:', error)
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setGeneratingInvoice(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-ZM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            <X className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
    }
  }

  const getPaymentMethodDisplay = (method: string) => {
    return method.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Payment Not Found</h2>
          <p className="text-muted-foreground mb-6">The payment you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => router.push('/dashboard/payments')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payments
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Button 
            variant="ghost" 
            className="mb-2"
            onClick={() => router.push('/dashboard/payments')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payments
          </Button>
          <h1 className="text-2xl font-bold">Payment Details</h1>
          <p className="text-muted-foreground">View payment information and generate invoice</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-initial"
            onClick={handleGenerateInvoice}
            disabled={generatingInvoice}
          >
            {generatingInvoice ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Invoice
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Details about this payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment ID</p>
                    <p className="font-medium">{payment.id}</p>
                  </div>
                </div>
                <div>
                  {getStatusBadge(payment.status)}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium text-lg">{formatCurrency(payment.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <p>{getPaymentMethodDisplay(payment.paymentMethod)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>{formatDate(payment.paymentDate)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchase ID</p>
                  <p className="font-medium">{payment.purchaseId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
              <CardDescription>Details about the property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <Building className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">{payment.purchase.property.title}</p>
                  <p className="text-sm text-muted-foreground">{payment.purchase.property.address}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Property Price</p>
                  <p className="font-medium">{formatCurrency(payment.purchase.property.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{payment.purchase.property.status}</p>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Feature Not Available",
                    description: "Property details view is coming soon.",
                    variant: "default"
                  });
                }}
              >
                View Property Details
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Buyer Information</CardTitle>
              <CardDescription>Details about the buyer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">{`${payment.purchase.buyer.firstName} ${payment.purchase.buyer.lastName}`}</p>
                  <p className="text-sm text-muted-foreground">{payment.purchase.buyer.email}</p>
                </div>
              </div>

              {payment.purchase.buyer.phone && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{payment.purchase.buyer.phone}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Purchase Information</CardTitle>
              <CardDescription>Details about the purchase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Date</p>
                  <p>{formatDate(payment.purchase.purchaseDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{payment.purchase.status}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">{formatCurrency(payment.purchase.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Down Payment</p>
                  <p className="font-medium">{formatCurrency(payment.purchase.downPayment)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Paid Amount</p>
                  <p className="font-medium">{formatCurrency(payment.purchase.totalAmount - payment.purchase.remainingAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining Amount</p>
                  <p className="font-medium text-indigo-600">{formatCurrency(payment.purchase.remainingAmount)}</p>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Feature Not Available",
                    description: "Purchase details view is coming soon.",
                    variant: "default"
                  });
                }}
              >
                View Purchase Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
