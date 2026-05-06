import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const link = await prisma.invitationLink.findFirst({
    where: {
      token,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { createdBy: true },
  });

  if (!link) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <h1 className="text-lg font-semibold text-amber-900">
            Lien d&apos;invitation invalide ou expiré
          </h1>
          <p className="mt-2 text-sm text-amber-800">
            Ce lien a peut-être déjà été utilisé ou a expiré.
          </p>
          <a
            href="/sign-up"
            className="mt-4 inline-block text-sm font-medium text-amber-700 underline"
          >
            Créer un compte
          </a>
        </div>
      </div>
    );
  }

  const search = new URLSearchParams({
    invitation: token,
    invitedBy: link.createdById,
    redirect_url: "/",
  });
  redirect(`/sign-up?${search.toString()}`);
}
