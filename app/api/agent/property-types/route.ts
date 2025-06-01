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
                propertyType: true
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

    // Count properties by property type
    const propertyTypeCounts = new Map();

    if (user.agent.properties && user.agent.properties.length > 0) {
      user.agent.properties.forEach(property => {
        if (property.propertyType) {
          const typeName = property.propertyType.name;
          propertyTypeCounts.set(typeName, (propertyTypeCounts.get(typeName) || 0) + 1);
        }
      });
    }

    // Format the property type data
    const propertyTypeData = Array.from(propertyTypeCounts.entries()).map(([name, value]) => ({
      name,
      value,
      color: getColorForPropertyType(name)
    }));

    // If no properties found, return empty array
    if (propertyTypeData.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(propertyTypeData);
  } catch (error) {
    console.error("Error fetching property types:", error);
    return NextResponse.json(
      { error: "Failed to fetch property types" },
      { status: 500 }
    );
  }
}

// Helper function to assign consistent colors to property types
function getColorForPropertyType(typeName: string): string {
  const colorMap: Record<string, string> = {
    "Apartment": "#4F46E5",
    "House": "#10B981",
    "Villa": "#8B5CF6",
    "Land": "#F59E0B",
    "Commercial": "#EC4899",
    "Office": "#3B82F6",
    "Retail": "#EF4444",
    "Industrial": "#F97316",
    "Warehouse": "#A855F7",
  };

  // Default color for unknown property types
  return colorMap[typeName] || "#6B7280";
}
