import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, phone_numbers } = evt.data;
    const email = email_addresses?.[0]?.email_address ?? "";

    const unsafeMetadata = evt.data.unsafe_metadata as Record<string, unknown> | undefined;
    const contact =
      (unsafeMetadata?.contact as string) ??
      (phone_numbers?.[0] as { phone_number?: string })?.phone_number ??
      (phone_numbers?.[0] as { phoneNumber?: string })?.phoneNumber ??
      null;

    const invitedByUserId = unsafeMetadata?.invitedByUserId as string | undefined;

    const newUser = await prisma.user.upsert({
      where: { clerkId: id },
      create: {
        clerkId: id,
        email,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        contact,
        role: "VISITOR",
        invitedById: invitedByUserId ?? null,
      },
      update: {
        email,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        contact,
        ...(invitedByUserId && { invitedById: invitedByUserId }),
      },
    });

    // Mark invitation link as used if created via invite
    const invitationToken = unsafeMetadata?.invitationToken as string | undefined;
    if (invitationToken && newUser.invitedById) {
      await prisma.invitationLink.updateMany({
        where: { token: invitationToken },
        data: { usedAt: new Date() },
      });
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, phone_numbers } = evt.data;
    const email = email_addresses?.[0]?.email_address ?? "";

    const unsafeMetadata = evt.data.unsafe_metadata as Record<string, unknown> | undefined;
    const contact =
      (unsafeMetadata?.contact as string) ??
      (phone_numbers?.[0] as { phone_number?: string })?.phone_number ??
      (phone_numbers?.[0] as { phoneNumber?: string })?.phoneNumber ??
      null;
    const invitedByUserId = unsafeMetadata?.invitedByUserId as string | undefined;

    await prisma.user.upsert({
      where: { clerkId: id },
      create: {
        clerkId: id,
        email,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        contact,
        role: "VISITOR",
        invitedById: invitedByUserId ?? null,
      },
      update: {
        email,
        firstName: first_name ?? null,
        lastName: last_name ?? null,
        contact,
        ...(invitedByUserId && { invitedById: invitedByUserId }),
      },
    });

    // Mark invitation link as used if present (handles user.updated before user.created)
    const invitationToken = unsafeMetadata?.invitationToken as string | undefined;
    if (invitationToken && invitedByUserId) {
      await prisma.invitationLink.updateMany({
        where: { token: invitationToken },
        data: { usedAt: new Date() },
      });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    await prisma.user.deleteMany({ where: { clerkId: id } });
  }

  return new Response("OK", { status: 200 });
}
