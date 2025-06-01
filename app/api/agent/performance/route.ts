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

    // Get the current date and calculate the start of the year
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const currentMonthIndex = now.getMonth();

    // Group sales by month and calculate monthly performance
    const monthlySales = new Map();
    const monthlyListings = new Map();

    // Initialize all months with zero values
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    months.forEach(month => {
      monthlySales.set(month, 0);
      monthlyListings.set(month, 0);
    });

    // Distribute total sales across months based on properties sold
    const totalSales = user.agent.totalSales || 0;
    const soldProperties = user.agent.properties ? user.agent.properties.filter(p => p.status === 'sold') : [];

    // If there are sold properties, distribute sales based on their dates
    if (soldProperties.length > 0) {
      const salesPerProperty = totalSales / soldProperties.length;

      soldProperties.forEach(property => {
        if (property.soldRentedAt && property.soldRentedAt >= startOfYear) {
          const month = months[new Date(property.soldRentedAt).getMonth()];
          monthlySales.set(month, monthlySales.get(month) + salesPerProperty);
        }
      });
    } else {
      // If no sold properties, distribute sales evenly across months
      const salesPerMonth = totalSales / (currentMonthIndex + 1);
      for (let i = 0; i <= currentMonthIndex; i++) {
        monthlySales.set(months[i], salesPerMonth);
      }
    }

    // Process listings data
    if (user.agent.properties && user.agent.properties.length > 0) {
      user.agent.properties.forEach(property => {
        if (property.createdAt && property.createdAt >= startOfYear) {
          const month = months[new Date(property.createdAt).getMonth()];
          monthlyListings.set(month, monthlyListings.get(month) + 1);
        }
      });
    }

    // Calculate commission based on sales (assuming 5% commission rate or use agent's rate)
    const commissionRate = user.agent.commissionRate || 0.05;

    // Format the performance data
    const performanceData = months.map(month => ({
      name: month,
      sales: monthlySales.get(month),
      commission: monthlySales.get(month) * commissionRate,
      listings: monthlyListings.get(month)
    }));

    // Only include months up to the current month
    const filteredPerformanceData = performanceData.slice(0, currentMonthIndex + 1);

    return NextResponse.json(filteredPerformanceData);
  } catch (error) {
    console.error("Error fetching agent performance:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent performance" },
      { status: 500 }
    );
  }
}
