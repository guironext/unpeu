"use client";

import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { ShoppingCart, Search, Menu, X, HelpCircle, ChevronDown, Star, Truck, Store, User, Phone } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const CATEGORIES = [
  { href: "/categories/phones", label: "Téléphones & Tablettes" },
  { href: "/categories/electronics", label: "TV & Electronique" },
  { href: "/categories/fashion", label: "Informatique" },
  { href: "/categories/fashion", label: "Mode & Vêtements" },
  { href: "/categories/beauty", label: "Beauté & Hygiène" },
  { href: "/categories/supermarket", label: "Supermarché & Alimentaire" },
  { href: "/categories/home", label: "Voitures & Motos" },
  { href: "/categories/home", label: "Maison & Terrain" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      {/* Top utility bar - Jumia style */}
      <div className="border-b border-gray-100  backdrop-blur-sm bg-orange-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-1.5 sm:px-6 sm:py-2">
          <Link
            href="/"
            className="flex flex-col min-h-9 items-start  text-xs font-medium text-gray-700 transition hover:text-orange-500 sm:text-sm"
          >
            <p className="flex gap-2">
            <Star className="size-3.5 shrink-0 fill-orange-500 text-orange-500 sm:size-4" />
            <span className="truncate">Vendez sur Unpeu</span>
            </p>
            <p className="flex gap-2 ">
            <Phone className="size-3.5 shrink-0 fill-orange-500 text-orange-500 sm:size-4" />
            <span className="truncate font-bold">Appelez-nous</span>
            <span className="truncate font-bold">+225 07 07 15 43 98</span>
            </p>
          </Link>
          <div className="hidden items-center gap-4 sm:flex sm:gap-6">
            <Link href="/" className="relative flex h-12 w-28 shrink-0 items-center sm:h-14 sm:w-32">
              <Image
                src="/logo2.png"
                alt="Unpeu-Unpeu"
                fill
                className="object-contain"
                sizes="(min-width: 640px) 128px, 112px"
              />
            </Link>
            <Link href="/delivery" className="flex shrink-0 items-center gap-1.5 text-xs text-gray-600 hover:text-orange-500 sm:text-sm">
              <Truck className="size-3.5 sm:size-4" />
              Livraison
            </Link>
            <Link href="/sign-in" className="flex shrink-0 items-center gap-1.5 text-xs text-gray-600 hover:text-orange-500 sm:text-sm">
              <Store className="size-3.5 sm:size-4" />
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="flex min-h-14 items-center justify-between gap-2 py-3 sm:gap-4 sm:py-4">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="relative block h-14 w-36 shrink-0 sm:h-18 sm:w-44 md:h-22 md:w-52">
              <Image
                src="/logo2.png"
                alt="Unpeu-Unpeu"
                fill
                className="object-contain"
                sizes="(min-width: 768px) 208px, (min-width: 640px) 176px, 144px"
              />
            </Link>

            {/* Search bar with Rechercher button - Jumia style */}
            <form className="relative hidden min-w-0 flex-1 max-w-2xl md:flex" action="/search">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                name="q"
                placeholder="Cherchez un produit, une marque ou une catégorie"
                className="min-w-0 flex-1 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-500 focus:border-orange-400 focus:bg-white focus:ring-1 focus:ring-orange-400 md:py-3"
              />
              <button
                type="submit"
                className="shrink-0 rounded-r-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 md:px-6 md:py-3"
              >
                Rechercher
              </button>
            </form>

            {/* User actions - Jumia style */}
            <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
              <Show when="signed-out">
                <Link
                  href="/sign-in"
                  className="flex min-h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-orange-500 sm:min-w-0 sm:justify-start sm:px-3"
                >
                  <User className="size-5 shrink-0 text-gray-500" />
                  <span className="hidden sm:inline">Se connecter</span>
                  <ChevronDown className="hidden size-4 text-gray-400 md:inline" />
                </Link>
                <Link
                  href="/sign-up"
                  className="hidden min-h-9 items-center rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 sm:inline-flex sm:px-4"
                >
                  S&apos;inscrire
                </Link>
              </Show>
              <Show when="signed-in">
                <Link
                  href="/account/orders"
                  className="hidden min-h-9 items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-orange-500 sm:flex sm:px-3"
                >
                  <span>Commandes</span>
                  <ChevronDown className="size-4 shrink-0 text-gray-400" />
                </Link>
              </Show>
              <Link
                href="/help"
                className="flex min-h-9 min-w-9 items-center justify-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-orange-500 sm:min-w-0 sm:justify-start sm:px-3"
              >
                <HelpCircle className="size-5 shrink-0 text-gray-500" />
                <span className="hidden md:inline">Aide</span>
                <ChevronDown className="hidden size-4 text-gray-400 sm:inline" />
              </Link>
              <Link
                href="/cart"
                className="flex min-h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-orange-500 sm:min-w-0 sm:justify-start sm:px-3"
              >
                <ShoppingCart className="size-5 shrink-0" />
                <span className="hidden md:inline">Panier</span>
              </Link>
              <Show when="signed-in">
                <div className="border-l border-gray-200 pl-1.5 sm:pl-2">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "size-8 ring-1 ring-gray-200",
                      },
                    }}
                  />
                </div>
              </Show>
            </div>
          </div>

          {/* Mobile search */}
          <form className="relative pb-3 md:hidden" action="/search">
            <div className="flex min-w-0 overflow-hidden rounded-lg border border-gray-200">
              <Search className="absolute left-3 top-1/2 size-4 shrink-0 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                name="q"
                placeholder="Cherchez un produit, une marque..."
                className="min-w-0 flex-1 py-2.5 pl-9 pr-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="shrink-0 bg-orange-500 px-3 text-sm font-semibold text-white sm:px-4"
              >
                Rechercher
              </button>
            </div>
          </form>
        </div>

        {/* Categories nav */}
        <nav className="hidden border-t border-gray-100 lg:block">
          <div className="mx-auto max-w-7xl px-3 sm:px-6">
            <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-hide sm:gap-2 sm:py-3">
              {CATEGORIES.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="shrink-0 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-orange-50 hover:text-orange-600 sm:px-3"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(20rem,85vw)] transform bg-white shadow-xl transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <span className="font-semibold text-gray-900">Menu</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {CATEGORIES.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-6 border-t border-gray-100 pt-4">
              <Link
                href="/sell"
                className="flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-3 text-sm font-medium text-orange-600"
              >
                <Star className="size-4 fill-orange-500 text-orange-500" />
                Vendez sur Unpeu
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
