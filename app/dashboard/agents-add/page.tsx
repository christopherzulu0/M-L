"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import Image from "next/image"
import { User, Mail, Phone, Briefcase, Calendar, Award, DollarSign, Upload, CheckCircle, AlertCircle, ArrowLeft, Save, X } from 'lucide-react'
import { useUploadThing } from '@/lib/uploadthing'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the form schema with Zod
const agentFormSchema = z.object({
  // User information
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().optional(),

  // Agent information
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
  specialization: z.string().min(2, { message: "Please select or enter a specialization" }),
  licenseNumber: z.string().min(2, { message: "License number is required" }),
  commissionRate: z.coerce.number().min(0).max(100, { message: "Commission rate must be between 0 and 100" }),
  joinDate: z.date({ required_error: "Please select a join date" }),
  status: z.enum(["active", "inactive", "on leave"], { required_error: "Please select a status" }),

  // New fields
  serviceAreas: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  socialMediaLinks: z.object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional().default({}),

  // Optional fields
  rating: z.coerce.number().min(0).max(5, { message: "Rating must be between 0 and 5" }).optional(),
  existingUser: z.boolean().default(false),
  userId: z.string().optional(),
  createAccount: z.boolean().default(true),
  sendWelcomeEmail: z.boolean().default(true),
})

type AgentFormValues = z.infer<typeof agentFormSchema>

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  profileImage: string | null
}

export default function AddAgentPage() {
  const router = useRouter()
  const { startUpload } = useUploadThing("agentProfileUploader")
  const [activeTab, setActiveTab] = useState("account")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [existingUsers, setExistingUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  // Fetch existing users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true)
      try {
        const response = await fetch('/api/users')
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        setExistingUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
        setFormError('Failed to load existing users')
      } finally {
        setIsLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [])

  // Default values for the form
  const defaultValues: Partial<AgentFormValues> = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    specialization: "",
    licenseNumber: "",
    commissionRate: 2.5,
    joinDate: new Date(),
    status: "active",
    serviceAreas: [],
    languages: [],
    socialMediaLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: ""
    },
    rating: 0,
    existingUser: false,
    createAccount: true,
    sendWelcomeEmail: true,
  }

  // Initialize the form
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues,
    mode: "onChange",
  })

  // Watch for form value changes
  const watchExistingUser = form.watch("existingUser")
  const watchCreateAccount = form.watch("createAccount")

  // Add a new function to handle user selection
  const handleUserSelection = (userId: string) => {
    const selectedUser = existingUsers.find(user => user.id === Number(userId))
    if (selectedUser) {
      form.setValue('firstName', selectedUser.firstName)
      form.setValue('lastName', selectedUser.lastName)
      form.setValue('email', selectedUser.email)
      form.setValue('phone', selectedUser.phone || '')
    }
  }

  // Handle form submission
  const onSubmit = async (data: AgentFormValues) => {
    setIsSubmitting(true)
    setFormError(null)
    setFormSuccess(null)

    try {
      let finalProfileImage = profileImage

      // Handle image upload if a new file was selected
      if (profileImageFile) {
        setIsUploading(true)
        try {
          const uploadResult = await startUpload([profileImageFile])
          if (uploadResult && uploadResult[0]) {
            finalProfileImage = uploadResult[0].url
          }
        } catch (error) {
          console.error('Error uploading image:', error)
          setUploadError('Failed to upload profile image')
          setIsUploading(false)
          return
        }
        setIsUploading(false)
      }

      // Prepare the request data based on whether we're using an existing user
      const requestData = watchExistingUser ? {
        // For existing user
        existingUser: true,
        userId: data.userId,
        phone: data.phone,
        profileImage: finalProfileImage,
        bio: data.bio,
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
        commissionRate: data.commissionRate,
        joinDate: data.joinDate,
        status: data.status,
        rating: data.rating,
        address: data.address,
        serviceAreas: data.serviceAreas,
        languages: data.languages,
        socialMediaLinks: data.socialMediaLinks
      } : {
        // For new user
        createAccount: true,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        profileImage: finalProfileImage,
        bio: data.bio,
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
        commissionRate: data.commissionRate,
        joinDate: data.joinDate,
        status: data.status,
        rating: data.rating,
        address: data.address,
        serviceAreas: data.serviceAreas,
        languages: data.languages,
        socialMediaLinks: data.socialMediaLinks
      }

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create agent')
      }

      setFormSuccess('Agent has been successfully added!')

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setFormError(error instanceof Error ? error.message : 'There was an error adding the agent. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setProfileImageFile(file)

    // Preview the image
    const reader = new FileReader()
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    window.scrollTo(0, 0)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Add New Agent</h1>
          <p className="text-muted-foreground">Create a new agent profile in the system</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard/agents")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agents
        </Button>
      </div>

      {formError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      {formSuccess && (
        <Alert className="mb-6 border-green-500 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{formSuccess}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Form */}
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Information</CardTitle>
                  <CardDescription>
                    Enter the details for the new agent. All fields marked with * are required.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className={`grid w-full ${watchExistingUser ? 'grid-cols-2' : 'grid-cols-3'}`}>
                      <TabsTrigger value="account">Account</TabsTrigger>
                      <TabsTrigger value="professional">Professional</TabsTrigger>
                      {!watchExistingUser && <TabsTrigger value="basic">Basic Info</TabsTrigger>}
                    </TabsList>

                    {/* Basic Information Tab */}
                    {!watchExistingUser && (
                      <TabsContent value="basic" className="space-y-4 pt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address *</FormLabel>
                                <FormControl>
                                  <Input placeholder="john.doe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="+260 97 1234567" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>


                        <div className="flex justify-end">
                          <Button type="button" onClick={() => handleTabChange("professional")}>
                            Continue to Professional Info
                          </Button>
                        </div>
                      </TabsContent>
                    )}

                    {/* Professional Information Tab */}
                    <TabsContent value="professional" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter a professional bio for the agent"
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Describe the agent's experience, background, and expertise.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specialization *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a specialization" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Residential">Residential Properties</SelectItem>
                                <SelectItem value="Commercial">Commercial Properties</SelectItem>
                                <SelectItem value="Luxury">Luxury Properties</SelectItem>
                                <SelectItem value="New Developments">New Developments</SelectItem>
                                <SelectItem value="Land">Land</SelectItem>
                                <SelectItem value="Rentals">Rental Properties</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The agent's primary area of expertise
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="licenseNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>License Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="RE-12345-ZM" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="commissionRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Commission Rate (%) *</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" min="0" max="100" {...field} />
                              </FormControl>
                              <FormDescription>
                                Standard commission percentage for this agent
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="joinDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Join Date *</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className="w-full pl-3 text-left font-normal"
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                  <SelectItem value="on leave">On Leave</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St, Lusaka, Zambia" {...field} />
                            </FormControl>
                            <FormDescription>
                              The agent's physical address
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Service Areas</h3>
                        <FormField
                          control={form.control}
                          name="serviceAreas"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service Areas</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter service areas separated by semicolons (e.g., Lusaka; Ndola; Kitwe)"
                                  value={field.value?.join("; ") || ""}
                                  onChange={(e) => {
                                    const areas = e.target.value.split(";").map(area => area.trim()).filter(Boolean);
                                    field.onChange(areas);
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Areas where the agent provides services
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Languages</h3>
                        <FormField
                          control={form.control}
                          name="languages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Languages</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter languages separated by semicolons (e.g., English; Bemba; Nyanja)"
                                  value={field.value?.join("; ") || ""}
                                  onChange={(e) => {
                                    const langs = e.target.value.split(";").map(lang => lang.trim()).filter(Boolean);
                                    field.onChange(langs);
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Languages spoken by the agent
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Social Media Links</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="socialMediaLinks.facebook"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Facebook</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://facebook.com/username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="socialMediaLinks.twitter"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Twitter</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://twitter.com/username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="socialMediaLinks.instagram"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Instagram</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://instagram.com/username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="socialMediaLinks.linkedin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://linkedin.com/in/username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Initial Rating (0-5)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Optional: Set an initial rating for the agent
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => handleTabChange("basic")}>
                          Back to Basic Info
                        </Button>
                        <Button type="button" onClick={() => handleTabChange("account")}>
                          Continue to Account Setup
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Account Setup Tab */}
                    <TabsContent value="account" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="existingUser"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Existing User</FormLabel>
                              <FormDescription>
                                Is this agent already a user in the system?
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {watchExistingUser && (
                        <>
                          <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Select User</FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value)
                                    handleUserSelection(value)
                                  }}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select an existing user" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {isLoadingUsers ? (
                                      <SelectItem value="loading" disabled>
                                        Loading users...
                                      </SelectItem>
                                    ) : existingUsers.length > 0 ? (
                                      existingUsers.map((user) => (
                                        <SelectItem key={user.id} value={String(user.id)}>
                                          {user.firstName} {user.lastName} ({user.email})
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem value="no-users" disabled>
                                        No users available
                                      </SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Select an existing user to convert to an agent
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="+260 97 1234567" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Update the phone number if needed
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => handleTabChange("professional")}>
                          Back to Professional Info
                        </Button>

                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Agent"}
                  </Button>
                </CardFooter>
              </Card>

              <div className="space-y-4">
                <FormLabel>Profile Picture</FormLabel>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-image"
                    />
                    <label
                      htmlFor="profile-image"
                      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      Recommended size: 400x400px
                    </p>
                  </div>
                </div>
                {uploadError && (
                  <p className="text-sm text-red-500">{uploadError}</p>
                )}
              </div>
            </form>
          </Form>
        </div>

        {/* Preview Panel */}
        <div className="md:col-span-1">
          <div className="sticky top-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Preview</CardTitle>
                <CardDescription>
                  Preview how the agent profile will appear
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={profileImage || ""} alt="Profile preview" />
                    <AvatarFallback className="text-lg">
                      {form.watch("firstName")?.[0]}{form.watch("lastName")?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {/* <div className="absolute -bottom-2 -right-2 rounded-full bg-white p-1 shadow-md">
                    <label htmlFor="profile-image" className="cursor-pointer">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200">
                        <Upload className="h-4 w-4" />
                      </div>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div> */}
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mb-4 w-full">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="mt-1 text-xs text-muted-foreground">Uploading: {uploadProgress}%</p>
                  </div>
                )}

                <h3 className="text-xl font-semibold">
                  {form.watch("firstName") || "First"} {form.watch("lastName") || "Last"}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {form.watch("specialization") || "Specialization"}
                </p>

                <Badge
                  className={`mt-2 ${
                    form.watch("status") === "active" 
                      ? "bg-green-100 text-green-800" 
                      : form.watch("status") === "inactive" 
                        ? "bg-gray-100 text-gray-800" 
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {form.watch("status") === "active"
                    ? "Active"
                    : form.watch("status") === "inactive"
                      ? "Inactive"
                      : "On Leave"}
                </Badge>

                <div className="mt-4 w-full space-y-3 text-left">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate">{form.watch("email") || "email@example.com"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{form.watch("phone") || "+260 97 1234567"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{form.watch("licenseNumber") || "License #"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {form.watch("joinDate") ? format(form.watch("joinDate"), "PPP") : "Join Date"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{form.watch("commissionRate") || "0"}% Commission</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Rating: {form.watch("rating") || "0"}/5
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="w-full">
                  <h4 className="mb-2 text-sm font-medium">Bio</h4>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {form.watch("bio") || "Agent bio will appear here..."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Help & Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Add a professional bio highlighting the agent's experience and expertise.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Upload a high-quality professional photo (recommended size: 400x400px).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Verify the license number is correct and up-to-date.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Set an appropriate commission rate based on company policy.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p>Uploading profile image...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
