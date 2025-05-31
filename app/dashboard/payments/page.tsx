"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Loader2, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  Mail,
  FileText
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [pendingPurchases, setPendingPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("paymentDate")
  const [sortDirection, setSortDirection] = useState("desc")
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false)
  const [invoiceNote, setInvoiceNote] = useState<string>("")
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all-payments")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all payments
        const paymentsResponse = await fetch('/api/payments')
        if (!paymentsResponse.ok) {
          throw new Error('Failed to fetch payments')
        }
        const paymentsData = await paymentsResponse.json()
        setPayments(paymentsData)
        setFilteredPayments(paymentsData)

        // Fetch purchases with pending payments
        const purchasesResponse = await fetch('/api/purchases?status=pending')
        if (!purchasesResponse.ok) {
          throw new Error('Failed to fetch pending purchases')
        }
        const purchasesData = await purchasesResponse.json()
        setPendingPurchases(purchasesData.filter((purchase: Purchase) => purchase.remainingAmount > 0))
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load payment data. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  useEffect(() => {
    // Apply filters and sorting to payments
    let result = [...payments]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(payment => 
        payment.purchase.property.title.toLowerCase().includes(term) ||
        payment.purchase.property.address.toLowerCase().includes(term) ||
        `${payment.purchase.buyer.firstName} ${payment.purchase.buyer.lastName}`.toLowerCase().includes(term) ||
        payment.purchase.buyer.email.toLowerCase().includes(term) ||
        payment.paymentMethod.toLowerCase().includes(term)
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(payment => payment.status === statusFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'paymentDate':
          comparison = new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
          break
        case 'amount':
          comparison = a.amount - b.amount
          break
        case 'buyer':
          comparison = `${a.purchase.buyer.firstName} ${a.purchase.buyer.lastName}`.localeCompare(`${b.purchase.buyer.firstName} ${b.purchase.buyer.lastName}`)
          break
        case 'property':
          comparison = a.purchase.property.title.localeCompare(b.purchase.property.title)
          break
        default:
          comparison = 0
      }

      return sortDirection === 'desc' ? comparison : -comparison
    })

    setFilteredPayments(result)
  }, [payments, searchTerm, statusFilter, sortField, sortDirection])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleSendInvoice = async () => {
    if (!selectedPurchase) return

    setInvoiceLoading(true)
    try {
      const invoiceData = {
        purchaseId: selectedPurchase.id,
        notes: invoiceNote || undefined
      }

      // This would be the API endpoint to send an invoice
      const response = await fetch('/api/invoices/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to send invoice')
      }

      toast({
        title: "Invoice Sent",
        description: `Invoice has been sent to ${selectedPurchase.buyer.firstName} ${selectedPurchase.buyer.lastName}.`,
        variant: "default"
      })

      // Reset form and close dialog
      setInvoiceNote("")
      setIsInvoiceDialogOpen(false)
    } catch (error: any) {
      console.error('Error sending invoice:', error)
      toast({
        title: "Failed to Send Invoice",
        description: error.message || "There was a problem sending the invoice. Please try again.",
        variant: "destructive"
      })
    } finally {
      setInvoiceLoading(false)
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payments Management</h1>
          <p className="text-muted-foreground">Manage payments and send invoices to clients</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-initial">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="flex-1 sm:flex-initial" onClick={() => router.push('/dashboard/purchases')}>
            <DollarSign className="mr-2 h-4 w-4" />
            View Purchases
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-payments">All Payments</TabsTrigger>
          <TabsTrigger value="pending-invoices">Pending Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="all-payments">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by property, buyer..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort('paymentDate')}
                      >
                        Date
                        {sortField === 'paymentDate' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="ml-1 h-4 w-4" /> : 
                            <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort('amount')}
                      >
                        Amount
                        {sortField === 'amount' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="ml-1 h-4 w-4" /> : 
                            <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <DollarSign className="h-12 w-12 mb-2 opacity-20" />
                          <p>No payments found</p>
                          {searchTerm || statusFilter !== 'all' ? (
                            <Button 
                              variant="link" 
                              onClick={() => {
                                setSearchTerm("")
                                setStatusFilter("all")
                              }}
                            >
                              Clear filters
                            </Button>
                          ) : (
                            <p className="text-sm">No payment records available</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.purchase.property.title}</p>
                            <p className="text-xs text-muted-foreground">{payment.purchase.property.address}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{`${payment.purchase.buyer.firstName} ${payment.purchase.buyer.lastName}`}</p>
                            <p className="text-xs text-muted-foreground">{payment.purchase.buyer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {payment.paymentMethod.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/payments/${payment.id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  // Find the purchase associated with this payment
                                  const purchase = pendingPurchases.find(p => p.id === payment.purchaseId);
                                  if (purchase) {
                                    setSelectedPurchase(purchase);
                                    setIsInvoiceDialogOpen(true);
                                  } else {
                                    toast({
                                      title: "Information",
                                      description: "This payment doesn't have an associated pending purchase.",
                                      variant: "default"
                                    });
                                  }
                                }}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={async () => {
                                  try {
                                    toast({
                                      title: "Generating Invoice",
                                      description: "Please wait while we generate your invoice...",
                                      variant: "default"
                                    });

                                    const response = await fetch(`/api/invoices/generate/${payment.id}`, {
                                      method: 'POST',
                                    });

                                    if (!response.ok) {
                                      throw new Error('Failed to generate invoice');
                                    }

                                    // Get the PDF blob from the response
                                    const blob = await response.blob();

                                    // Create a URL for the blob
                                    const url = window.URL.createObjectURL(blob);

                                    // Create a temporary link element
                                    const link = document.createElement('a');
                                    link.href = url;

                                    // Set the download attribute with a filename
                                    const fileName = `invoice-${payment.id}-${new Date().toISOString().split('T')[0]}.pdf`;
                                    link.setAttribute('download', fileName);

                                    // Append the link to the body
                                    document.body.appendChild(link);

                                    // Trigger the download
                                    link.click();

                                    // Clean up
                                    link.parentNode?.removeChild(link);
                                    window.URL.revokeObjectURL(url);

                                    toast({
                                      title: "Success",
                                      description: "Invoice has been generated and downloaded.",
                                      variant: "default"
                                    });
                                  } catch (error) {
                                    console.error('Error generating invoice:', error);
                                    toast({
                                      title: "Error",
                                      description: "Failed to generate invoice. Please try again later.",
                                      variant: "destructive"
                                    });
                                  }
                                }}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Generate Invoice
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending-invoices">
          <Card>
            <CardHeader>
              <CardTitle>Clients with Pending Payments</CardTitle>
              <CardDescription>Send invoices to clients who haven't completed their payments</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPurchases.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <CheckCircle2 className="h-12 w-12 mb-2 opacity-20" />
                          <p>No pending payments</p>
                          <p className="text-sm">All clients are up to date with their payments</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingPurchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{purchase.property.title}</p>
                            <p className="text-xs text-muted-foreground">{purchase.property.address}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{`${purchase.buyer.firstName} ${purchase.buyer.lastName}`}</p>
                            <p className="text-xs text-muted-foreground">{purchase.buyer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
                        <TableCell>{formatCurrency(purchase.totalAmount)}</TableCell>
                        <TableCell className="font-medium text-amber-600">
                          {formatCurrency(purchase.remainingAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  toast({
                                    title: "Feature Not Available",
                                    description: "Purchase details view is coming soon.",
                                    variant: "default"
                                  });
                                }}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedPurchase(purchase)
                                  setIsInvoiceDialogOpen(true)
                                }}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={async () => {
                                  try {
                                    toast({
                                      title: "Generating Invoice",
                                      description: "Please wait while we generate your invoice...",
                                      variant: "default"
                                    });

                                    // Find the latest payment for this purchase
                                    const latestPayment = payments.find(p => p.purchaseId === purchase.id);

                                    if (!latestPayment) {
                                      throw new Error('No payment found for this purchase');
                                    }

                                    const response = await fetch(`/api/invoices/generate/${latestPayment.id}`, {
                                      method: 'POST',
                                    });

                                    if (!response.ok) {
                                      throw new Error('Failed to generate invoice');
                                    }

                                    // Get the PDF blob from the response
                                    const blob = await response.blob();

                                    // Create a URL for the blob
                                    const url = window.URL.createObjectURL(blob);

                                    // Create a temporary link element
                                    const link = document.createElement('a');
                                    link.href = url;

                                    // Set the download attribute with a filename
                                    const fileName = `invoice-${purchase.id}-${new Date().toISOString().split('T')[0]}.pdf`;
                                    link.setAttribute('download', fileName);

                                    // Append the link to the body
                                    document.body.appendChild(link);

                                    // Trigger the download
                                    link.click();

                                    // Clean up
                                    link.parentNode?.removeChild(link);
                                    window.URL.revokeObjectURL(url);

                                    toast({
                                      title: "Success",
                                      description: "Invoice has been generated and downloaded.",
                                      variant: "default"
                                    });
                                  } catch (error) {
                                    console.error('Error generating invoice:', error);
                                    toast({
                                      title: "Error",
                                      description: "Failed to generate invoice. Please try again later.",
                                      variant: "destructive"
                                    });
                                  }
                                }}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Generate Invoice
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Payment Invoice</DialogTitle>
            <DialogDescription>
              Send a payment reminder invoice to the client.
            </DialogDescription>
          </DialogHeader>

          {selectedPurchase && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Property</p>
                    <p className="font-medium">{selectedPurchase.property.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-medium">{`${selectedPurchase.buyer.firstName} ${selectedPurchase.buyer.lastName}`}</p>
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-medium">{formatCurrency(selectedPurchase.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining Amount</p>
                    <p className="font-medium text-indigo-600">{formatCurrency(selectedPurchase.remainingAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNote">Additional Note (Optional)</Label>
                <Input
                  id="invoiceNote"
                  value={invoiceNote}
                  onChange={(e) => setInvoiceNote(e.target.value)}
                  placeholder="Add a note to include in the invoice"
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">Payment Reminder</p>
                    <p className="text-sm text-amber-700">
                      An invoice will be sent to {selectedPurchase.buyer.email} with payment details and instructions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsInvoiceDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendInvoice}
              disabled={invoiceLoading}
            >
              {invoiceLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invoice
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
