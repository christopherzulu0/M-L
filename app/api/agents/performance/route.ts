import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  // Get the period from the query parameters
  const url = new URL(request.url);
  const period = url.searchParams.get('period') || 'This Month';
  try {
    // Get top 5 agents by rating
    const agents = await prisma.agent.findMany({
      include: {
        user: true,
      },
      orderBy: {
        rating: 'desc',
      },
      take: 5,
    });

    // Calculate date range based on the selected period
    const currentDate = new Date();
    let startDate = new Date();

    switch(period) {
      case 'This Week':
        // Set to the beginning of the current week (Sunday)
        startDate.setDate(currentDate.getDate() - currentDate.getDay());
        break;
      case 'This Month':
        // Set to the beginning of the current month
        startDate.setDate(1);
        break;
      case 'Last 3 Months':
        // Set to 3 months ago
        startDate.setMonth(currentDate.getMonth() - 3);
        break;
      case 'This Year':
        // Set to the beginning of the current year
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        break;
      case 'All Time':
        // No date filtering
        startDate = new Date(0); // January 1, 1970
        break;
      default:
        // Default to This Month
        startDate.setDate(1);
    }

    // Format dates for Prisma query
    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = currentDate.toISOString();

    // Get property counts for all agents with date filtering
    const propertyCounts = await Promise.all(
      agents.map(agent => 
        prisma.property.count({
          where: {
            agentId: agent.id,
            createdAt: {
              gte: formattedStartDate,
              lte: formattedEndDate
            }
          },
        })
      )
    );

    // Get count of SOLD properties for all agents with date filtering
    const soldPropertyCounts = await Promise.all(
      agents.map(agent => 
        prisma.property.count({
          where: {
            agentId: agent.id,
            status: "SOLD",
            updatedAt: {
              gte: formattedStartDate,
              lte: formattedEndDate
            }
          },
        })
      )
    );

    // Calculate sales amount (in millions) based on sold properties
    // Assuming average property value of 500,000 ZMW
    const averagePropertyValue = 500000;
    const salesAmounts = soldPropertyCounts.map(count => 
      parseFloat(((count * averagePropertyValue) / 1000000).toFixed(1))
    );

    // Format the data for the chart
    const performanceData = agents.map((agent, index) => {
      return {
        name: `${agent.user.firstName.charAt(0)}. ${agent.user.lastName}`,
        properties: propertyCounts[index],
        sales: salesAmounts[index],
        rating: parseFloat(agent.rating?.toFixed(1) || "0"),
      };
    });

    return NextResponse.json(performanceData);
  } catch (error) {
    console.error("Error fetching agent performance:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent performance" },
      { status: 500 }
    );
  }
}
