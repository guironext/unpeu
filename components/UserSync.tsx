import { auth } from "@clerk/nextjs/server";
import { syncUserToDb } from "@/lib/sync-user";

/**
 * Syncs the current Clerk user to Prisma on each request if missing.
 * Fallback for when the Clerk webhook doesn't fire (e.g. local dev).
 */
export async function UserSync() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    await syncUserToDb(userId);
  } catch (err) {
    console.error("UserSync failed:", err);
  }
  return null;
}
