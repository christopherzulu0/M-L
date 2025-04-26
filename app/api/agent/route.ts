import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      where: {
        status: "active",
      },
      include: {
        user: true,
      },
      orderBy: {
        rating: 'desc',
      },
      take: 10, // Limit to top 10 agents
    });

    // Get property counts for all agents
    const propertyCounts = await Promise.all(
      agents.map(agent => 
        prisma.property.count({
          where: {
            agentId: agent.id,
          },
        })
      )
    );

    // Transform the data to match the expected format for AgentCard
    const formattedAgents = agents.map((agent, index) => {
      // Determine rating label based on rating value
      let ratingLabel = "Average";
      if (agent.rating) {
        const rating = Number(agent.rating);
        if (rating >= 4.5) ratingLabel = "Excellent";
        else if (rating >= 4) ratingLabel = "Very Good";
        else if (rating >= 3) ratingLabel = "Average";
        else ratingLabel = "Fair";
      }

      return {
        id: agent.id,
        name: `${agent.user.firstName} ${agent.user.lastName}`,
        agency: "Real Estate Agency", // Default agency name since it's not in the schema
        image: agent.user.profileImage || "/placeholder.svg", // Fallback to placeholder if no image
        listings: propertyCounts[index], // Use the actual count of properties
        rating: Number(agent.rating) || 0,
        ratingLabel,
        verified: agent.status === "active",
        bio: agent.bio || "Real estate professional",
      };
    });

    return NextResponse.json(formattedAgents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
