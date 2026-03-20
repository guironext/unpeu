import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Users, Store, Shield } from "lucide-react";

const VALID_ROLES = ["commercial", "dealers", "admin"] as const;
type OnboardingRole = (typeof VALID_ROLES)[number];

const ROLE_CONFIG: Record<
  OnboardingRole,
  {
    title: string;
    steps: string[];
    icon: React.ComponentType<{ className?: string }>;
    nextUrl: string;
  }
> = {
  commercial: {
    title: "Bienvenue sur votre espace Commercial",
    steps: [
      "Créez des liens d'invitation pour vos visiteurs",
      "Partagez vos liens pour que vos clients s'inscrivent",
      "Suivez les inscriptions et les ventes",
    ],
    icon: Users,
    nextUrl: "/commercial",
  },
  dealers: {
    title: "Bienvenue sur votre espace Revendeur",
    steps: [
      "Gérez les produits que vous vendez",
      "Suivez vos ventes et stocks",
      "Consultez ce qui vous est dû",
    ],
    icon: Store,
    nextUrl: "/dealers",
  },
  admin: {
    title: "Bienvenue sur votre espace Administration",
    steps: [
      "Gérez les utilisateurs et les rôles",
      "Supervisez la plateforme",
      "Accédez aux paramètres et statistiques",
    ],
    icon: Shield,
    nextUrl: "/admin",
  },
};

export default async function OnboardingRolePage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { role } = await params;
  const normalizedRole = role.toLowerCase() as OnboardingRole;

  if (!VALID_ROLES.includes(normalizedRole)) {
    redirect("/");
  }

  const config = ROLE_CONFIG[normalizedRole];
  const Icon = config.icon;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-10 px-4 py-16">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="rounded-full bg-orange-100 p-4">
          <Icon className="size-12 text-orange-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {config.title}
        </h1>
        <ul className="space-y-4 text-left">
          {config.steps.map((step, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3"
            >
              <CheckCircle2 className="size-5 shrink-0 text-green-600" />
              <span className="text-gray-700">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        
        className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
      >
        Accéder à mon espace
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}

export function generateStaticParams() {
  return VALID_ROLES.map((role) => ({ role }));
}
