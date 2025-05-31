import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/uploadthing(.*)",
    "/api/dashboard(.*)",
    "/api/agent(.*)",  // Allow public access to all agent API routes
    "/api/properties(.*)",  // Allow public access to properties API
    "/api/mortgage(.*)",  // Allow public access to mortgage API
    "/api/testimonials(.*)",  // Allow public access to testimonials API
    "/api/locations(.*)"  // Allow public access to locations API
    // Note: /api/agent/me is NOT public and requires authentication
]);

// Define routes that should be ignored
const isIgnoredRoute = createRouteMatcher([
    "/api/webhooks(.*)",
]);

// Define routes that require role-based access
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isClientRoomRoute = createRouteMatcher(["/ClientRoom(.*)"]);
const isAgentRoomRoute = createRouteMatcher(["/AgentRoom(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    // Only protect routes that are not public and not ignored
    if (!isPublicRoute(req) && !isIgnoredRoute(req)) {
        await auth.protect();

        // Check if the route requires role-based access
        if (isDashboardRoute(req) || isClientRoomRoute(req) || isAgentRoomRoute(req)) {
            // Get the user's role from the database
            if (auth.userId) {
                try {
                    const user = await prisma.user.findFirst({
                        where: {
                            clerkid: auth.userId,
                        },
                        select: {
                            role: true,
                        },
                    });

                    if (user) {
                        const { pathname } = new URL(req.url);

                        // Restrict access based on role
                        if (isDashboardRoute(req) && user.role !== 'admin') {
                            return NextResponse.redirect(new URL('/', req.url));
                        } else if (isAgentRoomRoute(req) && user.role !== 'agent' && user.role !== 'admin') {
                            return NextResponse.redirect(new URL('/', req.url));
                        } else if (isClientRoomRoute(req) && user.role !== 'user' && user.role !== 'admin' && user.role !== 'agent') {
                            return NextResponse.redirect(new URL('/', req.url));
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                }
            }
        }
    }
});

export const config = {
    // Protects all routes, including api/trpc.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
