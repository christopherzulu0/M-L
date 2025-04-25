"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  Upload,
  MapPin,
  DollarSign,
  BedSingle,
  Bath,
  Ruler,
  Info,
  ImageIcon,
  FileText,
  ArrowLeft,
  Plus,
  Trash2,
} from "lucide-react"
import Image from "next/image"
import { generateClientDropzoneAccept } from "uploadthing/client"
import { useDropzone } from "react-dropzone"
import { useUploadThing } from "@/lib/uploadthing"

// Property types interface
interface PropertyType {
  id: number
  name: string
}

interface ListingType {
  id: number
  name: string
}

interface Location {
  id: number
  city: string
  stateProvince: string
  country: string
}

interface Agent {
  id: number
  user: {
    firstName: string
    lastName: string
  }
}

const availableFeatures = [
  "Air Conditioning",
  "Garden",
  "Fireplace",
  "Garage",
  "Swimming Pool",
  "Security System",
  "Solar Panels",
  "High Speed Internet"
]

const availableAmenities = [
  "Gym",
  "Parking",
  "Elevator",
  "24/7 Security",
  "Playground",
  "Laundry",
  "Storage",
  "Business Center"
]

// Form schema
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  propertyTypeId: z.number({ 
    required_error: "Property type is required",
    invalid_type_error: "Property type must be a number" 
  }),
  listingTypeId: z.number({ 
    required_error: "Listing type is required",
    invalid_type_error: "Listing type must be a number"
  }),
  price: z.string(),
  priceType: z.string().default("total"),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string().default("Zambia"),
  locationId: z.number({
    required_error: "Location is required",
    invalid_type_error: "Location must be a number"
  }),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  squareFeet: z.string().optional(),
  yearBuilt: z.string().optional(),
  lotSize: z.string().optional(),
  parkingSpaces: z.string().optional(),
  features: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  status: z.string().default("draft"),
  featured: z.boolean().default(false),
  agentId: z.string().optional(),
  DView: z.string().optional(),
  images: z.array(z.string()).default([]),
})

export default function AddListingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [images, setImages] = useState<string[]>([])
  const [documents, setDocuments] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
  const [listingTypes, setListingTypes] = useState<ListingType[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch property types, listing types, and locations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [propertyTypesRes, listingTypesRes, locationsRes, agentsRes] = await Promise.all([
          fetch('/api/property-types'),
          fetch('/api/listing-types'),
          fetch('/api/locations'),
          fetch('/api/agents')
        ])

        const propertyTypesData = await propertyTypesRes.json()
        const listingTypesData = await listingTypesRes.json()
        const locationsData = await locationsRes.json()
        const agentsData = await agentsRes.json()

        setPropertyTypes(propertyTypesData)
        setListingTypes(listingTypesData)
        setLocations(locationsData)
        setAgents(agentsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load property data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res) {
        const imageUrls = res.map((file) => file.url)
        form.setValue("images", [...form.watch("images"), ...imageUrls])
        setIsUploading(false)
        toast({
          title: "Upload complete",
          description: "Your images have been uploaded successfully",
        })
      }
    },
    onUploadError: (error) => {
      setIsUploading(false)
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      setIsUploading(true)
      await startUpload(acceptedFiles)
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
  })

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      propertyTypeId: 0,
      listingTypeId: 0,
      price: "",
      priceType: "total",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Zambia",
      locationId: 0,
      bedrooms: "",
      bathrooms: "",
      squareFeet: "",
      yearBuilt: "",
      lotSize: "",
      parkingSpaces: "",
      features: [],
      amenities: [],
      status: "draft",
      featured: false,
      DView: "",
      images: [],
    },
  })

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log('Form values:', values);
      console.log('Selected features:', values.features);

      let featureConnections = [];

      // Only process features if there are any selected
      if (values.features.length > 0) {
        try {
          // First, fetch all features to get their IDs
          const featuresResponse = await fetch('/api/features');
          if (featuresResponse.ok) {
            const allFeatures = await featuresResponse.json();
            console.log('Available features from API:', allFeatures);

            // Create a map of feature names to their IDs
            const featureMap = new Map(allFeatures.map((f: any) => [f.name, f.id]));
            console.log('Feature map:', Object.fromEntries(featureMap));

            // Create feature connections
            featureConnections = values.features.map(featureName => {
              const featureId = featureMap.get(featureName);
              if (featureId) {
                return {
                  feature: {
                    connect: {
                      id: featureId
                    }
                  }
                };
              }
              return null;
            }).filter(Boolean);

            console.log('Feature connections:', featureConnections);
          } else {
            console.error('Failed to fetch features, continuing without feature connections');
          }
        } catch (featureError) {
          console.error('Error processing features:', featureError);
          // Continue without feature connections
        }
      }

      const requestData = {
        title: values.title,
        description: values.description,
        price: values.price,
        status: values.status,
        DView: values.DView,
        address: values.address,
        propertyTypeId: Number(values.propertyTypeId),
        listingTypeId: Number(values.listingTypeId),
        locationId: Number(values.locationId),
        agentId: values.agentId ? Number(values.agentId) : null,
        latitude: values.latitude ? Number(values.latitude) : null,
        longitude: values.longitude ? Number(values.longitude) : null,
        bedrooms: values.bedrooms ? Number(values.bedrooms) : null,
        bathrooms: values.bathrooms ? Number(values.bathrooms) : null,
        squareFeet: values.squareFeet ? Number(values.squareFeet) : null,
        lotSize: values.lotSize ? Number(values.lotSize) : null,
        yearBuilt: values.yearBuilt ? Number(values.yearBuilt) : null,
        parkingSpaces: values.parkingSpaces ? Number(values.parkingSpaces) : null,
        features: featureConnections.length > 0 ? {
          create: featureConnections
        } : undefined,
        media: {
          create: values.images.map((url) => ({
            mediaType: "image",
            filePath: url,
            fileName: url.split('/').pop() || 'unnamed',
            isPrimary: false,
            sortOrder: 0
          }))
        }
      };

      console.log('Final request data:', JSON.stringify(requestData, null, 2));

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create property');
      }

      toast({
        title: "Listing created successfully",
        description: "Your property listing has been created.",
      });
      router.push("/dashboard/properties");
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create property listing",
        variant: "destructive",
      });
    }
  }

  // Handle document upload
  const handleDocumentUpload = () => {
    setIsUploading(true)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)

          // Add mock document after upload completes
          setDocuments([...documents, "Property_Deed.pdf"])

          return 0
        }
        return prev + 10
      })
    }, 300)
  }

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...form.watch("images")]
    newImages.splice(index, 1)
    form.setValue("images", newImages)
  }

  // Remove document
  const removeDocument = (index: number) => {
    const newDocuments = [...documents]
    newDocuments.splice(index, 1)
    setDocuments(newDocuments)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Add New Property Listing</h1>
          <p className="text-muted-foreground">Create a new property listing to showcase on your website</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6 md:grid-cols-7">
            {/* Main content */}
            <div className="md:col-span-5">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>Enter the basic details about the property listing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Modern Apartment with Pool View" {...field} />
                            </FormControl>
                            <FormDescription>
                              A clear, descriptive title helps attract potential buyers or renters
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the property in detail..."
                                className="min-h-[150px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Provide a detailed description highlighting key features and benefits
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="DView"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DView Link</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter DView link" {...field} />
                            </FormControl>
                            <FormDescription>
                              Add a link to the DView virtual tour for this property
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="propertyTypeId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property Type</FormLabel>
                              <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select property type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {propertyTypes.map((type) => (
                                    <SelectItem key={type.id} value={String(type.id)}>
                                      {type.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="listingTypeId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Listing Type</FormLabel>
                              <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select listing type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {listingTypes.map((type) => (
                                    <SelectItem key={type.id} value={String(type.id)}>
                                      {type.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (ZMW)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                  <Input className="pl-10" placeholder="e.g. 2,500,000" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="priceType"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Price Type</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="total" id="total" />
                                    <Label htmlFor="total">Total Price</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="month" id="month" />
                                    <Label htmlFor="month">Per Month</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => router.back()}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={() => setActiveTab("details")}>
                        Next: Property Details
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Property Details</CardTitle>
                      <CardDescription>Enter specific details about the property</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name="bedrooms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bedrooms</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <BedSingle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                  <Input className="pl-10" placeholder="e.g. 3" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bathrooms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bathrooms</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Bath className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                  <Input className="pl-10" placeholder="e.g. 2" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="squareFeet"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Square Feet</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Ruler className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                  <Input className="pl-10" placeholder="e.g. 1200" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-6 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name="yearBuilt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year Built</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 2020" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lotSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lot Size (sqft)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 5000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="parkingSpaces"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Parking Spaces</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 2" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab("basic")}>
                        Previous
                      </Button>
                      <Button type="button" onClick={() => setActiveTab("location")}>
                        Next: Location
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Location Tab */}
                <TabsContent value="location">
                  <Card>
                    <CardHeader>
                      <CardTitle>Location Information</CardTitle>
                      <CardDescription>Enter the property location details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <Input className="pl-10" placeholder="e.g. 123 Main Street" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="locationId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {locations.map((location) => (
                                  <SelectItem key={location.id} value={String(location.id)}>
                                    {location.city}, {location.stateProvince}, {location.country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="latitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Latitude (optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. -15.3875" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="longitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Longitude (optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 28.3228" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="rounded-lg border bg-slate-50 p-4">
                        <div className="mb-4 flex items-center gap-2">
                          <Info className="h-5 w-5 text-blue-600" />
                          <p className="font-medium">Map Preview</p>
                        </div>
                        <div className="relative h-[300px] w-full bg-gray-200 rounded-md">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-gray-500">Map will be displayed here</p>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          Enter latitude and longitude coordinates for precise location, or use the address for
                          approximate positioning.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab("details")}>
                        Previous
                      </Button>
                      <Button type="button" onClick={() => setActiveTab("media")}>
                        Next: Media
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media">
                  <Card>
                    <CardHeader>
                      <CardTitle>Media & Documents</CardTitle>
                      <CardDescription>Upload photos, videos, and documents related to the property</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Property Photos</h3>
                        </div>

                        {isUploading && (
                          <div className="space-y-2">
                            <div className="h-2 w-full rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500">Uploading... {uploadProgress}%</p>
                          </div>
                        )}

                        <div
                          {...getRootProps()}
                          className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <input {...getInputProps()} />
                          <Upload className="mb-2 h-8 w-8 text-gray-400" />
                          <p className="text-sm text-gray-500">Drag & drop images here</p>
                          <p className="text-xs text-gray-400">or click to select files</p>
                        </div>

                        {form.watch("images").length > 0 && (
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            {form.watch("images").map((image, index) => (
                              <div
                                key={index}
                                className="group relative aspect-square overflow-hidden rounded-lg border"
                              >
                                <Image
                                  src={image}
                                  alt={`Property image ${index + 1}`}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                                  onClick={() => {
                                    const newImages = form.watch("images").filter((_, i) => i !== index)
                                    form.setValue("images", newImages)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                {index === 0 && (
                                  <Badge className="absolute left-2 top-2 bg-blue-600">Cover Photo</Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Property Documents</h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDocumentUpload}
                            disabled={isUploading}
                          >
                            <Upload className="mr-2 h-4 w-4" /> Upload Documents
                          </Button>
                        </div>

                        {documents.length === 0 ? (
                          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                            <FileText className="mb-2 h-10 w-10 text-gray-400" />
                            <p className="text-sm text-gray-500">No documents uploaded yet</p>
                            <p className="text-xs text-gray-400">
                              Upload floor plans, property deeds, or other relevant documents
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {documents.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                  <span>{doc}</span>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeDocument(index)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab("location")}>
                        Previous
                      </Button>
                      <Button type="button" onClick={() => setActiveTab("features")}>
                        Next: Features
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Features Tab */}
                <TabsContent value="features">
                  <Card>
                    <CardHeader>
                      <CardTitle>Features & Amenities</CardTitle>
                      <CardDescription>Select the features and amenities available with this property</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Property Features</h3>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                          <FormField
                            control={form.control}
                            name="features"
                            render={() => (
                              <>
                                {availableFeatures.map((feature) => (
                                  <FormField
                                    key={feature}
                                    control={form.control}
                                    name="features"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={feature}
                                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(feature)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, feature])
                                                  : field.onChange(field.value?.filter((value) => value !== feature))
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">{feature}</FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </>
                            )}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Property Amenities</h3>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                          <FormField
                            control={form.control}
                            name="amenities"
                            render={() => (
                              <>
                                {availableAmenities.map((amenity) => (
                                  <FormField
                                    key={amenity}
                                    control={form.control}
                                    name="amenities"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={amenity}
                                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(amenity)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, amenity])
                                                  : field.onChange(field.value?.filter((value) => value !== amenity))
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">{amenity}</FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab("media")}>
                        Previous
                      </Button>
                      <Button type="submit">Save Listing</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Listing Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Publication Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="pending">Pending Review</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Set the current status of this listing</FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Featured Listing</FormLabel>
                            <FormDescription>Highlight this property on the homepage</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Assign Agent</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="agentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsible Agent</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an agent" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoading ? (
                                <SelectItem value="loading" disabled>Loading agents...</SelectItem>
                              ) : agents.length > 0 ? (
                                agents.map((agent) => (
                                  <SelectItem key={agent.id} value={String(agent.id)}>
                                    {agent.user.firstName} {agent.user.lastName}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-agents" disabled>No agents available</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>Assign an agent to manage this listing</FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Listing Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border bg-card">
                      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
                        {form.watch("images").length > 0 ? (
                          <Image
                            src={form.watch("images")[0] || "/placeholder.svg"}
                            alt="Property preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">{form.watch("title") || "Property Title"}</h3>
                        <p className="text-sm text-muted-foreground">{form.watch("address") || "Property Address"}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="secondary">
                            {propertyTypes.find((type) => type.id === form.watch("propertyTypeId"))?.name || "Property Type"}
                          </Badge>
                          <Badge variant="outline">
                            {listingTypes.find((type) => type.id === form.watch("listingTypeId"))?.name || "Listing Type"}
                          </Badge>
                        </div>
                        <p className="mt-3 font-semibold text-blue-600">
                          ZMW {form.watch("price") || "Price"}
                          {form.watch("priceType") === "month" && (
                            <span className="text-xs text-muted-foreground">/month</span>
                          )}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                          {form.watch("bedrooms") && (
                            <div className="flex items-center gap-1">
                              <BedSingle className="h-4 w-4" />
                              <span>{form.watch("bedrooms")} Beds</span>
                            </div>
                          )}
                          {form.watch("bathrooms") && (
                            <div className="flex items-center gap-1">
                              <Bath className="h-4 w-4" />
                              <span>{form.watch("bathrooms")} Baths</span>
                            </div>
                          )}
                          {form.watch("squareFeet") && (
                            <div className="flex items-center gap-1">
                              <Ruler className="h-4 w-4" />
                              <span>{form.watch("squareFeet")} sqft</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
