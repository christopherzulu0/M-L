import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Mock previous period data for calculating percentage changes
const PREVIOUS_PERIOD = {
  totalAgents: 42, // Previous period had 42 agents
  averageRating: 4.1, // Previous period average rating
  totalProperties: 210, // Previous period total properties
  totalSoldProperties: 85, // Previous period total sold properties
};

export async function GET() {
  try {
    console.log('Fetching agents from database...');
    const agents = await prisma.agent.findMany({
      include: {
        user: true,
      },
      orderBy: {
        rating: 'desc',
      },
    });

    console.log('Agents found:', agents.length);
    console.log('First agent (if any):', agents[0] ? JSON.stringify(agents[0], null, 2) : 'No agents found');

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

    // Get count of SOLD properties for all agents
    const soldPropertyCounts = await Promise.all(
      agents.map(agent =>
        prisma.property.count({
          where: {
            agentId: agent.id,
            status: "SOLD",
          },
        })
      )
    );

    // Transform the data to include all necessary fields expected by the frontend
    const formattedAgents = agents.map((agent, index) => {
      // Determine performance label based on rating value
      let performance = "Average";
      if (agent.rating) {
        const rating = Number(agent.rating);
        if (rating >= 4.5) performance = "Excellent";
        else if (rating >= 4) performance = "Good";
        else if (rating >= 3) performance = "Average";
        else performance = "Fair";
      }

      return {
        id: agent.id,
        user: {
          firstName: agent.user.firstName,
          lastName: agent.user.lastName,
          email: agent.user.email,
          phone: agent.user.phone,
          profileImage: agent.user.profileImage,
        },
        name: `${agent.user.firstName} ${agent.user.lastName}`,
        image: agent.user.profileImage || "/placeholder.svg", // Add image property for AgentCard
        propertyCount: propertyCounts[index],
        soldPropertyCount: soldPropertyCounts[index],
        rating: agent.rating,
        status: agent.status || 'Active',
        location: agent.location || 'Lusaka, Zambia',
        specialization: agent.specialization || 'Residential',
        joinDate: agent.createdAt,
        performance: performance,
        lastActive: 'Today', // This would ideally come from the database
        verified: true,
        featured: Math.random() > 0.7, // Random for now, could be a field in the database
        bio: agent.bio,
        agency: "Real Estate Agency", // Default agency name for AgentCard
        listings: propertyCounts[index], // For AgentCard
        ratingLabel: performance, // For AgentCard
        serviceAreas: agent.serviceAreas || [],
        languages: agent.languages || [],
        socialMediaLinks: agent.socialMediaLinks || {},
        address: agent.address || null
      };
    });

    // Calculate current period stats for comparison
    const totalAgents = formattedAgents.length;

    const totalRating = formattedAgents.reduce((sum, agent) => {
      return sum + (agent.rating ? parseFloat(agent.rating) : 0);
    }, 0);
    const averageRating = totalAgents > 0 ? parseFloat((totalRating / totalAgents).toFixed(1)) : 0;

    const totalProperties = formattedAgents.reduce((sum, agent) => {
      return sum + (agent.propertyCount || 0);
    }, 0);

    const totalSoldProperties = formattedAgents.reduce((sum, agent) => {
      return sum + (agent.soldPropertyCount || 0);
    }, 0);

    // Add current and previous period stats to the response
    const response = {
      agents: formattedAgents,
      stats: {
        current: {
          totalAgents,
          averageRating,
          totalProperties,
          totalSoldProperties
        },
        previous: PREVIOUS_PERIOD
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
