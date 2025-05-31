import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findFirst({
      where: { clerkid: userId },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : undefined
    const unreadOnly = searchParams.get('unread') === 'true'

    // Build query
    const whereClause: any = {
      userId: user.id
    }

    if (unreadOnly) {
      whereClause.isRead = false
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.id,
        isRead: false
      }
    })

    return NextResponse.json({
      notifications,
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/notifications - Mark notifications as read
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findFirst({
      where: { clerkid: userId },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { notificationIds, markAll } = body

    if (markAll) {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: {
          userId: user.id,
          isRead: false
        },
        data: {
          isRead: true
        }
      })

      return NextResponse.json({ success: true, message: 'All notifications marked as read' })
    } else if (notificationIds && Array.isArray(notificationIds) && notificationIds.length > 0) {
      // Mark specific notifications as read
      await prisma.notification.updateMany({
        where: {
          id: {
            in: notificationIds
          },
          userId: user.id
        },
        data: {
          isRead: true
        }
      })

      return NextResponse.json({ success: true, message: 'Notifications marked as read' })
    } else {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/notifications - Delete notifications
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await prisma.user.findFirst({
      where: { clerkid: userId },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { notificationIds, deleteAll } = body

    if (deleteAll) {
      // Delete all notifications
      await prisma.notification.deleteMany({
        where: {
          userId: user.id
        }
      })

      return NextResponse.json({ success: true, message: 'All notifications deleted' })
    } else if (notificationIds && Array.isArray(notificationIds) && notificationIds.length > 0) {
      // Delete specific notifications
      await prisma.notification.deleteMany({
        where: {
          id: {
            in: notificationIds
          },
          userId: user.id
        }
      })

      return NextResponse.json({ success: true, message: 'Notifications deleted' })
    } else {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error deleting notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}