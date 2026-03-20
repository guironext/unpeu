"use client";

import Link from "next/link";
import { ChevronRight, Smartphone, Tv, Laptop, Shirt, Sparkles, ShoppingCart, Car, Home } from "lucide-react";
import { useState, useEffect } from "react";

const CATEGORIES = [
  { href: "/categories/phones", label: "Téléphones & Tablettes", icon: Smartphone },
  { href: "/categories/electronics", label: "TV & Electronique", icon: Tv },
  { href: "/categories/computing", label: "Informatique", icon: Laptop },
  { href: "/categories/fashion", label: "Mode & Vêtements", icon: Shirt },
  { href: "/categories/beauty", label: "Beauté & Hygiène", icon: Sparkles },
  { href: "/categories/supermarket", label: "Supermarché & Alimentaire", icon: ShoppingCart },
  { href: "/categories/cars", label: "Voitures & Motos", icon: Car },
  { href: "/categories/home", label: "Maison & Terrain", icon: Home },
];

const SLIDES = [
  {
    title: "Électronique & High-Tech",
    subtitle: "Découvrez les dernières nouveautés à prix imbattables",
    cta: "J'achète",
    badge: "Livraison gratuite dès 25 000 FCFA",
    gradient: "from-orange-500 via-amber-500 to-orange-600",
    pattern: "hero-pattern-1",
  },
  {
    title: "Mode & Style",
    subtitle: "Toute la mode pour toute la famille",
    cta: "Découvrir",
    badge: "Jusqu'à -50% sur une sélection",
    gradient: "from-amber-600 via-orange-500 to-amber-700",
    pattern: "hero-pattern-2",
  },
  {
    title: "Supermarché & Alimentaire",
    subtitle: "Courses livrées à domicile en 24h",
    cta: "Commander",
    badge: "Frais de livraison réduits",
    gradient: "from-orange-600 via-amber-600 to-orange-700",
    pattern: "hero-pattern-3",
  },
];

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-transparent backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl">
        {/* Left sidebar - categories */}
        <aside className="hidden w-56 shrink-0 border-r border-gray-100 bg-white/90 lg:block mt-2">
          <nav className="py-4 border-b border-gray-100 rounded-lg shadow-sm shadow-mauve-50">
            <div className="px-4 pb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Catégories
              </h2>
            </div>
            <ul className="space-y-0.5">
              {CATEGORIES.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                  >
                    <Icon className="size-5 shrink-0 text-gray-400" strokeWidth={1.5} />
                    <span className="truncate">{label}</span>
                    <ChevronRight className="ml-auto size-4 shrink-0 text-gray-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main carousel */}
        <div className="relative min-h-[320px] flex-1 sm:min-h-[380px] md:min-h-[420px] my-2">
          {SLIDES.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                index === activeSlide ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            >
              <div
                className={`relative flex h-full min-h-[320px] items-end overflow-hidden rounded-r-xl bg-linear-to-br ${slide.gradient} sm:min-h-[380px] md:min-h-[420px]`}
              >
                {/* Decorative pattern overlay */}
                <div
                  className={`absolute inset-0 opacity-10 ${slide.pattern}`}
                  aria-hidden
                />

                {/* Content */}
                <div className="relative z-10 flex w-full flex-col justify-between p-6 sm:p-8 md:p-10">
                  {/* Badge */}
                  <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                    <span className="inline-flex rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                      {slide.badge}
                    </span>
                  </div>

                  <div className="mt-12 sm:mt-16" />

                  <div className="flex flex-col gap-4 sm:gap-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white drop-shadow-sm sm:text-3xl md:text-4xl">
                        {slide.title}
                      </h2>
                      <p className="mt-1 max-w-md text-sm text-white/90 sm:text-base">
                        {slide.subtitle}
                      </p>
                    </div>

                    <Link
                      href="/categories"
                      className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-orange-600 shadow-xl transition-all hover:scale-[1.02] hover:bg-orange-50 hover:shadow-2xl"
                    >
                      {slide.cta}
                      <ChevronRight className="size-5" />
                    </Link>
                  </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10" />
                <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-black/5" />
              </div>
            </div>
          ))}

          {/* Pagination dots */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeSlide
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Aller au slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile categories strip */}
      <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3 lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.slice(0, 6).map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-gray-100 transition hover:bg-orange-50 hover:text-orange-600"
            >
              <Icon className="size-4 text-orange-500" strokeWidth={1.5} />
              <span className="whitespace-nowrap">{label.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
