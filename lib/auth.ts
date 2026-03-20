import { auth } from "@clerk/nextjs/server";

export type UserRole = "admin" | "commercial" | "dealer" | "visitor";

/**
 * Get the current user's role from Clerk session claims.
 * Role should be set in Clerk publicMetadata and exposed via JWT claims.
 */
export async function getUserRole(): Promise<UserRole | null> {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role as UserRole | undefined;
  return role ?? null;
}

/**
 * Check if the current user has a specific role.
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === role;
}

/**
 * Check if the current user is an admin.
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("admin");
}

/**
 * Check if the current user is a commercial.
 */
export async function isCommercial(): Promise<boolean> {
  return hasRole("commercial");
}

/**
 * Check if the current user is a dealer.
 */
export async function isDealer(): Promise<boolean> {
  return hasRole("dealer");
}

/**
 * Check if the current user is a visitor (buyer).
 */
export async function isVisitor(): Promise<boolean> {
  return hasRole("visitor");
}
