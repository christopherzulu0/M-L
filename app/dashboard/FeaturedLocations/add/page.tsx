"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MapPin, Upload, X, ArrowLeft, Eye, Loader2 } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { useUploadThing } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Location name must be at least 2 characters.",
    }),
    region: z.string().min(1, {
        message: "Please select a region.",
    }),
    description: z
        .string()
        .min(10, {
            message: "Description must be at least 10 characters.",
        })
        .max(500, {
            message: "Description must not exceed 500 characters.",
        }),
    featured: z.boolean().default(false),
    order: z.coerce.number().int().min(0).default(0),
})

// Define a type for the location data
type Location = {
    id: number;
    name: string;
    city: string;
    stateProvince: string | null;
    country: string;
    postalCode: string | null;
    region: string | null;
    description: string | null;
    featured: boolean;
    order: number;
    image: string | null;
    properties: any[];
}

export default function AddLocationPage() {
    const router = useRouter()
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [locations, setLocations] = useState<Location[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [locationSuggestions, setLocationSuggestions] = useState<Location[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

    const { startUpload } = useUploadThing("LocationImageUploader", {
        onClientUploadComplete: (res) => {
            if (res && res.length > 0) {
                // Use the first image URL
                setImagePreview(res[0].url)
                setIsUploading(false)
                toast({
                    title: "Upload complete",
                    description: "Your image has been uploaded successfully",
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

    // Static regions for Zambia
    const staticRegions = [
        "Central Province",
        "Copperbelt Province",
        "Eastern Province",
        "Luapula Province",
        "Lusaka Province",
        "Muchinga Province",
        "Northern Province",
        "North-Western Province",
        "Southern Province",
        "Western Province"
    ]

    // Fetch locations from the API
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setIsLoading(true)
                const response = await fetch('/api/locations')

                if (!response.ok) {
                    throw new Error('Failed to fetch locations')
                }

                const data = await response.json()
                setLocations(data)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching locations:', error)
                setError('Failed to load locations. Please try again.')
                setIsLoading(false)
            }
        }

        fetchLocations()
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            region: "",
            description: "",
            featured: false,
            order: 0,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)

        try {
            // Prepare the data to send to the API
            let locationData;

            if (selectedLocation) {
                // If a location was selected from suggestions, use its data
                locationData = {
                    name: values.name,
                    city: selectedLocation.city || values.name,
                    stateProvince: values.region || selectedLocation.stateProvince,
                    country: selectedLocation.country || "Zambia",
                    postalCode: selectedLocation.postalCode || "",
                    region: values.region || selectedLocation.region,
                    description: values.description || selectedLocation.description,
                    featured: values.featured,
                    order: values.order,
                    image: imagePreview || selectedLocation.image
                };
            } else {
                // If no location was selected, use form values
                locationData = {
                    name: values.name,
                    city: values.name, // Using name as city for now
                    stateProvince: values.region,
                    country: "Zambia", // Default country
                    postalCode: "",
                    region: values.region,
                    description: values.description,
                    featured: values.featured,
                    order: values.order,
                    image: imagePreview // This is now the URL from UploadThing
                };
            }

            // Send the data to the API
            const response = await fetch('/api/locations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(locationData),
            })

            if (!response.ok) {
                throw new Error('Failed to create location')
            }

            const data = await response.json()

            setIsSubmitting(false)
            toast({
                title: "Location added successfully",
                description: `${values.name} has been added to your locations.`,
            })
            router.push("/dashboard/FeaturedLocations")
        } catch (error) {
            console.error('Error creating location:', error)
            setIsSubmitting(false)
            toast({
                title: "Error",
                description: "Failed to create location. Please try again.",
                variant: "destructive"
            })
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setIsUploading(true)
                await startUpload(acceptedFiles)
            }
        },
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        maxFiles: 1,
    })

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            setIsUploading(true)
            await startUpload(Array.from(files))
        }
    }

    const removeImage = () => {
        setImagePreview(null)
    }

    return (
        <div className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild>
                            <Link href="/dashboard/locations">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="sr-only">Back to locations</span>
                            </Link>
                        </Button>
                        <h2 className="text-2xl font-bold tracking-tight">Add New Location</h2>
                    </div>
                    <p className="text-muted-foreground">Create a new location to feature on your website</p>
                </div>
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                        <Link href="/dashboard/locations">Cancel</Link>
                    </Button>
                    <Button 
                        type="submit" 
                        form="location-form" 
                        className="w-full sm:w-auto" 
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Save Location"
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="overflow-hidden border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50 border-b px-6">
                            <CardTitle>Location Details</CardTitle>
                            <CardDescription>Enter the basic information about this location</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-8">
                            {isLoading && (
                                <div className="mb-6 p-4 border border-blue-200 bg-blue-50 text-blue-600 rounded-md">
                                    <p className="flex items-center">
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Loading location data...
                                    </p>
                                    <p className="text-sm mt-1 pl-6">Please wait while we fetch the available regions.</p>
                                </div>
                            )}
                            {error && (
                                <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-600 rounded-md">
                                    <p className="flex items-center">
                                        <X className="h-4 w-4 mr-2" />
                                        {error}
                                    </p>
                                    <p className="text-sm mt-1 pl-6">Please refresh the page or try again later.</p>
                                </div>
                            )}
                            <Form {...form}>
                                <form id="location-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="relative">
                                                <FormLabel className="text-base font-medium">Location Name</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input 
                                                            placeholder="e.g. Lusaka" 
                                                            {...field} 
                                                            className="h-11" 
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                // Filter locations based on input
                                                                const value = e.target.value.toLowerCase();
                                                                if (value.length > 0) {
                                                                    const filtered = locations.filter(
                                                                        location => location.name.toLowerCase().includes(value)
                                                                    );
                                                                    setLocationSuggestions(filtered);
                                                                    setShowSuggestions(true);
                                                                } else {
                                                                    setLocationSuggestions([]);
                                                                    setShowSuggestions(false);
                                                                }
                                                            }}
                                                            onFocus={() => {
                                                                if (field.value && field.value.length > 0) {
                                                                    const filtered = locations.filter(
                                                                        location => location.name.toLowerCase().includes(field.value.toLowerCase())
                                                                    );
                                                                    setLocationSuggestions(filtered);
                                                                    setShowSuggestions(true);
                                                                }
                                                            }}
                                                            onBlur={() => {
                                                                // Delay hiding suggestions to allow for clicks
                                                                setTimeout(() => {
                                                                    setShowSuggestions(false);
                                                                }, 200);
                                                            }}
                                                        />
                                                        {showSuggestions && locationSuggestions.length > 0 && (
                                                            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-slate-200 max-h-60 overflow-auto">
                                                                <ul className="py-1">
                                                                    {locationSuggestions.map((location) => (
                                                                        <li 
                                                                            key={location.id}
                                                                            className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                                                                            onClick={() => {
                                                                                // Set the location name
                                                                                field.onChange(location.name);
                                                                                // Set the region if available
                                                                                if (location.region) {
                                                                                    form.setValue('region', location.region);
                                                                                }
                                                                                // Store the selected location
                                                                                setSelectedLocation(location);
                                                                                setShowSuggestions(false);
                                                                            }}
                                                                        >
                                                                            <div className="font-medium">{location.name}</div>
                                                                            {location.region && (
                                                                                <div className="text-xs text-slate-500">{location.region}</div>
                                                                            )}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormDescription>The name of the city, town, or area</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="region"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-medium">Region</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11">
                                                            <SelectValue placeholder="Select a region" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {staticRegions.map((region) => (
                                                            <SelectItem key={region} value={region}>
                                                                {region}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>The province or region where this location is situated</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-medium">Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe this location and its property market..."
                                                        className="min-h-[150px] resize-y"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <div className="flex justify-between">
                                                    <FormDescription>
                                                        A brief description of the location and its real estate market
                                                    </FormDescription>
                                                    <p className="text-xs text-muted-foreground">{field.value.length}/500</p>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-base font-medium mb-1">Location Image</h3>
                                            <p className="text-sm text-muted-foreground">Upload a representative image for this location</p>
                                        </div>

                                        {imagePreview ? (
                                            <div className="relative rounded-lg border overflow-hidden transition-all duration-200 group hover:shadow-md">
                                                <div className="relative h-[250px] w-full overflow-hidden">
                                                    <Image
                                                        src={imagePreview || "/placeholder.svg"}
                                                        alt="Location preview"
                                                        fill
                                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={removeImage}
                                                                className="rounded-full"
                                                            >
                                                                <X className="h-4 w-4 mr-1" />
                                                                Remove
                                                            </Button>
                                                            <Button 
                                                                type="button" 
                                                                variant="secondary" 
                                                                size="sm" 
                                                                className="rounded-full"
                                                                onClick={() => {
                                                                    // Create a file input element
                                                                    const input = document.createElement('input');
                                                                    input.type = 'file';
                                                                    input.accept = 'image/*';
                                                                    input.onchange = (e) => handleImageUpload(e as React.ChangeEvent<HTMLInputElement>);
                                                                    input.click();
                                                                }}
                                                                disabled={isUploading}
                                                            >
                                                                {isUploading ? (
                                                                    <>
                                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                                        Uploading...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Upload className="h-4 w-4 mr-1" />
                                                                        Change
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                {...getRootProps()}
                                                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-all duration-200 ${
                                                    isDragActive ? "border-primary bg-primary/5" : "border-slate-200"
                                                }`}
                                            >
                                                <input {...getInputProps()} />
                                                {isUploading ? (
                                                    <div className="flex flex-col items-center">
                                                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                                                        <p className="text-sm font-medium">Uploading image...</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="mb-4 rounded-full bg-slate-100 p-3">
                                                            <Upload className="h-6 w-6 text-slate-500" />
                                                        </div>
                                                        <p className="mb-2 text-sm font-medium">Drag and drop an image here</p>
                                                        <p className="mb-4 text-xs text-muted-foreground">PNG, JPG or WEBP (max. 5MB)</p>
                                                        <Button type="button" variant="outline" className="rounded-full">
                                                            Browse Files
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <Separator className="my-8" />

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="featured"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base cursor-pointer">Featured Location</FormLabel>
                                                        <FormDescription>Display this location prominently on the website</FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            className="data-[state=checked]:bg-emerald-600"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="order"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">Display Order</FormLabel>
                                                        <FormDescription>Set the display priority (lower numbers appear first)</FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Input type="number" className="w-20 text-center" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="sticky top-6 border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b px-6">
                            <CardTitle>Location Preview</CardTitle>
                            <CardDescription>How this location will appear on your website</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div className="rounded-lg border overflow-hidden transition-all duration-200 hover:shadow-md">
                                    <div className="relative h-[200px] w-full overflow-hidden bg-slate-100">
                                        {imagePreview ? (
                                            <Image
                                                src={imagePreview || "/placeholder.svg"}
                                                alt="Location preview"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <Eye className="h-12 w-12 text-slate-300" />
                                            </div>
                                        )}
                                        {form.watch("featured") && (
                                            <div className="absolute right-3 top-3">
                                                <Badge className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 text-xs font-medium">
                                                    Featured
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">{form.watch("name") || "Location Name"}</h3>
                                            {form.watch("region") && (
                                                <Badge variant="outline" className="text-xs">
                                                    {form.watch("region")}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="flex items-center text-sm text-muted-foreground">
                                            <MapPin className="mr-1 h-3 w-3" /> 0 properties
                                        </p>
                                        <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                                            {form.watch("description") || "Location description will appear here..."}
                                        </p>
                                        <div className="mt-4 pt-3 border-t">
                                            <Button variant="outline" size="sm" className="w-full text-xs">
                                                View Properties
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-slate-50 p-5">
                                    <h4 className="mb-3 font-medium flex items-center">
                                        <Eye className="h-4 w-4 mr-2 text-slate-500" />
                                        Preview Notes
                                    </h4>
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        <li className="flex items-start">
                                            <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                                            This is how the location will appear on the website
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                                            Featured locations appear in the sidebar and homepage
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                                            Property count will update as properties are added
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
