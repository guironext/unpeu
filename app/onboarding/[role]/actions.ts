"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const ROLE_TO_PRISMA = {
  commercial: "COMMERCIAL",
  dealers: "DEALER",
  admin: "ADMIN",
} as const;

const ROLE_TO_CLERK = {
  commercial: "commercial",
  dealers: "dealer",
  admin: "admin",
} as const;

const NEXT_URL = {
  commercial: "/commercial",
  dealers: "/dealers",
  admin: "/admin",
} as const;

type OnboardingRole = keyof typeof ROLE_TO_CLERK;

export async function assignRoleOnLanding(
  role: OnboardingRole
): Promise<void> {
  const { userId } = await auth();
  if (!userId) return;

  const prismaRole = ROLE_TO_PRISMA[role];
  const clerkRole = ROLE_TO_CLERK[role];

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: clerkRole },
    });

    await prisma.user.updateMany({
      where: { clerkId: userId },
      data: { role: prismaRole },
    });
  } catch (err) {
    console.error("Failed to assign role on landing:", err);
  }
}

export async function assignRoleAndGetNextUrl(
  role: OnboardingRole
): Promise<{ nextUrl: string } | { error: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Non authentifié" };
  }

  const prismaRole = ROLE_TO_PRISMA[role];
  const clerkRole = ROLE_TO_CLERK[role];
  const nextUrl = NEXT_URL[role];

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: clerkRole },
    });

    await prisma.user.updateMany({
      where: { clerkId: userId },
      data: { role: prismaRole },
    });

    return { nextUrl };
  } catch (err) {
    console.error("Failed to assign role:", err);
    return { error: "Impossible d'attribuer le rôle" };
  }
}
