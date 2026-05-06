"use client";

import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assignRoleAndGetNextUrl } from "./actions";

type OnboardingRole = "commercial" | "dealers" | "admin";

export function OnboardingButton({ role }: { role: OnboardingRole }) {
  const router = useRouter();
  const { session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    try {
      const result = await assignRoleAndGetNextUrl(role);
      if ("error" in result) {
        console.error(result.error);
        setIsLoading(false);
        return;
      }
      await session?.reload();
      router.push(result.nextUrl);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
    >
      {isLoading ? "Redirection..." : "Accéder à mon espace"}
      <ArrowRight className="size-4" />
    </Button>
  );
}
