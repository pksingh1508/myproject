import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/hackathons(.*)",
  "/about(.*)",
  "/career(.*)",
  "/api/webhooks/(.*)",
  "/privacy-policy(.*)",
  "/terms-and-conditions(.*)",
  "/refund-policy(.*)",
  "/cancellation-policy(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const isPublicHackathonListRequest =
    req.method === "GET" && req.nextUrl.pathname === "/api/hackathons";

  if (isPublicRoute(req) || isPublicHackathonListRequest) {
    return;
  }

  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.nextUrl.href });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files.
    "/((?!_next|.*\\..*).*)",
    "/",
  ],
};
