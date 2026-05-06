"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const INVITATION_STORAGE_KEY = "signup_invitation";

export function CustomSignUpForm({
  redirectUrl,
  signInUrl,
  invitationToken: invitationTokenProp,
  invitedByUserId: invitedByUserIdProp,
}: {
  redirectUrl: string;
  signInUrl: string;
  invitationToken?: string | null;
  invitedByUserId?: string | null;
}) {
  const searchParams = useSearchParams();
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Read invitation from URL, sessionStorage, or props (in that order)
  const invitationToken =
    searchParams?.get("invitation") ??
    (typeof window !== "undefined" ? sessionStorage.getItem(`${INVITATION_STORAGE_KEY}_token`) : null) ??
    invitationTokenProp ??
    null;
  const invitedByUserId =
    searchParams?.get("invitedBy") ??
    (typeof window !== "undefined" ? sessionStorage.getItem(`${INVITATION_STORAGE_KEY}_invitedBy`) : null) ??
    invitedByUserIdProp ??
    null;

  // Persist invitation params so they survive verification step / refresh
  useEffect(() => {
    if (invitationToken && invitedByUserId && typeof window !== "undefined") {
      sessionStorage.setItem(`${INVITATION_STORAGE_KEY}_token`, invitationToken);
      sessionStorage.setItem(`${INVITATION_STORAGE_KEY}_invitedBy`, invitedByUserId);
    }
  }, [invitationToken, invitedByUserId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const firstName = (formData.get("firstName") as string)?.trim();
    const lastName = (formData.get("lastName") as string)?.trim();
    const contact = (formData.get("contact") as string)?.trim();
    const emailAddress = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;

    if (!firstName || !lastName || !contact || !emailAddress || !password) {
      setSubmitError("Tous les champs sont obligatoires.");
      return;
    }

    const unsafeMetadata: Record<string, unknown> = { contact };
    if (invitationToken && invitedByUserId) {
      unsafeMetadata.invitationToken = invitationToken;
      unsafeMetadata.invitedByUserId = invitedByUserId;
    }

    const { error } = await signUp.password({
      emailAddress,
      password,
      firstName,
      lastName,
      unsafeMetadata,
    });

    if (error) {
      setSubmitError(error.message ?? "Une erreur s'est produite.");
      return;
    }

    if (signUp.status === "complete") {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(`${INVITATION_STORAGE_KEY}_token`);
        sessionStorage.removeItem(`${INVITATION_STORAGE_KEY}_invitedBy`);
      }
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl(redirectUrl);
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        },
      });
      return;
    }

    // Email verification required
    const needsVerification =
      signUp.status === "missing_requirements" &&
      (!signUp.missingFields || signUp.missingFields.length === 0);

    if (needsVerification) {
      await signUp.verifications.sendEmailCode();
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const form = e.currentTarget;
    const code = (new FormData(form).get("code") as string)?.trim();

    if (!code) {
      setSubmitError("Veuillez saisir le code reçu par e-mail.");
      return;
    }

    const { error } = await signUp.verifications.verifyEmailCode({ code });

    if (error) {
      setSubmitError(error.message ?? "Code invalide.");
      return;
    }

    if (signUp.status === "complete") {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(`${INVITATION_STORAGE_KEY}_token`);
        sessionStorage.removeItem(`${INVITATION_STORAGE_KEY}_invitedBy`);
      }
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl(redirectUrl);
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        },
      });
    }
  };

  // Show email verification step
  const showVerification =
    signUp?.status === "missing_requirements" &&
    signUp.unverifiedFields?.length &&
    (!signUp.missingFields || signUp.missingFields.length === 0);

  if (showVerification) {
    return (
      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Vérifiez votre compte</h2>
        <p className="mb-4 text-sm text-neutral-600">
          Entrez le code envoyé à votre adresse e-mail.
        </p>
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="code" className="mb-1 block text-sm font-medium text-neutral-700">
              Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              placeholder="123456"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            />
            {errors?.fields?.code && (
              <p className="mt-1 text-sm text-red-600">{String(errors.fields.code.message)}</p>
            )}
          </div>
          {submitError && (
            <p className="text-sm text-red-600">{submitError}</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={fetchStatus === "fetching"}
              className="flex-1 rounded-md bg-neutral-900 px-4 py-2 font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
            >
              Vérifier
            </button>
            <button
              type="button"
              onClick={() => signUp.verifications.sendEmailCode()}
              disabled={fetchStatus === "fetching"}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              Nouveau code
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold">Créer un compte</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-neutral-700">
              Prénom *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              autoComplete="given-name"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              placeholder="Prénoms..."
            />
            {errors?.fields?.firstName && (
              <p className="mt-1 text-sm text-red-600">{String(errors.fields.firstName.message)}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-neutral-700">
              Nom *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              autoComplete="family-name"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              placeholder="Nom de famille..."
            />
            {errors?.fields?.lastName && (
              <p className="mt-1 text-sm text-red-600">{String(errors.fields.lastName.message)}</p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="contact" className="mb-1 block text-sm font-medium text-neutral-700">
            Téléphone / Contact *
          </label>
          <input
            id="contact"
            name="contact"
            type="tel"
            required
            autoComplete="tel"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            placeholder="+225 .. .. .. .. .."
          />
          {errors?.fields?.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{String(errors.fields.phoneNumber.message)}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-700">
            E-mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            placeholder="email@exemple.fr"
          />
          {errors?.fields?.emailAddress && (
            <p className="mt-1 text-sm text-red-600">{String(errors.fields.emailAddress.message)}</p>
          )}
        </div>
        <div id="clerk-captcha" className="min-h-[78px]" />
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-neutral-700">
            Mot de passe *
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            placeholder="•••••••• 8 caractères minimum"
          />
          {errors?.fields?.password && (
            <p className="mt-1 text-sm text-red-600">{String(errors.fields.password.message)}</p>
          )}
        </div>
        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        <Button
          type="submit"
          disabled={fetchStatus === "fetching"}
          className="w-full rounded-md bg-neutral-900 px-4 py-2 font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {fetchStatus === "fetching" ? "Chargement…" : "Créer votre compte"}
          Valider
          <ArrowRight className="size-4" />
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-600 border-t border-neutral-200 pt-4">
        Déjà un compte ?{" "}
        <a href={signInUrl} className="font-medium text-neutral-900 underline hover:no-underline">
          Se connecter
        </a>
      </p>
    </div>
  );
}
