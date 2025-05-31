"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { useTestimonials } from "@/hooks/useTestimonials"
import { TestimonialForm } from "@/components/testimonial-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function TestimonialsDisplay() {
  const { data: testimonials, isLoading, error } = useTestimonials()
  const [isFormOpen, setIsFormOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Failed to load testimonials. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <div className="grid gap-8 md:grid-cols-3">
        {testimonials && testimonials.length > 0 ? (
          testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} className="rounded-2xl bg-white p-8 card-shadow subtle-border">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-200">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="mb-6 text-muted-foreground">"{testimonial.comment}"</p>
              <StarRating rating={testimonial.rating} className="text-yellow-500" />
            </div>
          ))
        ) : (
          // Fallback to placeholder testimonials if none are available
          [1, 2, 3].map((index) => (
            <div key={index} className="rounded-2xl bg-white p-8 card-shadow subtle-border">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-200">
                  <Image
                    src="/placeholder.svg"
                    alt="Client"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Client Name</h4>
                  <p className="text-sm text-muted-foreground">Property Buyer</p>
                </div>
              </div>
              <p className="mb-6 text-muted-foreground">
                "Amazing experience working with this team. They helped me find my dream home within my budget. Highly
                recommended!"
              </p>
              <StarRating rating={5} label="Excellent" className="text-yellow-500" />
            </div>
          ))
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-bg text-white">Share Your Experience</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Share Your Experience</DialogTitle>
            </DialogHeader>
            <TestimonialForm
              onSuccess={() => setIsFormOpen(false)}
              className="mt-4"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
