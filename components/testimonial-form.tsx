"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StarRating } from "@/components/star-rating"
import { useSubmitTestimonial, TestimonialInput } from "@/hooks/useTestimonials"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

interface TestimonialFormProps {
  onSuccess?: () => void
  className?: string
}

export function TestimonialForm({ onSuccess, className = "" }: TestimonialFormProps) {
  const { isLoaded, isSignedIn, user } = useUser()
  const [formData, setFormData] = useState<TestimonialInput>({
    name: "",
    role: "",
    comment: "",
    rating: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dbUser, setDbUser] = useState<{ id: number } | null>(null)

  const { mutate: submitTestimonial } = useSubmitTestimonial()

  // Fetch user from database when Clerk user is available
  useEffect(() => {
    async function fetchUser() {
      if (isLoaded && isSignedIn && user) {
        try {
          // First set the name from Clerk
          setFormData(prevData => ({
            ...prevData,
            name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            role: "Property Client",
          }))

          // Then fetch the user from our database
          const response = await fetch(`/api/users/check?clerkId=${user.id}`)
          const data = await response.json()

          if (data.exists && data.user) {
            setDbUser(data.user)
            // Update form data with the database user ID
            setFormData(prevData => ({
              ...prevData,
              userId: data.user.id
            }))
          }
        } catch (error) {
          console.error("Error fetching user:", error)
        }
      }
    }

    fetchUser()
  }, [isLoaded, isSignedIn, user])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Make sure to include the user ID if available
      const testimonialData = {
        ...formData,
        // If we have a database user, use that ID
        userId: dbUser?.id || formData.userId
      }

      await submitTestimonial(testimonialData, {
        onSuccess: () => {
          toast.success("Thank you for your testimonial! It will be reviewed shortly.")

          // Reset only the comment and rating if user is signed in
          if (isSignedIn && user) {
            setFormData(prev => ({
              ...prev,
              comment: "",
              rating: 5,
            }))
          } else {
            // Reset all fields if not signed in
            setFormData({
              name: "",
              role: "",
              comment: "",
              rating: 5,
            })
          }

          if (onSuccess) onSuccess()
        },
        onError: (error) => {
          toast.error(error.message || "Failed to submit testimonial")
        },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
          readOnly={isSignedIn && user}
          className={isSignedIn && user ? "bg-gray-100" : ""}
        />
        {isSignedIn && user && (
          <p className="mt-1 text-xs text-muted-foreground">Using your account name</p>
        )}
      </div>

      <div>
        <Label htmlFor="role">Your Role</Label>
        <Input
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Property Buyer, Seller, etc."
          required
          readOnly={isSignedIn && user}
          className={isSignedIn && user ? "bg-gray-100" : ""}
        />
        {isSignedIn && user && (
          <p className="mt-1 text-xs text-muted-foreground">Using your account role</p>
        )}
      </div>

      <div>
        <Label htmlFor="comment">Your Experience</Label>
        <Textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Share your experience with us..."
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="rating">Rating</Label>
        <div className="mt-1">
          <StarRating
            rating={formData.rating || 5}
            onRatingChange={handleRatingChange}
            editable
            className="text-yellow-500"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full gradient-bg text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Testimonial"}
      </Button>
    </form>
  )
}
