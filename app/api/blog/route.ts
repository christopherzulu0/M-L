import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { auth } from '@clerk/nextjs/server'

// Initialize Prisma client with error handling
let prisma: PrismaClient
try {
  prisma = new PrismaClient()
} catch (error) {
  console.error('Failed to initialize Prisma client:', error)
  prisma = null as any // This will be checked before use
}

// GET /api/blog - Get blog posts with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Check if Prisma client is available
    if (!prisma) {
      console.error('Prisma client is not initialized')
      return NextResponse.json(
        {
          error: 'Database service unavailable',
          blogPosts: [],
          pagination: {
            total: 0,
            page: 1,
            pageSize: 6,
            totalPages: 0
          }
        },
        { status: 503 }
      )
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const authorId = searchParams.get('authorId')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')
    const slug = searchParams.get('slug')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (category) {
      where.category = category
    }

    if (authorId) {
      where.authorId = parseInt(authorId)
    }

    if (slug) {
      where.slug = slug
    }

    // Add search functionality
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Set default pagination values
    const itemsPerPage = limit ? parseInt(limit) : 6
    const currentPage = page ? parseInt(page) : 1
    const skip = (currentPage - 1) * itemsPerPage

    // Query blog posts with pagination
    let blogPosts = []
    let totalPosts = 0

    try {
      // Get total count for pagination
      totalPosts = await prisma.blogPost.count({ where })

      // Get paginated blog posts
      blogPosts = await prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: itemsPerPage,
        skip: skip
      })
    } catch (dbError) {
      console.error('Database query error:', dbError)
      // Return empty array instead of throwing
      blogPosts = []
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalPosts / itemsPerPage)

    return NextResponse.json({
      blogPosts,
      pagination: {
        total: totalPosts,
        page: currentPage,
        pageSize: itemsPerPage,
        totalPages: totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    // Return an empty array with the error to ensure the client can still render something
    return NextResponse.json({
      error: 'Internal server error',
      blogPosts: [],
      pagination: {
        total: 0,
        page: 1,
        pageSize: 6,
        totalPages: 0
      }
    }, { status: 500 })
  }
}

// POST /api/blog - Create a new blog post
export async function POST(request: Request) {
  try {
    // Check if Prisma client is available
    if (!prisma) {
      console.error('Prisma client is not initialized')
      return NextResponse.json(
        { error: 'Database service unavailable' },
        { status: 503 }
      )
    }

    // Authenticate user
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    let user
    try {
      user = await prisma.user.findFirst({
        where: { clerkid: userId }
      })
    } catch (dbError) {
      console.error('Database query error when finding user:', dbError)
      return NextResponse.json({ error: 'Database error when finding user' }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has permission to create blog posts
    if (user.role !== 'admin' && user.role !== 'agent') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()
    const { title, excerpt, content, image, category, status, slug } = body

    // Validate required fields
    if (!title || !content || !category || !slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create blog post
    let blogPost
    try {
      blogPost = await prisma.blogPost.create({
        data: {
          title,
          slug,
          excerpt,
          content,
          image,
          category,
          status: status || 'draft',
          authorId: user.id,
          publishedAt: status === 'published' ? new Date() : null
        }
      })
    } catch (dbError) {
      console.error('Database error when creating blog post:', dbError)
      return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
    }

    return NextResponse.json(blogPost, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
