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
  "/api/agent/(.*)",  // Allow public access to agent detail API
  "/api/properties(.*)",  // Allow public access to properties API
  "/api/mortgage(.*)",  // Allow public access to mortgage API
  "/api/testimonials(.*)",  // Allow public access to testimonials API
  "/api/locations(.*)",  // Allow public access to locations API
  "/api/agent/property-types(.*)",
  "/api/agent/me(.*)",
  "/api/agent/(.*)/reviews(.*)",  // Allow public access to agent reviews
  "/api/agent/(.*)/contact(.*)",  // Allow public access to agent contact form
  "/agent/(.*)",
  "/agents(.*)",
  "/properties(.*)",
  "/blog(.*)",
  "/api/blog(.*)",
   "/buyers-guide(.*)",
    "/sellers-guide(.*)",
     "/saved-searches(.*)",
      "/calculator(.*)",
  "/contact(.*)",
  "/api/contact(.*)",
  "/favorities(.*)",
  "/listings(.*)",
  "/listings-single(.*)",
  "/locations(.*)",
  "/sellers-guide(.*)",
  "/api/agents(.*)"

]);


export default clerkMiddleware(async (auth, req) => {
  // Only protect routes that are not public and not ignored
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  // Protects all routes, including api/trpc.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};