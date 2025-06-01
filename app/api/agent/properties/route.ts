import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@/lib/generated/prisma';
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const status = url.searchParams.get("status") || undefined;

    // Fetch the user data from the database using the session userId
    const user = await prisma.user.findFirst({
      where: {
        clerkid: session.userId
      },
      include: {
        agent: {
          include: {
            properties: {
              include: {
                location: true,
                propertyType: true,
                inquiries: true,
                views: true
              }
            }
          }
        }
      }
    });

    if (!user || !user.agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Format the properties data
    const properties = user.agent.properties ? user.agent.properties.map(property => {
      // Calculate days listed
      const daysListed = property.createdAt ? getDaysListed(property.createdAt) : 0;

      // Count views and inquiries
      const viewCount = property.views ? property.views.length : 0;
      const inquiryCount = property.inquiries ? property.inquiries.length : 0;

      return {
        id: property.id,
        title: property.title,
        address: property.address,
        price: formatPrice(property.price, property.priceType || 'sale'),
        type: property.propertyType ? property.propertyType.name : 'Unknown',
        status: property.status || 'active',
        image: property.featuredImage || "/placeholder.svg",
        beds: property.bedrooms || 0,
        baths: property.bathrooms || 0,
        sqft: property.squareFeet || 0,
        views: viewCount,
        inquiries: inquiryCount,
        daysListed,
        location: property.location ? property.location.name : 'Unknown'
      };
    }) : [];

    // Apply status filter if provided
    let filteredProperties = properties;
    if (status) {
      filteredProperties = properties.filter(prop => prop.status === status);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    // Calculate pagination values
    const totalCount = filteredProperties.length;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      properties: paginatedProperties,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching agent properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent properties" },
      { status: 500 }
    );
  }
}

// Helper function to format price based on price type
function formatPrice(price: number, priceType: string): string {
  const formattedPrice = price.toLocaleString();

  if (priceType === "monthly") {
    return `ZMW ${formattedPrice}/mo`;
  } else if (priceType === "yearly") {
    return `ZMW ${formattedPrice}/yr`;
  } else {
    return `ZMW ${formattedPrice}`;
  }
}

// Helper function to calculate days listed
function getDaysListed(createdAt: Date): number {
  const now = new Date();
  const created = new Date(createdAt);
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
