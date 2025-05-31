import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  comment: string;
  rating: number;
  image: string;
  createdAt: string;
}

interface TestimonialInput {
  name: string;
  role: string;
  comment: string;
  rating?: number;
  image?: string;
  userId?: number;
}

// Fetch testimonials
async function fetchTestimonials(): Promise<Testimonial[]> {
  const response = await fetch("/api/testimonials");
  if (!response.ok) {
    throw new Error("Failed to fetch testimonials");
  }
  return response.json();
}

// Submit a new testimonial
async function submitTestimonial(testimonial: TestimonialInput): Promise<Testimonial> {
  const response = await fetch("/api/testimonials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testimonial),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to submit testimonial");
  }

  return response.json();
}

// Hook for fetching testimonials
export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });
}

// Hook for submitting a new testimonial
export function useSubmitTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitTestimonial,
    onSuccess: () => {
      // Invalidate the testimonials query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

export type { Testimonial, TestimonialInput };
