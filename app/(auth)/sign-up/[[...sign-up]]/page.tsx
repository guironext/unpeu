import { SignUp } from "@clerk/nextjs";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  const params = await searchParams;
  const redirectUrl = params.redirect_url ?? "/";

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <SignUp
        forceRedirectUrl={redirectUrl}
        signInUrl={`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`}
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
      />
    </div>
  );
}
