"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createInvitationLink } from "./actions";
import { Send, Copy, Check, UserPlus, MessageCircle } from "lucide-react";
import type { User, InvitationLink } from "@/app/generated/prisma/browser";

type ClientsData = {
  signedUpVisitors: User[];
  pendingInvitations: InvitationLink[];
};

export function ClientsContent({ data }: { data: ClientsData | null }) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInviteUrl(null);

    const formData = new FormData();
    if (email.trim()) formData.set("email", email.trim());

    const result = await createInvitationLink(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success && result.inviteUrl) {
      setInviteUrl(result.inviteUrl);
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetModal = () => {
    setShowModal(false);
    setEmail("");
    setInviteUrl(null);
    setError(null);
  };

  const signedUpVisitors = data?.signedUpVisitors ?? [];
  const pendingInvitations = data?.pendingInvitations ?? [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
        <Button
          onClick={() => setShowModal(true)}
          className="gap-2 bg-orange-500 hover:bg-orange-600"
        >
          <Send className="size-4" />
          Envoyer une Invitation
        </Button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Envoyer une Invitation
            </h2>

            {!inviteUrl ? (
              <form onSubmit={handleCreateInvitation} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    E-mail du destinataire (optionnel)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@exemple.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 gap-2 bg-orange-500 hover:bg-orange-600"
                  >
                    {loading ? "Création…" : "Créer le lien"}
                    <UserPlus className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetModal}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Lien d&apos;invitation créé. Copiez-le et envoyez-le à votre
                  contact.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <a
                    href={inviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 truncate rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-orange-600 underline transition hover:bg-orange-50 hover:text-orange-700"
                  >
                    {inviteUrl}
                  </a>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCopy}
                      className="gap-1.5"
                    >
                      {copied ? (
                        <>
                          <Check className="size-4 text-green-600" />
                          Copié
                        </>
                      ) : (
                        <>
                          <Copy className="size-4" />
                          Copier
                        </>
                      )}
                    </Button>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Bonjour, voici votre lien d'invitation : ${inviteUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#25D366] bg-[#25D366] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#20BD5A] focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
                    >
                      <MessageCircle className="size-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setInviteUrl(null);
                      setEmail("");
                    }}
                  >
                    Nouvelle invitation
                  </Button>
                  <Button onClick={resetModal}>Fermer</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <section>
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Inscrits via invitation
          </h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Nom
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    E-mail
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Inscrit le
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {signedUpVisitors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      Aucun visiteur inscrit via vos invitations pour le moment.
                    </td>
                  </tr>
                ) : (
                  signedUpVisitors.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                        {[user.firstName, user.lastName].filter(Boolean).join(" ") || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.contact || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Invitations en attente
          </h2>
          <p className="mb-3 text-sm text-gray-600">
            Personnes ayant reçu un lien d&apos;invitation mais pas encore
            inscrites.
          </p>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    E-mail destinataire
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Lien
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Date d&apos;envoi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Expire le
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {pendingInvitations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      Aucune invitation en attente.
                    </td>
                  </tr>
                ) : (
                  pendingInvitations.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {inv.sentToEmail || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/invite/${inv.token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-orange-600 underline hover:text-orange-700"
                        >
                          Ouvrir le lien
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {new Date(inv.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {new Date(inv.expiresAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
