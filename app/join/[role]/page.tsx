import { SignIn } from "@clerk/nextjs";
import { notFound } from "next/navigation";

const VALID_ROLES = ["commercial", "dealers", "admin"] as const;
type JoinRole = (typeof VALID_ROLES)[number];

const ROLE_CONFIG: Record<
  JoinRole,
  { title: string; description: string; redirectUrl: string }
> = {
  commercial: {
    title: "Espace Commercial",
    description:
      "Connectez-vous pour accéder à votre espace commercial. envoyez des liens d'invitation à vos visiteurs et gérez vos ventes.",
    redirectUrl: "/onboarding/commercial",
  },
  dealers: {
    title: "Espace Revendeurs",
    description:
      "Connectez-vous pour gérer vos produits, suivre vos ventes et voir ce que vous devez.",
    redirectUrl: "/onboarding/dealers",
  },
  admin: {
    title: "Espace Administration",
    description:
      "Connectez-vous pour accéder au panneau d'administration de la plateforme.",
    redirectUrl: "/onboarding/admin",
  },
};

export default async function JoinRolePage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const normalizedRole = role.toLowerCase() as JoinRole;

  if (!VALID_ROLES.includes(normalizedRole)) {
    notFound();
  }

  const config = ROLE_CONFIG[normalizedRole];

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="max-w-md space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
        <p className="text-gray-600">{config.description}</p>
      </div>
      <SignIn
        routing="hash"
        forceRedirectUrl={config.redirectUrl}
        signUpUrl={`/sign-up?redirect_url=${encodeURIComponent(config.redirectUrl)}`}
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

export function generateStaticParams() {
  return VALID_ROLES.map((role) => ({ role }));
}
