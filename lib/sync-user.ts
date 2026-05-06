import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Ensures the user exists in Prisma. If not (e.g. webhook missed), fetches from Clerk and creates.
 * Also updates invitedById when Clerk has invitation metadata but our DB doesn't (e.g. webhook missed).
 */
export async function syncUserToDb(clerkId: string): Promise<void> {
  const existing = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, invitedById: true },
  });

  // Skip full sync if user exists and has invitedById (webhook already handled it)
  if (existing?.invitedById) return;

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(clerkId);
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const contact =
    (clerkUser.unsafeMetadata?.contact as string) ??
    clerkUser.phoneNumbers[0]?.phoneNumber ??
    null;
  const invitedByUserId = clerkUser.unsafeMetadata?.invitedByUserId as string | undefined;

  await prisma.user.upsert({
    where: { clerkId },
    create: {
      clerkId,
      email,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      contact,
      role: "VISITOR",
      invitedById: invitedByUserId ?? null,
    },
    update: {
      email,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      contact,
      ...(invitedByUserId && { invitedById: invitedByUserId }),
    },
  });

  // Mark invitation link as used if present
  const invitationToken = clerkUser.unsafeMetadata?.invitationToken as string | undefined;
  if (invitationToken && invitedByUserId) {
    await prisma.invitationLink.updateMany({
      where: { token: invitationToken },
      data: { usedAt: new Date() },
    });
  }
}
