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
  Calendar
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

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("purchaseDate")
  const [sortDirection, setSortDirection] = useState("desc")
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("bank_transfer")
  const [paymentNote, setPaymentNote] = useState<string>("")
  const [paymentLoading, setPaymentLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch('/api/purchases')
        if (!response.ok) {
          throw new Error('Failed to fetch purchases')
        }
        const data = await response.json()
        setPurchases(data)
        setFilteredPurchases(data)
      } catch (error) {
        console.error('Error fetching purchases:', error)
        toast({
          title: "Error",
          description: "Failed to load purchases. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [toast])

  useEffect(() => {
    // Apply filters and sorting
    let result = [...purchases]
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(purchase => 
        purchase.property.title.toLowerCase().includes(term) ||
        purchase.property.address.toLowerCase().includes(term) ||
        `${purchase.buyer.firstName} ${purchase.buyer.lastName}`.toLowerCase().includes(term) ||
        purchase.buyer.email.toLowerCase().includes(term)
      )
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(purchase => purchase.status === statusFilter)
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      
      switch (sortField) {
        case 'purchaseDate':
          comparison = new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
          break
        case 'totalAmount':
          comparison = a.totalAmount - b.totalAmount
          break
        case 'remainingAmount':
          comparison = a.remainingAmount - b.remainingAmount
          break
        case 'buyer':
          comparison = `${a.buyer.firstName} ${a.buyer.lastName}`.localeCompare(`${b.buyer.firstName} ${b.buyer.lastName}`)
          break
        case 'property':
          comparison = a.property.title.localeCompare(b.property.title)
          break
        default:
          comparison = 0
      }
      
      return sortDirection === 'asc' ? comparison : -comparison
    })
    
    setFilteredPurchases(result)
  }, [purchases, searchTerm, statusFilter, sortField, sortDirection])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleRecordPayment = async () => {
    if (!selectedPurchase) return

    setPaymentLoading(true)
    try {
      const amount = parseFloat(paymentAmount)
      
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid payment amount')
      }

      if (amount > selectedPurchase.remainingAmount) {
        throw new Error('Payment amount cannot exceed the remaining amount')
      }

      const paymentData = {
        purchaseId: selectedPurchase.id,
        amount: amount,
        paymentMethod: paymentMethod,
        notes: paymentNote || undefined
      }

      const response = await fetch('/api/payments/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to record payment')
      }

      const result = await response.json()
      
      toast({
        title: "Payment Recorded",
        description: "The payment has been recorded successfully.",
        variant: "default"
      })

      // Refresh purchases
      const purchasesResponse = await fetch('/api/purchases')
      const purchasesData = await purchasesResponse.json()
      setPurchases(purchasesData)
      
      // Reset form and close dialog
      setPaymentAmount("")
      setPaymentMethod("bank_transfer")
      setPaymentNote("")
      setIsPaymentDialogOpen(false)
    } catch (error: any) {
      console.error('Error recording payment:', error)
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to record payment. Please try again.",
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
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            <X className="mr-1 h-3 w-3" />
            Cancelled
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
          <h1 className="text-2xl font-bold">Property Purchases</h1>
          <p className="text-muted-foreground">Manage and track all property purchases</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-initial">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="flex-1 sm:flex-initial">
            <DollarSign className="mr-2 h-4 w-4" />
            New Purchase
          </Button>
        </div>
      </div>
      
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
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    {sortDirection === 'asc' ? (
                      <ChevronUp className="mr-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="mr-2 h-4 w-4" />
                    )}
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchaseDate">Purchase Date</SelectItem>
                  <SelectItem value="totalAmount">Total Amount</SelectItem>
                  <SelectItem value="remainingAmount">Remaining Amount</SelectItem>
                  <SelectItem value="buyer">Buyer Name</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
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
                    onClick={() => handleSort('purchaseDate')}
                  >
                    Date
                    {sortField === 'purchaseDate' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('totalAmount')}
                  >
                    Amount
                    {sortField === 'totalAmount' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('remainingAmount')}
                  >
                    Remaining
                    {sortField === 'remainingAmount' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Calendar className="h-12 w-12 mb-2 opacity-20" />
                      <p>No purchases found</p>
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
                        <p className="text-sm">Add a new purchase to get started</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPurchases.map((purchase, index) => (
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
                    <TableCell>
                      <div className="flex items-center">
                        {formatCurrency(purchase.remainingAmount)}
                        {purchase.remainingAmount === 0 && (
                          <CheckCircle2 className="ml-1 h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/dashboard/purchases/${purchase.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {purchase.status !== 'completed' && purchase.status !== 'cancelled' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedPurchase(purchase)
                              setIsPaymentDialogOpen(true)
                            }}
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for this property purchase.
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
                    <p className="text-sm text-muted-foreground">Buyer</p>
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
                <Label htmlFor="paymentAmount">Payment Amount</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter payment amount"
                />
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
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentNote">Note (Optional)</Label>
                <Input
                  id="paymentNote"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="Add a note about this payment"
                />
              </div>
              
              {paymentAmount && !isNaN(parseFloat(paymentAmount)) && (
                <div className="bg-gray-50 p-3 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Payment Amount:</span>
                    <span>{formatCurrency(parseFloat(paymentAmount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Remaining After Payment:</span>
                    <span>{formatCurrency(Math.max(0, selectedPurchase.remainingAmount - parseFloat(paymentAmount)))}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRecordPayment}
              disabled={
                paymentLoading || 
                !paymentAmount || 
                isNaN(parseFloat(paymentAmount)) || 
                parseFloat(paymentAmount) <= 0 ||
                (selectedPurchase && parseFloat(paymentAmount) > selectedPurchase.remainingAmount)
              }
            >
              {paymentLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}