import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
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

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Find the user with the clerk ID
    const user = await prisma.user.findFirst({
      where: {
        clerkid: session.userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Find the agent associated with this user
    const agent = await prisma.agent.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found for this user" },
        { status: 404 }
      );
    }

    // Build the where clause for the query
    const whereClause: any = {
      agentId: agent.id,
    };

    // Add status filter if provided
    if (status) {
      whereClause.status = status;
    }

    // Get properties for this agent with pagination
    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        propertyType: true,
        listingType: true,
        location: true,
        media: {
          where: {
            mediaType: "image",
          },
          take: 1,
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get total count for pagination
    const totalCount = await prisma.property.count({
      where: whereClause,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Transform the data to match the expected format for the listings tab
    const formattedProperties = properties.map((property) => ({
      id: property.id,
      title: property.title,
      address: property.address,
      price: formatPrice(Number(property.price), property.priceType),
      type: property.propertyType.name,
      status: property.status,
      image: property.media[0]?.filePath || "/placeholder.svg",
      beds: property.bedrooms || 0,
      baths: Number(property.bathrooms) || 0,
      sqft: Number(property.squareFeet) || 0,
      views: property.views || 0,
      inquiries: 0, // This would need to be calculated from inquiries table
      daysListed: getDaysListed(property.createdAt),
      location: property.location.name,
    }));

    // Return empty array if no data is found
    if (formattedProperties.length === 0 && page === 1) {
      return NextResponse.json({
        properties: [],
        pagination: {
          totalCount: 0,
          totalPages: 0,
          currentPage: 1,
          limit,
        },
      });
    }

    return NextResponse.json({
      properties: formattedProperties,
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
