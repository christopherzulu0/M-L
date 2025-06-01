import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params is properly awaited
    const { id: paramId } = params;
    const id = parseInt(paramId);

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
      phone: agent.user.phone || null,
      address: agent.address || "123 Main Street, Lusaka, Zambia", // Use agent's address or default
      website: "https://www.example.com", // Default website since it's not in the schema
      bio: agent.bio || null,
      specialization: agent.specialization || null,
      licenseNumber: agent.licenseNumber || null,
      rating: Number(agent.rating) || null,
      ratingLabel: agent.rating ? getRatingLabel(agent.rating) : null,
      verified: agent.status === "active",
      joinDate: agent.joinDate,
      totalSales: agent.totalSales,
      totalListings: propertiesCount, // Use the actual count of properties
      totalRevenue: Number(agent.totalRevenue) || 0,
      serviceAreas: agent.serviceAreas || [],
      languages: agent.languages || [],
      socialMediaLinks: agent.socialMediaLinks || {},

      // Include the complete user schema
      user: {
        id: agent.user.id,
        clerkid: agent.user.clerkid,
        email: agent.user.email,
        firstName: agent.user.firstName,
        lastName: agent.user.lastName,
        phone: agent.user.phone,
        role: agent.user.role,
        profileImage: agent.user.profileImage,
        createdAt: agent.user.createdAt,
        updatedAt: agent.user.updatedAt,
        lastLogin: agent.user.lastLogin,
        status: agent.user.status,
        emailVerified: agent.user.emailVerified
      },

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
