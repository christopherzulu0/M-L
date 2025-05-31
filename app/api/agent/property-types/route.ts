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
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found for this user" },
        { status: 404 }
      );
    }

    // Get all property types
    const propertyTypes = await prisma.propertyType.findMany();

    // Get the count of properties for each property type for this agent
    const propertyTypeCounts = await Promise.all(
      propertyTypes.map(async (type) => {
        const count = await prisma.property.count({
          where: {
            agentId: agent.id,
            propertyTypeId: type.id,
          },
        });

        return {
          name: type.name,
          value: count,
          // Assign a color based on the property type name for consistency
          color: getColorForPropertyType(type.name),
        };
      })
    );

    // Filter out property types with zero properties
    const filteredPropertyTypes = propertyTypeCounts.filter(
      (type) => type.value > 0
    );

    // Return empty array if no data is found
    if (filteredPropertyTypes.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(filteredPropertyTypes);
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
