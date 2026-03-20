"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Smartphone,
} from "lucide-react";
import { useState } from "react";

const FOOTER_LINKS = {
  aide: [
    { label: "Centre d'aide", href: "/help" },
    { label: "Comment commander", href: "/help/how-to-order" },
    { label: "Suivi de commande", href: "/account/orders" },
    { label: "Retours & Remboursements", href: "/help/returns" },
    { label: "Nous contacter", href: "/contact" },
  ],
  commandes: [
    { label: "Livraison", href: "/delivery" },
    { label: "Points de retrait", href: "/stores" },
    { label: "Frais de livraison", href: "/delivery#frais" },
    { label: "Délais de livraison", href: "/delivery#delais" },
  ],
  paiement: [
    { label: "Moyens de paiement", href: "/payment" },
    { label: "Paiement à la livraison", href: "/payment#cash" },
    { label: "Paiement en ligne", href: "/payment#online" },
  ],
  vendeurs: [
    { label: "Vendez sur Unpeu", href: "/sell" },
    { label: "Devenir vendeur", href: "/sell/register" },
    { label: "Ressources vendeurs", href: "/sell/resources" },
  ],
};

const SOCIAL_LINKS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const LEGAL_LINKS = [
  { label: "Mentions légales", href: "/legal" },
  { label: "Conditions générales", href: "/terms" },
  { label: "Politique de confidentialité", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: Integrate with newsletter API
      setEmail("");
    }
  };

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white/95 backdrop-blur-sm">
      {/* Newsletter section */}
      <div className="border-b border-gray-100 bg-orange-50/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-orange-500 text-white">
                <Mail className="size-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Restez informé des offres
                </h3>
                <p className="text-sm text-gray-600">
                  Inscrivez-vous pour recevoir nos meilleures promos
                </p>
              </div>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full max-w-md gap-2 sm:shrink-0"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse e-mail"
                className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {/* Aide */}
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Aide</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.aide.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition hover:text-orange-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Commandes & Livraison */}
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">
              Commandes & Livraison
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.commandes.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition hover:text-orange-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Paiement */}
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Paiement</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.paiement.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition hover:text-orange-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendeurs */}
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Vendeurs</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.vendeurs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition hover:text-orange-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App download */}
          <div className="sm:col-span-2">
            <h4 className="mb-4 font-semibold text-gray-900">
              Téléchargez l&apos;app Unpeu
            </h4>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-600">
                Shopping plus facile avec l&apos;application mobile
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:border-orange-200"
                >
                  <Smartphone className="size-5 text-gray-500" />
                  App Store
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:border-orange-200"
                >
                  <Smartphone className="size-5 text-gray-500" />
                  Google Play
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Social & Logo row */}
        <div className="mt-10 flex flex-col items-center gap-6 border-t border-gray-100 pt-8 sm:flex-row sm:justify-between">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo2.png"
              alt="Unpeu"
              width={140}
              height={48}
              className="h-12 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-orange-100 hover:text-orange-600"
              >
                <Icon className="size-5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Payment methods placeholder */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
          <span className="text-xs font-medium text-gray-500">
            Paiement sécurisé
          </span>
          <div className="flex items-center gap-2">
            <span className="rounded border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
              Carte
            </span>
            <span className="rounded border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
              Mobile Money
            </span>
            <span className="rounded border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
              Espèces
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 bg-gray-50/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-center text-sm text-gray-500 sm:text-left">
              © {new Date().getFullYear()} Unpeu. Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-500 transition hover:text-orange-500"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
