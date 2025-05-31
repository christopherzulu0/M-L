import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

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
      include: {
        user: true,
        properties: {
          include: {
            location: true,
            propertyType: true,
            listingType: true,
            media: {
              where: {
                mediaType: "image",
              },
              take: 1,
            },
          },
          take: 3, // Limit to 3 properties for the preview
        },
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found for this user" },
        { status: 404 }
      );
    }

    // Get the total count of properties for this agent
    const propertiesCount = await prisma.property.count({
      where: {
        agentId: agent.id,
      },
    });

    // Transform the data to match the expected format for the agent detail page
    const formattedAgent = {
      id: agent.id,
      name: `${agent.user.firstName} ${agent.user.lastName}`,
      agency: "Real Estate Agency", // Default agency name since it's not in the schema
      image: agent.user.profileImage || "/placeholder.svg", // Fallback to placeholder if no image
      email: agent.user.email,
      phone: agent.user.phone || "Not provided",
      address: "Not provided", // Address is not in the schema
      website: "Not provided", // Website is not in the schema
      bio: agent.bio || "Real estate professional",
      specialization: agent.specialization || "Real Estate",
      licenseNumber: agent.licenseNumber || "Not provided",
      rating: Number(agent.rating) || 0,
      ratingLabel: getRatingLabel(agent.rating),
      verified: agent.status === "active",
      joinDate: agent.joinDate,
      totalSales: agent.totalSales,
      totalListings: propertiesCount, // Use the actual count of properties
      totalRevenue: Number(agent.totalRevenue) || 0,
      properties: agent.properties.map(property => ({
        id: property.id,
        title: property.title,
        price: Number(property.price),
        address: property.address,
        location: property.location.name,
        bedrooms: property.bedrooms || 0,
        bathrooms: Number(property.bathrooms) || 0,
        squareFeet: Number(property.squareFeet) || 0,
        propertyType: property.propertyType.name,
        listingType: property.listingType.name,
        image: property.media[0]?.filePath || "/placeholder.svg",
        createdAt: property.createdAt,
      })),
      // Add performance data
      performance: {
        totalSales: formatCurrency(agent.totalSales || 0),
        totalCommission: formatCurrency(agent.totalRevenue || 0),
        activeListings: propertiesCount,
        soldProperties: agent.soldProperties || 0,
        pendingDeals: agent.pendingDeals || 0,
        conversionRate: agent.conversionRate || 0,
      },
      // Add goals data (placeholder values, could be stored in the database)
      goals: {
        salesTarget: formatCurrency(agent.salesTarget || 0),
        salesProgress: calculateProgress(agent.totalSales || 0, agent.salesTarget || 0),
        listingsTarget: agent.listingsTarget || 0,
        listingsProgress: calculateProgress(propertiesCount, agent.listingsTarget || 0),
        clientsTarget: agent.clientsTarget || 0,
        clientsProgress: calculateProgress(agent.clientsCount || 0, agent.clientsTarget || 0),
      },
    };

    return NextResponse.json(formattedAgent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent" },
      { status: 500 }
    );
  }
}

// Helper function to determine rating label based on rating value
function getRatingLabel(rating: any): string {
  if (!rating) return "Not rated";

  const numRating = Number(rating);
  if (numRating >= 4.5) return "Excellent";
  if (numRating >= 4) return "Very Good";
  if (numRating >= 3) return "Average";
  return "Fair";
}

// Helper function to format currency
function formatCurrency(value: number): string {
  return `ZMW ${value.toLocaleString()}`;
}

// Helper function to calculate progress percentage
function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}
