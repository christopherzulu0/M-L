import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// GET /api/documents - Get all documents (filtered by user or property)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findFirst({
      where: { clerkid: userId },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const propertyId = searchParams.get('propertyId') ? parseInt(searchParams.get('propertyId') as string) : undefined
    const category = searchParams.get('category') || undefined
    const isPublic = searchParams.get('isPublic') === 'true'

    // Build query
    const whereClause: any = {}

    // If property ID is provided, filter by property
    if (propertyId) {
      whereClause.propertyId = propertyId

      // If not admin and not public, ensure user has access to the property
      if (user.role !== 'admin' && !isPublic) {
        const property = await prisma.property.findUnique({
          where: { id: propertyId },
          select: { 
            ownerId: true,
            agentId: true
          }
        })

        if (!property) {
          return NextResponse.json({ error: 'Property not found' }, { status: 404 })
        }

        // Check if user is owner or agent of the property
        const hasAccess = property.ownerId === user.id || 
                         (property.agentId && await prisma.agent.findFirst({ 
                           where: { id: property.agentId, userId: user.id } 
                         }))

        if (!hasAccess) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      }
    } else {
      // If no property ID, filter by user's documents or public documents
      whereClause.OR = [
        { userId: user.id },
        { isPublic: true }
      ]

      // Admin can see all documents
      if (user.role === 'admin') {
        delete whereClause.OR
      }
    }

    // Add category filter if provided
    if (category) {
      whereClause.category = category
    }

    const documents = await prisma.document.findMany({
      where: whereClause,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/documents - Create a new document
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findFirst({
      where: { clerkid: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { 
      title, 
      description, 
      fileName, 
      filePath, 
      fileSize, 
      fileType, 
      category, 
      isPublic, 
      propertyId 
    } = body

    if (!title || !fileName || !filePath || !fileType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // If property ID is provided, check if user has access to the property
    if (propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { 
          ownerId: true,
          agentId: true
        }
      })

      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 })
      }

      // Check if user is owner, agent of the property, or admin
      const isAdmin = user.role === 'admin'
      const isOwner = property.ownerId === user.id
      const isAgent = property.agentId && await prisma.agent.findFirst({ 
        where: { id: property.agentId, userId: user.id } 
      })

      if (!isAdmin && !isOwner && !isAgent) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Create the document
    const document = await prisma.document.create({
      data: {
        title,
        description: description || undefined,
        fileName,
        filePath,
        fileSize: fileSize || undefined,
        fileType,
        category: category || 'general',
        isPublic: isPublic || false,
        propertyId: propertyId || undefined,
        userId: user.id
      }
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/documents - Delete a document
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findFirst({
      where: { clerkid: userId },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { documentId } = body

    if (!documentId) {
      return NextResponse.json({ error: 'Missing document ID' }, { status: 400 })
    }

    // Find the document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        property: {
          select: {
            ownerId: true,
            agentId: true
          }
        }
      }
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Check if user has permission to delete the document
    const isAdmin = user.role === 'admin'
    const isOwner = document.userId === user.id
    const isPropertyOwner = document.property?.ownerId === user.id
    const isPropertyAgent = document.property?.agentId && await prisma.agent.findFirst({
      where: { id: document.property.agentId, userId: user.id }
    })

    if (!isAdmin && !isOwner && !isPropertyOwner && !isPropertyAgent) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete the document
    await prisma.document.delete({
      where: { id: documentId }
    })

    return NextResponse.json({ success: true, message: 'Document deleted successfully' })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
