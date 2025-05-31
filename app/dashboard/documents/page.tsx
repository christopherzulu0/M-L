"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Loader2, 
  Search, 
  FileText, 
  Trash2, 
  Filter,
  Download,
  Upload,
  Eye,
  File
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Document {
  id: number
  title: string
  description: string | null
  fileName: string
  filePath: string
  fileSize: number | null
  fileType: string
  category: string
  isPublic: boolean
  propertyId: number | null
  userId: number
  createdAt: string
  property: {
    id: number
    title: string
    address: string
  } | null
  user: {
    id: number
    firstName: string
    lastName: string
  }
}

interface Property {
  id: number
  title: string
  address: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  
  // Upload form state
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadDescription, setUploadDescription] = useState("")
  const [uploadCategory, setUploadCategory] = useState("general")
  const [uploadProperty, setUploadProperty] = useState("")
  const [uploadIsPublic, setUploadIsPublic] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  
  const { toast } = useToast()

  useEffect(() => {
    fetchDocuments()
    fetchProperties()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/documents')
      if (!response.ok) {
        throw new Error('Failed to fetch documents')
      }
      const data = await response.json()
      setDocuments(data)
      setFilteredDocuments(data)
    } catch (error) {
      console.error('Error fetching documents:', error)
      toast({
        title: "Error",
        description: "Failed to load documents. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }
      const data = await response.json()
      setProperties(data.properties || data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  useEffect(() => {
    // Apply filters and sorting
    let result = [...documents]
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(document => 
        document.title.toLowerCase().includes(term) ||
        (document.description && document.description.toLowerCase().includes(term)) ||
        document.fileName.toLowerCase().includes(term)
      )
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(document => document.category === categoryFilter)
    }
    
    // Apply tab filter
    if (activeTab === 'my-documents') {
      result = result.filter(document => !document.propertyId)
    } else if (activeTab === 'property-documents') {
      result = result.filter(document => !!document.propertyId)
    }
    
    setFilteredDocuments(result)
  }, [documents, searchTerm, categoryFilter, activeTab])

  const handleSelectDocument = (id: number) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter(docId => docId !== id))
    } else {
      setSelectedDocuments([...selectedDocuments, id])
    }
  }

  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle) {
      toast({
        title: "Error",
        description: "Please provide a title and select a file to upload.",
        variant: "destructive"
      })
      return
    }

    try {
      setUploadLoading(true)
      
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create a fake file path
      const filePath = `/uploads/${Date.now()}_${uploadFile.name}`
      
      // Create the document in the database
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: uploadTitle,
          description: uploadDescription || undefined,
          fileName: uploadFile.name,
          filePath: filePath,
          fileSize: uploadFile.size,
          fileType: uploadFile.type,
          category: uploadCategory,
          isPublic: uploadIsPublic,
          propertyId: uploadProperty ? parseInt(uploadProperty) : undefined
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create document')
      }

      const newDocument = await response.json()
      
      // Update the documents list
      setDocuments([newDocument, ...documents])
      
      // Reset form
      setUploadTitle("")
      setUploadDescription("")
      setUploadCategory("general")
      setUploadProperty("")
      setUploadIsPublic(false)
      setUploadFile(null)
      
      // Close dialog
      setIsUploadDialogOpen(false)
      
      toast({
        title: "Success",
        description: "Document uploaded successfully.",
      })
    } catch (error: any) {
      console.error('Error uploading document:', error)
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploadLoading(false)
    }
  }

  const handleDeleteDocuments = async () => {
    try {
      for (const documentId of selectedDocuments) {
        const response = await fetch('/api/documents', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to delete document')
        }
      }

      // Update the documents list
      setDocuments(documents.filter(doc => !selectedDocuments.includes(doc.id)))
      
      // Clear selection
      setSelectedDocuments([])
      setIsDeleteDialogOpen(false)
      
      toast({
        title: "Success",
        description: `${selectedDocuments.length} document${selectedDocuments.length === 1 ? '' : 's'} deleted successfully.`,
      })
    } catch (error: any) {
      console.error('Error deleting documents:', error)
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete documents. Please try again.",
        variant: "destructive"
      })
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (bytes === null) return 'Unknown'
    
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'legal':
        return <Badge className="bg-red-100 text-red-800">Legal</Badge>
      case 'financial':
        return <Badge className="bg-green-100 text-green-800">Financial</Badge>
      case 'floor_plan':
        return <Badge className="bg-blue-100 text-blue-800">Floor Plan</Badge>
      case 'contract':
        return <Badge className="bg-purple-100 text-purple-800">Contract</Badge>
      case 'marketing':
        return <Badge className="bg-amber-100 text-amber-800">Marketing</Badge>
      default:
        return <Badge variant="outline">General</Badge>
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
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage your documents and files</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-initial"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          {selectedDocuments.length > 0 && (
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-initial text-red-600"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="my-documents">My Documents</TabsTrigger>
          <TabsTrigger value="property-documents">Property Documents</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="floor_plan">Floor Plan</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
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
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                    checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                    onChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-12 w-12 mb-2 opacity-20" />
                      <p>No documents found</p>
                      {searchTerm || categoryFilter !== 'all' ? (
                        <Button 
                          variant="link" 
                          onClick={() => {
                            setSearchTerm("")
                            setCategoryFilter("all")
                          }}
                        >
                          Clear filters
                        </Button>
                      ) : (
                        <p className="text-sm">Upload a document to get started</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                        checked={selectedDocuments.includes(document.id)}
                        onChange={() => handleSelectDocument(document.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{document.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {document.fileName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(document.category)}
                    </TableCell>
                    <TableCell>
                      {document.property ? (
                        <div>
                          <p className="text-sm">{document.property.title}</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatFileSize(document.fileSize)}
                    </TableCell>
                    <TableCell>
                      {formatDate(document.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(document.filePath, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const a = document.createElement('a')
                            a.href = document.filePath
                            a.download = document.fileName
                            document.body.appendChild(a)
                            a.click()
                            document.body.removeChild(a)
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedDocuments([document.id])
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Documents</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedDocuments.length} selected document{selectedDocuments.length === 1 ? '' : 's'}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteDocuments}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document to the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Enter document title"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Enter document description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="floor_plan">Floor Plan</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="property" className="text-sm font-medium">
                  Property
                </label>
                <Select value={uploadProperty} onValueChange={setUploadProperty}>
                  <SelectTrigger id="property">
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Property</SelectItem>
                    {properties.map(property => (
                      <SelectItem key={property.id} value={property.id.toString()}>
                        {property.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="file" className="text-sm font-medium">
                File <span className="text-red-500">*</span>
              </label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={uploadIsPublic}
                onChange={(e) => setUploadIsPublic(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600"
              />
              <label htmlFor="isPublic" className="text-sm font-medium">
                Make document public
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={uploadLoading || !uploadTitle || !uploadFile}
            >
              {uploadLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}