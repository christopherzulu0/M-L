import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/uploadthing(.*)",
    "/api/dashboard(.*)",
    // Only allow public access to specific agent API routes, not all
    "/api/agent/public(.*)",  // Public agent data
    "/api/properties(.*)",  // Allow public access to properties API
    "/api/mortgage(.*)",  // Allow public access to mortgage API
    "/api/testimonials(.*)",  // Allow public access to testimonials API
    "/api/locations(.*)",  // Allow public access to locations API
    "/api/agent/property-types(.*)",
    "/api/agent/me(.*)",
    "/api//agent/property-types(.*)"
]);

// Define routes that should be ignored
const isIgnoredRoute = createRouteMatcher([
    "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    // Only protect routes that are not public and not ignored
    if (!isPublicRoute(req) && !isIgnoredRoute(req)) {
        await auth.protect();
        // Role-based access control is now handled by client-side components
    }
});

export const config = {
    // Protects all routes, including api/trpc.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
