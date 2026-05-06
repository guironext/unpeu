"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

function generateCode(): string {
  return randomBytes(8).toString("hex");
}

export async function getCommercialClientsData() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const commercial = await prisma.user.findFirst({
    where: { clerkId, role: "COMMERCIAL" },
  });
  if (!commercial) return null;

  const [signedUpVisitors, pendingInvitations] = await Promise.all([
    prisma.user.findMany({
      where: { invitedById: commercial.id, role: "VISITOR" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.invitationLink.findMany({
      where: {
        createdById: commercial.id,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    signedUpVisitors,
    pendingInvitations,
  };
}

export async function createInvitationLink(formData: FormData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { error: "Non authentifié" };

  const commercial = await prisma.user.findFirst({
    where: { clerkId, role: "COMMERCIAL" },
  });
  if (!commercial) return { error: "Accès refusé" };

  const email = (formData.get("email") as string)?.trim() || null;

  const token = generateToken();
  const code = generateCode();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.invitationLink.create({
    data: {
      code,
      token,
      createdById: commercial.id,
      sentToEmail: email,
      expiresAt,
    },
  });

  revalidatePath("/commercial/clients");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteUrl = `${baseUrl}/invite/${token}`;

  return { success: true, inviteUrl };
}
