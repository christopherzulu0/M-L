import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

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

    // Get the current date
    const currentDate = new Date();

    // Get the date 8 months ago
    const eightMonthsAgo = new Date();
    eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

    // Format the date to YYYY-MM-DD
    const formattedEightMonthsAgo = eightMonthsAgo.toISOString().split('T')[0];

    // Get agent analytics data for the last 8 months
    const agentAnalytics = await prisma.agentAnalytics.findMany({
      where: {
        agentId: agent.id,
        date: {
          gte: new Date(formattedEightMonthsAgo),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Group analytics by month
    const monthlyPerformance = [];
    const monthMap = {};

    agentAnalytics.forEach(analytic => {
      const date = new Date(analytic.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthMap[monthYear]) {
        monthMap[monthYear] = {
          name: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString('default', { month: 'short' }),
          sales: 0,
          commission: 0,
          listings: 0,
        };
      }

      monthMap[monthYear].sales += Number(analytic.revenue);
      monthMap[monthYear].commission += Number(analytic.revenue) * 0.05; // Assuming 5% commission
      monthMap[monthYear].listings += analytic.listingsAdded;
    });

    // Convert the map to an array
    for (const key in monthMap) {
      monthlyPerformance.push(monthMap[key]);
    }

    // Return empty array if no data is found
    if (monthlyPerformance.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(monthlyPerformance);
  } catch (error) {
    console.error("Error fetching agent performance:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent performance" },
      { status: 500 }
    );
  }
}
