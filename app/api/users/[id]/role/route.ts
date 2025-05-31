import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

// PATCH /api/users/[id]/role - Update a user's role
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validate role
    if (!body.role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      )
    }

    // Validate role value
    const validRoles = ['user', 'admin', 'agent']
    if (!validRoles.includes(body.role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: user, admin, agent' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role: body.role,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    })

    return NextResponse.json({
      message: 'User role updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    )
  }
}
