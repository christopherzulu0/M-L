import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// GET: Fetch approved reviews for an agent
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: paramId } = await params;
        const agentId = parseInt(paramId);

        if (isNaN(agentId)) {
            return NextResponse.json(
                { error: "Invalid agent ID" },
                { status: 400 }
            );
        }

        // Get pagination params from URL
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        // Fetch approved reviews only
        const reviews = await prisma.agentReview.findMany({
            where: {
                agentId,
                isApproved: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        });

        // Get total count for pagination
        const totalCount = await prisma.agentReview.count({
            where: {
                agentId,
                isApproved: true,
            },
        });

        return NextResponse.json({
            reviews,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}

// POST: Submit a new review
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: paramId } = await params;
        const agentId = parseInt(paramId);

        if (isNaN(agentId)) {
            return NextResponse.json(
                { error: "Invalid agent ID" },
                { status: 400 }
            );
        }

        // Verify agent exists
        const agent = await prisma.agent.findUnique({
            where: { id: agentId },
        });

        if (!agent) {
            return NextResponse.json(
                { error: "Agent not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { name, email, rating, comment } = body;

        // Validate required fields
        if (!name || !email || !rating || !comment) {
            return NextResponse.json(
                { error: "Missing required fields: name, email, rating, and comment are required" },
                { status: 400 }
            );
        }

        // Validate rating (1-5)
        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        // Validate comment length
        if (comment.trim().length < 10) {
            return NextResponse.json(
                { error: "Comment must be at least 10 characters long" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Get the current user if authenticated
        let userId: number | null = null;
        try {
            const session = await auth();
            if (session?.userId) {
                const user = await prisma.user.findFirst({
                    where: { clerkid: session.userId },
                    select: { id: true },
                });
                if (user) {
                    userId = user.id;
                }
            }
        } catch (authError) {
            console.error("Error getting user session:", authError);
            // Continue as anonymous review if auth checks fail
        }

        // Create the review (requires admin approval)
        const review = await prisma.agentReview.create({
            data: {
                agentId,
                userId, // Link to user if authenticated
                name: name.trim(),
                email: email.trim().toLowerCase(),
                rating: parseInt(rating),
                comment: comment.trim(),
                isApproved: false, // Requires admin approval
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Review submitted successfully! It will be visible after admin approval.",
                review: {
                    id: review.id,
                    rating: review.rating,
                    createdAt: review.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error submitting review:", error);
        return NextResponse.json(
            { error: "Failed to submit review" },
            { status: 500 }
        );
    }
}
