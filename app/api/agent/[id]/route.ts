import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(await params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid agent ID" },
        { status: 400 }
      );
    }

    const agent = await prisma.agent.findUnique({
      where: {
        id: id,
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
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Get the total count of properties for this agent
    const propertiesCount = await prisma.property.count({
      where: {
        agentId: id,
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
