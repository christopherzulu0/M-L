import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Create a user first
    const user = await prisma.user.create({
      data: {
        email: `agent${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'Agent',
        phone: '+260123456789',
        role: 'agent',
        profileImage: 'https://i.pravatar.cc/150?img=2',
        // Create the associated agent
        agent: {
          create: {
            bio: 'This is a test agent created for debugging purposes',
            specialization: 'Residential',
            licenseNumber: `LIC-TEST-${Date.now()}`,
            commissionRate: 5.0,
            rating: 4.5,
            status: 'active'
          }
        }
      },
      include: {
        agent: true
      }
    });

    return NextResponse.json({
      message: 'Test agent created successfully',
      user: user
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating test agent:', error);
    return NextResponse.json(
      { error: 'Failed to create test agent', details: error.message },
      { status: 500 }
    );
  }
}