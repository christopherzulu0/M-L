import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/testimonials
export async function GET(request: NextRequest) {
  try {
    // Get all testimonials - for development we'll show all including unapproved ones
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    // Format testimonials for response
    const formattedTestimonials = testimonials.map((testimonial) => ({
      id: testimonial.id,
      name: testimonial.name,
      role: testimonial.role,
      comment: testimonial.comment,
      rating: testimonial.rating,
      image: testimonial.image || testimonial.user?.profileImage || "/placeholder.svg",
      createdAt: testimonial.createdAt,
    }));

    return NextResponse.json(formattedTestimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/testimonials
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, comment, rating, image, userId } = body;

    // Validate required fields
    if (!name || !role || !comment) {
      return NextResponse.json(
        { error: "Name, role, and comment are required" },
        { status: 400 }
      );
    }

    // Create new testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        comment,
        rating: rating || 5,
        image,
        userId: userId || null,
        // For development, auto-approve testimonials so they show up immediately
        isApproved: true,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
