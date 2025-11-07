import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/hackathons(.*)",
  "/about(.*)",
  "/api/webhooks/(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
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
    "/"
  ]
};
