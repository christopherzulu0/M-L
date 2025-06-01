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
            properties: true
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

    // Calculate performance metrics
    const totalSales = user.agent.totalSales || 0;
    const totalCommission = totalSales * (user.agent.commissionRate || 0.05); // Default 5% commission
    const activeListings = user.agent.properties ? user.agent.properties.filter(p => p.status === 'active').length : 0;
    const soldProperties = user.agent.properties ? user.agent.properties.filter(p => p.status === 'sold').length : 0;
    const pendingDeals = user.agent.properties ? user.agent.properties.filter(p => p.status === 'pending').length : 0;
    const totalListings = user.agent.properties ? user.agent.properties.length : 0;
    const conversionRate = totalListings > 0 ? Math.round((soldProperties / totalListings) * 100) : 0;

    // Format the agent data
    const agentData = {
      id: user.agent.id,
      name: `${user.firstName} ${user.lastName}`,
      agency: "Independent",
      image: user.profileImage || "/placeholder.svg",
      email: user.email,
      phone: user.phone || "",
      address: "123 Main Street, Lusaka, Zambia", // Default address since it's not in the schema
      website: "https://www.example.com", // Default website since it's not in the schema
      bio: user.agent.bio || "",
      specialization: user.agent.specialization || "",
      licenseNumber: user.agent.licenseNumber || "",
      rating: user.agent.rating || null,
      reviews: 0, // Default value since reviewCount is not in the schema
      verified: user.agent.status === "active",
      joinDate: user.agent.joinDate || user.createdAt,
      badges: [], // Default value since badges is not in the schema
      clientsCount: 0,

      // Include the complete user schema
      user: {
        id: user.id,
        clerkid: user.clerkid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin,
        status: user.status,
        emailVerified: user.emailVerified
      },

      // Performance metrics
      performance: {
        totalSales: formatCurrency(totalSales),
        totalCommission: formatCurrency(totalCommission),
        activeListings,
        soldProperties,
        pendingDeals,
        conversionRate,
        salesTrend: null, // Default value since salesTrend is not in the schema
        commissionTrend: null, // Default value since commissionTrend is not in the schema
        listingsTrend: null, // Default value since listingsTrend is not in the schema
        soldTrend: null, // Default value since soldTrend is not in the schema
        pendingTrend: null, // Default value since pendingTrend is not in the schema
        conversionTrend: null, // Default value since conversionTrend is not in the schema
      },

      // Goals
      goals: {
        salesTarget: formatCurrency(totalSales * 1.2), // Default target is 20% more than current sales
        salesProgress: calculateProgress(totalSales, totalSales * 1.2),
        listingsTarget: activeListings + 5, // Default target is 5 more than current active listings
        listingsProgress: calculateProgress(activeListings, activeListings + 5),
        clientsTarget: 10, // Default target
        clientsProgress: calculateProgress(0, 10),
      },
    };

    return NextResponse.json(agentData);
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
