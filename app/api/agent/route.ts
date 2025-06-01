import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let user;

    // Check if we're using an existing user
    if (body.existingUser && body.userId) {
      // Get the existing user
      const existingUser = await prisma.user.findUnique({
        where: {
          id: parseInt(body.userId)
        }
      });

      if (!existingUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Update the user's role to agent if needed and update phone and profileImage if provided
      const updateData: any = {
        role: 'agent'
      };

      // Add phone to update data if provided
      if (body.phone) {
        updateData.phone = body.phone;
      }

      // Add profileImage to update data if provided
      if (body.profileImage) {
        updateData.profileImage = body.profileImage;
      }

      await prisma.user.update({
        where: {
          id: parseInt(body.userId)
        },
        data: updateData
      });

      // Create an agent record for the existing user
      const agent = await prisma.agent.create({
        data: {
          userId: parseInt(body.userId),
          bio: body.bio || 'Experienced real estate agent',
          specialization: body.specialization || 'Residential',
          licenseNumber: body.licenseNumber || `LIC-${Date.now()}`,
          commissionRate: body.commissionRate || 5.0,
          rating: body.rating || 4.5,
          status: body.status || 'active',
          serviceAreas: body.serviceAreas || [],
          languages: body.languages || [],
          socialMediaLinks: body.socialMediaLinks || {},
          address: body.address || null
        }
      });

      // Get the user with the newly created agent
      user = await prisma.user.findUnique({
        where: {
          id: parseInt(body.userId)
        },
        include: {
          agent: true
        }
      });
    } else {
      // Create a new user with an agent profile
      user = await prisma.user.create({
        data: {
          email: body.email || `agent${Date.now()}@example.com`,
          firstName: body.firstName || 'John',
          lastName: body.lastName || 'Doe',
          phone: body.phone || '+260123456789',
          role: 'agent',
          profileImage: body.profileImage || 'https://i.pravatar.cc/150?img=1',
          // Create the associated agent
          agent: {
            create: {
              bio: body.bio || 'Experienced real estate agent',
              specialization: body.specialization || 'Residential',
              licenseNumber: body.licenseNumber || `LIC-${Date.now()}`,
              commissionRate: body.commissionRate || 5.0,
              rating: body.rating || 4.5,
              status: body.status || 'active',
              serviceAreas: body.serviceAreas || [],
              languages: body.languages || [],
              socialMediaLinks: body.socialMediaLinks || {},
              address: body.address || null
            }
          }
        },
        include: {
          agent: true
        }
      });
    }

    return NextResponse.json({
      message: 'Agent created successfully',
      user: user
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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
