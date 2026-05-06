import { Suspense } from "react";
import { CustomSignUpForm } from "@/components/CustomSignUpForm";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{
    redirect_url?: string;
    invitation?: string;
    invitedBy?: string;
  }>;
}) {
  const params = await searchParams;
  const redirectUrl = params.redirect_url ?? "/";
  const signInUrl = `/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Suspense fallback={<div className="text-sm text-neutral-500">Chargement…</div>}>
        <CustomSignUpForm
          redirectUrl={redirectUrl}
          signInUrl={signInUrl}
          invitationToken={params.invitation ?? null}
          invitedByUserId={params.invitedBy ?? null}
        />
      </Suspense>
    </div>
  );
}
