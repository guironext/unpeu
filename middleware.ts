import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ─── Public routes (no auth required) ─────────────────────────────────────
// Visitors can browse products, categories, home. Sign-in/sign-up available.
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/join/(.*)", // Special links for Commercial, Dealers, Admin → sign-in → onboarding
  "/invite/(.*)", // Commercial invitation links for visitors to sign up
  "/categories/(.*)",
  "/products/(.*)",
  "/search",
  "/help",
  "/delivery",
  "/stores",
  "/sell",
  "/api/webhooks/(.*)",
]);

// ─── Role-protected routes ────────────────────────────────────────────────
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isCommercialRoute = createRouteMatcher(["/commercial(.*)"]);
const isDealerRoute = createRouteMatcher(["/dealers(.*)"]);

// ─── Auth-required routes (any signed-in user) ─────────────────────────────
// Cart: visitors must sign up/login to view basket
const isCartRoute = createRouteMatcher(["/cart(.*)"]);
const isAccountRoute = createRouteMatcher(["/account(.*)"]);
// Onboarding: Commercial, Dealers, Admin land here after login from /join/*
const isOnboardingRoute = createRouteMatcher(["/onboarding/(.*)"]);

// ─── Dashboard redirect (post-login landing) ───────────────────────────────
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

type AppRole = "admin" | "commercial" | "dealer" | "visitor";

function getRoleFromClaims(sessionClaims: unknown): AppRole | null {
  const claims = sessionClaims as { metadata?: { role?: AppRole } } | null;
  return claims?.metadata?.role ?? null;
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // 1. Public routes: allow everyone
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 2. Cart, account, onboarding: require auth (redirect to sign-in with return URL)
  if (isCartRoute(req) || isAccountRoute(req) || isOnboardingRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  // 3. Dashboard: redirect signed-in users to their role-specific session
  if (isDashboardRoute(req)) {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    const role = getRoleFromClaims(sessionClaims);
    if (role === "admin") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "commercial") return NextResponse.redirect(new URL("/commercial", req.url));
    if (role === "dealer") return NextResponse.redirect(new URL("/dealers", req.url));
    // Visitor or unknown: go to account or home
    return NextResponse.redirect(new URL("/account", req.url));
  }

  // 4. Role-protected routes: require auth + correct role
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const role = getRoleFromClaims(sessionClaims);

  if (isAdminRoute(req)) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (isCommercialRoute(req)) {
    if (role !== "commercial") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (isDealerRoute(req)) {
    if (role !== "dealer") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js|txt|ico|svg|png|jpg|jpeg|gif|webp)$).*)",
    "/(api|trpc)(.*)",
  ],
};
