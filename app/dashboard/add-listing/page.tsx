"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
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
  Search,
  Navigation,
} from "lucide-react"
import Image from "next/image"
import { generateClientDropzoneAccept } from "uploadthing/client"
import { useDropzone } from "react-dropzone"
import { useUploadThing } from "@/lib/uploadthing"

// Dynamically import the Map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)
const useMapEvents = dynamic(
  () => import('react-leaflet').then((mod) => mod.useMapEvents),
  { ssr: false }
)

// Custom icon for the map marker
const createMapIcon = () => {
  if (typeof window === 'undefined') return null;

  // Import Leaflet only on client side
  const L = require('leaflet');

  return L.icon({
    iconUrl: '/images/marker-icon.png',
    iconRetinaUrl: '/images/marker-icon-2x.png',
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Location Marker Component
const LocationMarker = ({ position, setPosition }) => {
  const markerRef = useRef(null);
  const [icon, setIcon] = useState(null);

  // Initialize icon on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mapIcon = createMapIcon();
      setIcon(mapIcon);
    }
  }, []);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const { lat, lng } = marker.getLatLng();
        setPosition([lat, lng]);
      }
    },
  };

  // Only render marker when position and icon are both available
  return (position && icon) ? (
    <Marker
      position={position}
      icon={icon}
      draggable={true}
      eventHandlers={eventHandlers}
      ref={markerRef}
    >
      <Popup>
        <div className="p-2 text-center">
          <p className="font-medium">Selected Location</p>
          <p className="text-xs text-gray-500 mt-1">Drag marker to adjust position</p>
          <p className="text-xs mt-2">
            Lat: {position[0].toFixed(6)}<br />
            Lng: {position[1].toFixed(6)}
          </p>
        </div>
      </Popup>
    </Marker>
  ) : null;
};

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
  floorPlan: z.string().optional(),
  documents: z.array(z.string()).default([]),
})

export default function AddListingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const propertyId = searchParams.get('id')
  const isEditMode = !!propertyId
  const [activeTab, setActiveTab] = useState("basic")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isFloorPlanUploading, setIsFloorPlanUploading] = useState(false)
  const [isDocumentUploading, setIsDocumentUploading] = useState(false)
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([])
  const [listingTypes, setListingTypes] = useState<ListingType[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null)
  const [searchAddress, setSearchAddress] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [propertyData, setPropertyData] = useState(null)

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
      latitude: "",
      longitude: "",
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
      floorPlan: "",
      documents: [],
    },
  })

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
        console.log('Agents API response:', agentsData)
        console.log('Agents array:', agentsData.agents || [])

        setPropertyTypes(propertyTypesData)
        setListingTypes(listingTypesData)
        setLocations(locationsData)
        setAgents(agentsData.agents || [])
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

  // Fetch property data if in edit mode
  useEffect(() => {
    if (isEditMode && propertyId) {
      const fetchPropertyData = async () => {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/properties/${propertyId}`)

          if (!response.ok) {
            throw new Error("Failed to fetch property data")
          }

          const data = await response.json()
          setPropertyData(data)

          // Set map position if latitude and longitude are available
          if (data.latitude && data.longitude) {
            setMapPosition([parseFloat(data.latitude), parseFloat(data.longitude)])
          }

          // Populate form with property data
          if (form) {
            form.reset({
              title: data.title || "",
              description: data.description || "",
              propertyTypeId: data.propertyTypeId || 0,
              listingTypeId: data.listingTypeId || 0,
              price: data.price ? data.price.toString() : "",
              priceType: data.listingType?.name === "For Rent" ? "monthly" : "total",
              address: data.address || "",
              city: data.city || "",
              state: data.state || "",
              zipCode: data.zipCode || "",
              country: data.country || "Zambia",
              locationId: data.locationId || 0,
              latitude: data.latitude ? data.latitude.toString() : "",
              longitude: data.longitude ? data.longitude.toString() : "",
              bedrooms: data.bedrooms ? data.bedrooms.toString() : "",
              bathrooms: data.bathrooms ? data.bathrooms.toString() : "",
              squareFeet: data.squareFeet ? data.squareFeet.toString() : "",
              yearBuilt: data.yearBuilt ? data.yearBuilt.toString() : "",
              lotSize: data.lotSize ? data.lotSize.toString() : "",
              parkingSpaces: data.parkingSpaces ? data.parkingSpaces.toString() : "",
              features: data.features?.map(f => f.feature.name) || [],
              amenities: data.amenities?.map(a => a.amenity.name) || [],
              status: data.status || "draft",
              featured: data.featured || false,
              agentId: data.agentId ? data.agentId.toString() : "",
              DView: data.DView || "",
              images: data.media?.filter(m => m.mediaType === "image").map(m => m.filePath) || [],
              floorPlan: data.media?.find(m => m.mediaType === "floorPlan")?.filePath || "",
              documents: data.media?.filter(m => m.mediaType === "document").map(m => m.filePath) || [],
            })
          }
        } catch (error) {
          console.error('Error fetching property data:', error)
          toast({
            title: "Error",
            description: "Failed to load property data for editing",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      fetchPropertyData()
    }
  }, [isEditMode, propertyId, form])

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

  const { startUpload: startFloorPlanUpload } = useUploadThing("FloorPlanUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        form.setValue("floorPlan", res[0].url)
        setIsFloorPlanUploading(false)
        toast({
          title: "Floor plan uploaded",
          description: "Your floor plan has been uploaded successfully",
        })
      }
    },
    onUploadError: (error) => {
      setIsFloorPlanUploading(false)
      toast({
        title: "Floor plan upload failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const { startUpload: startDocumentUpload } = useUploadThing("DocumentUploader", {
    onClientUploadComplete: (res) => {
      if (res) {
        const documentUrls = res.map((file) => file.url)
        form.setValue("documents", [...form.watch("documents"), ...documentUrls])
        setIsDocumentUploading(false)
        toast({
          title: "Documents uploaded",
          description: "Your documents have been uploaded successfully",
        })
      }
    },
    onUploadError: (error) => {
      setIsDocumentUploading(false)
      toast({
        title: "Document upload failed",
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

  const { getRootProps: getFloorPlanRootProps, getInputProps: getFloorPlanInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      setIsFloorPlanUploading(true)
      await startFloorPlanUpload(acceptedFiles)
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
  })

  const { getRootProps: getDocumentRootProps, getInputProps: getDocumentInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      setIsDocumentUploading(true)
      await startDocumentUpload(acceptedFiles)
    },
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
  })

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log('Form submission started');
      console.log('Form values:', values);
      console.log('Selected features:', values.features);
      console.log('Edit mode:', isEditMode);

      // Check for required fields
      if (!values.title) console.log('Title is missing');
      if (!values.description) console.log('Description is missing');
      if (!values.propertyTypeId) console.log('Property type is missing');
      if (!values.listingTypeId) console.log('Listing type is missing');
      if (!values.address) console.log('Address is missing');
      if (!values.locationId) console.log('Location is missing');

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

      // Prepare the base request data
      const baseRequestData = {
        title: values.title,
        description: values.description,
        price: values.price,
        status: values.status,
        DView: values.DView,
        FloorPlan: values.floorPlan,
        address: values.address,
        propertyTypeId: Number(values.propertyTypeId),
        listingTypeId: Number(values.listingTypeId),
        locationId: Number(values.locationId),
        agentId: values.agentId ? Number(values.agentId) : null,
        latitude: values.latitude || null,
        longitude: values.longitude || null,
        bedrooms: values.bedrooms ? Number(values.bedrooms) : null,
        bathrooms: values.bathrooms ? Number(values.bathrooms) : null,
        squareFeet: values.squareFeet ? Number(values.squareFeet) : null,
        lotSize: values.lotSize ? Number(values.lotSize) : null,
        yearBuilt: values.yearBuilt ? Number(values.yearBuilt) : null,
        parkingSpaces: values.parkingSpaces ? Number(values.parkingSpaces) : null,
      };

      // Add media and features differently based on whether we're adding or editing
      let requestData;

      if (isEditMode) {
        // For editing, we need to handle updating existing media and features
        requestData = {
          ...baseRequestData,
          // For editing, we might need a different approach for features and media
          // This is a simplified version - you may need to adjust based on your API
          features: featureConnections.length > 0 ? {
            // This assumes your API can handle replacing all features
            // You might need a more complex approach like deleteMany + createMany
            create: featureConnections
          } : undefined,
          // Similarly for media, this is simplified
          media: {
            // This assumes your API can handle replacing media
            create: [
              // Add images
              ...values.images.map((url) => ({
                mediaType: "image",
                filePath: url,
                fileName: url.split('/').pop() || 'unnamed',
                isPrimary: false,
                sortOrder: 0
              })),
              // Add documents
              ...values.documents.map((url) => ({
                mediaType: "document",
                filePath: url,
                fileName: url.split('/').pop() || 'document',
                isPrimary: false,
                sortOrder: 0
              })),
              // Add floor plan if available
              ...(values.floorPlan ? [{
                mediaType: "floorplan",
                filePath: values.floorPlan,
                fileName: values.floorPlan.split('/').pop() || 'floorplan',
                isPrimary: false,
                sortOrder: 0
              }] : []),
              // Add 3D view if available
              ...(values.DView ? [{
                mediaType: "3dview",
                filePath: values.DView,
                fileName: 'dview',
                isPrimary: false,
                sortOrder: 0
              }] : [])
            ]
          }
        };
      } else {
        // For adding a new property
        requestData = {
          ...baseRequestData,
          features: featureConnections.length > 0 ? {
            create: featureConnections
          } : undefined,
          media: {
            create: [
              // Add images
              ...values.images.map((url) => ({
                mediaType: "image",
                filePath: url,
                fileName: url.split('/').pop() || 'unnamed',
                isPrimary: false,
                sortOrder: 0
              })),
              // Add documents
              ...values.documents.map((url) => ({
                mediaType: "document",
                filePath: url,
                fileName: url.split('/').pop() || 'document',
                isPrimary: false,
                sortOrder: 0
              })),
              // Add floor plan if available
              ...(values.floorPlan ? [{
                mediaType: "floorplan",
                filePath: values.floorPlan,
                fileName: values.floorPlan.split('/').pop() || 'floorplan',
                isPrimary: false,
                sortOrder: 0
              }] : []),
              // Add 3D view if available
              ...(values.DView ? [{
                mediaType: "3dview",
                filePath: values.DView,
                fileName: 'dview',
                isPrimary: false,
                sortOrder: 0
              }] : [])
            ]
          }
        };
      }

      console.log('Final request data:', JSON.stringify(requestData, null, 2));

      // Different API endpoint and method based on whether we're adding or editing
      const url = isEditMode ? `/api/properties/${propertyId}` : "/api/properties";
      const method = isEditMode ? "PUT" : "POST";

      console.log(`Making ${method} request to ${url}`);

      const response = await fetch(url, {
        method: method,
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
      // Log more detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else {
        console.error('Unknown error type:', typeof error);
      }

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create property listing",
        variant: "destructive",
      });
    }
  }

  // Handle document upload progress simulation for visual feedback
  useEffect(() => {
    if (isDocumentUploading) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 0
          }
          return prev + 5
        })
      }, 150)

      return () => clearInterval(interval)
    }
  }, [isDocumentUploading])

  // Update form values when map position changes
  useEffect(() => {
    if (mapPosition) {
      const [lat, lng] = mapPosition;
      form.setValue("latitude", lat.toFixed(6));
      form.setValue("longitude", lng.toFixed(6));
    }
  }, [mapPosition, form]);

  // Update map position when form values change
  useEffect(() => {
    const lat = form.watch("latitude");
    const lng = form.watch("longitude");

    if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
      setMapPosition([Number(lat), Number(lng)]);
    }
  }, [form.watch("latitude"), form.watch("longitude"), form]);

  // Function to search for a location by address
  const searchLocation = async () => {
    if (!searchAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter an address to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      // Using OpenStreetMap Nominatim API for geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setMapPosition([Number(lat), Number(lon)]);
        toast({
          title: "Location found",
          description: `Found location: ${data[0].display_name}`,
        });
      } else {
        toast({
          title: "Location not found",
          description: "Could not find the specified address. Please try a different search term.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching for location:", error);
      toast({
        title: "Error",
        description: "An error occurred while searching for the location",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...form.watch("images")]
    newImages.splice(index, 1)
    form.setValue("images", newImages)
  }

  // Remove document
  const removeDocument = (index: number) => {
    const newDocuments = [...form.watch("documents")]
    newDocuments.splice(index, 1)
    form.setValue("documents", newDocuments)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{isEditMode ? "Edit Property Listing" : "Add New Property Listing"}</h1>
          <p className="text-muted-foreground">{isEditMode ? "Update your property listing information" : "Create a new property listing to showcase on your website"}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            console.log('Form submit event triggered');
            form.handleSubmit(onSubmit)(e);
          }}>
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
                          <p className="font-medium">Map Location</p>
                        </div>

                        {/* Search input */}
                        <div className="mb-4 flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                              className="pl-10"
                              placeholder="Search for an address..."
                              value={searchAddress}
                              onChange={(e) => setSearchAddress(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  searchLocation();
                                }
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={searchLocation}
                            disabled={isSearching}
                          >
                            {isSearching ? (
                              <>Searching...</>
                            ) : (
                              <>Search</>
                            )}
                          </Button>
                        </div>

                        {/* Map */}
                        <div className="relative h-[300px] w-full rounded-md overflow-hidden border">
                          {typeof window !== 'undefined' ? (
                            <MapContainer
                              center={mapPosition || [-15.3875, 28.3228]} // Default to Lusaka, Zambia
                              zoom={13}
                              style={{ height: '100%', width: '100%' }}
                              className="z-0"
                            >
                              <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              <LocationMarker
                                position={mapPosition}
                                setPosition={setMapPosition}
                              />
                            </MapContainer>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <p className="text-gray-500">Map loading...</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            Click on the map to set the location or search for an address above.
                          </p>
                          {mapPosition && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (navigator.geolocation) {
                                  navigator.geolocation.getCurrentPosition(
                                    (position) => {
                                      const { latitude, longitude } = position.coords;
                                      setMapPosition([latitude, longitude]);
                                    },
                                    (error) => {
                                      console.error("Error getting current location:", error);
                                      toast({
                                        title: "Location Error",
                                        description: "Could not get your current location. Please try again or select manually.",
                                        variant: "destructive",
                                      });
                                    }
                                  );
                                }
                              }}
                            >
                              <Navigation className="mr-2 h-4 w-4" />
                              Use My Location
                            </Button>
                          )}
                        </div>
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
                          <h3 className="text-lg font-medium">Floor Plan</h3>
                        </div>

                        {isFloorPlanUploading && (
                          <div className="space-y-2">
                            <div className="h-2 w-full rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500">Uploading floor plan... {uploadProgress}%</p>
                          </div>
                        )}

                        {!form.watch("floorPlan") ? (
                          <div
                            {...getFloorPlanRootProps()}
                            className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                          >
                            <input {...getFloorPlanInputProps()} />
                            <Upload className="mb-2 h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-500">Drag & drop floor plan image here</p>
                            <p className="text-xs text-gray-400">or click to select file</p>
                          </div>
                        ) : (
                          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border">
                            <Image
                              src={form.watch("floorPlan")}
                              alt="Floor plan"
                              fill
                              className="object-contain"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute right-2 top-2 h-7 w-7"
                              onClick={() => form.setValue("floorPlan", "")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          Upload a floor plan image to help potential buyers understand the property layout.
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Property Documents</h3>
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('selectDocumentDialog')?.showModal()}
                            >
                              <FileText className="mr-2 h-4 w-4" /> Select Documents
                            </Button>
                          </div>
                        </div>

                        {isDocumentUploading && (
                          <div className="space-y-2">
                            <div className="h-2 w-full rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500">Uploading documents... {uploadProgress}%</p>
                          </div>
                        )}

                        <div
                          {...getDocumentRootProps()}
                          className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                        >
                          <input {...getDocumentInputProps()} />
                          <Upload className="mb-2 h-8 w-8 text-gray-400" />
                          <p className="text-sm text-gray-500">Drag & drop documents here</p>
                          <p className="text-xs text-gray-400">or click to select files</p>
                          <p className="mt-2 text-xs text-gray-500">Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT</p>
                        </div>

                        {form.watch("documents").length > 0 && (
                          <div className="space-y-2">
                            {form.watch("documents").map((doc, index) => {
                              const fileName = doc.split('/').pop() || 'document';
                              return (
                                <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                                  <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    <span>{fileName}</span>
                                  </div>
                                  <Button type="button" variant="ghost" size="sm" onClick={() => removeDocument(index)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Document Selection Dialog */}
                        <dialog id="selectDocumentDialog" className="modal rounded-lg p-6 shadow-lg">
                          <div className="w-full max-w-md">
                            <h3 className="mb-4 text-lg font-medium">Select Documents</h3>
                            <p className="mb-4 text-sm text-gray-500">Choose from existing documents or upload new ones.</p>

                            <div className="mb-4 space-y-2">
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="doc1" className="h-4 w-4" />
                                <label htmlFor="doc1">Property_Deed.pdf</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="doc2" className="h-4 w-4" />
                                <label htmlFor="doc2">Floor_Plan_Blueprint.pdf</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input type="checkbox" id="doc3" className="h-4 w-4" />
                                <label htmlFor="doc3">Tax_Certificate.pdf</label>
                              </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('selectDocumentDialog')?.close()}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                onClick={() => {
                                  // Add selected documents to form
                                  const selectedDocs = [];
                                  if ((document.getElementById('doc1') as HTMLInputElement)?.checked) {
                                    selectedDocs.push("https://example.com/documents/Property_Deed.pdf");
                                  }
                                  if ((document.getElementById('doc2') as HTMLInputElement)?.checked) {
                                    selectedDocs.push("https://example.com/documents/Floor_Plan_Blueprint.pdf");
                                  }
                                  if ((document.getElementById('doc3') as HTMLInputElement)?.checked) {
                                    selectedDocs.push("https://example.com/documents/Tax_Certificate.pdf");
                                  }

                                  if (selectedDocs.length > 0) {
                                    form.setValue("documents", [...form.watch("documents"), ...selectedDocs]);
                                    toast({
                                      title: "Documents selected",
                                      description: `${selectedDocs.length} document(s) added to your listing`,
                                    });
                                  }

                                  document.getElementById('selectDocumentDialog')?.close();
                                }}
                              >
                                Add Selected
                              </Button>
                            </div>
                          </div>
                        </dialog>
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
                      <Button
                        type="submit"
                        onClick={(e) => {
                          console.log('Save button clicked');
                          // Don't prevent default to allow form submission
                        }}
                      >
                        {isEditMode ? "Update Listing" : "Save Listing"}
                      </Button>
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
