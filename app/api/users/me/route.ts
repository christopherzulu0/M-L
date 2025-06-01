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
        agent: true,
        properties: {
          take: 3,
          orderBy: {
            createdAt: 'desc'
          }
        },
        purchases: {
          take: 3,
          orderBy: {
            purchaseDate: 'desc'
          },
          include: {
            property: true
          }
        },
        appointments: {
          take: 3,
          orderBy: {
            appointmentDate: 'desc'
          },
          include: {
            property: true,
            agent: {
              include: {
                user: true
              }
            }
          }
        },
        testimonials: {
          take: 3,
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Format the user data
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || "",
      profileImage: user.profileImage || "/placeholder.svg",
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isAgent: !!user.agent,

      // Include agent data if the user is an agent
      agent: user.agent ? {
        id: user.agent.id,
        bio: user.agent.bio || "",
        specialization: user.agent.specialization || "",
        licenseNumber: user.agent.licenseNumber || "",
        commissionRate: user.agent.commissionRate || 0,
        joinDate: user.agent.joinDate,
        status: user.agent.status,
        rating: user.agent.rating || null,
        totalSales: user.agent.totalSales || 0,
        totalListings: user.agent.totalListings || 0,
        totalRevenue: user.agent.totalRevenue || 0
      } : null,

      // Include recent properties
      recentProperties: user.properties.map(property => ({
        id: property.id,
        title: property.title,
        address: property.address,
        price: property.price,
        status: property.status,
        createdAt: property.createdAt
      })),

      // Include recent purchases
      recentPurchases: user.purchases.map(purchase => ({
        id: purchase.id,
        propertyId: purchase.propertyId,
        propertyTitle: purchase.property.title,
        totalAmount: purchase.totalAmount,
        downPayment: purchase.downPayment,
        remainingAmount: purchase.remainingAmount,
        status: purchase.status,
        purchaseDate: purchase.purchaseDate
      })),

      // Include recent appointments
      recentAppointments: user.appointments.map(appointment => ({
        id: appointment.id,
        propertyId: appointment.propertyId,
        propertyTitle: appointment.property?.title || "Unknown Property",
        agentId: appointment.agentId,
        agentName: appointment.agent ? `${appointment.agent.user.firstName} ${appointment.agent.user.lastName}` : "No Agent",
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        status: appointment.status
      })),

      // Include testimonials
      testimonials: user.testimonials.map(testimonial => ({
        id: testimonial.id,
        comment: testimonial.comment,
        rating: testimonial.rating,
        isApproved: testimonial.isApproved,
        createdAt: testimonial.createdAt
      }))
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
