"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const DESTOCKAGE_PRODUCTS = [
  {
    id: "1",
    name: "TV LED 50\" Smart TV 4K UHD - Décodeur Intégré",
    price: 124130,
    originalPrice: 210000,
    discount: 41,
    stock: 3,
    image: "/logo1.png",
  },
  {
    id: "2",
    name: "Kit Tondeuses à Cheveux Pour Hommes Avec Affichage LED",
    price: 5320,
    originalPrice: 14000,
    discount: 62,
    stock: 111,
    image: "/logo2.png",
  },
  {
    id: "3",
    name: "Tapis de Bain Absorbant - Antidérapant, Séchage Rapide",
    price: 3190,
    originalPrice: 6900,
    discount: 54,
    stock: 11,
    image: "/logo3.png",
  },
  {
    id: "4",
    name: "Écouteurs Bluetooth Fingerprint Touch 2600mAH",
    price: 2020,
    originalPrice: 3000,
    discount: 33,
    stock: 14,
    image: "/logo1.png",
  },
  {
    id: "5",
    name: "Étagère Murale DVD/Décodeur - Blanc 51CM",
    price: 5695,
    originalPrice: 9800,
    discount: 42,
    stock: 16,
    image: "/logo2.png",
  },
  {
    id: "6",
    name: "Prise Intelligente Minuterie - Blanc",
    price: 5695,
    originalPrice: 8600,
    discount: 34,
    stock: 20,
    image: "/logo3.png",
  },
  {
    id: "7",
    name: "Diffuseur D'Huile Essentielle 500ml Ultrasonique",
    price: 5320,
    originalPrice: 13600,
    discount: 61,
    stock: 20,
    image: "/logo1.png",
  },
  {
    id: "8",
    name: "Montre Intelligente IP67 - Écran 1,99 pouce",
    price: 4705,
    originalPrice: 9800,
    discount: 52,
    stock: 19,
    image: "/logo2.png",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(price);
}

function getTimeLeft() {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  const diff = endOfDay.getTime() - now.getTime();
  if (diff <= 0) return { h: 0, m: 0, s: 0 };
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  return { h, m, s };
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}

export default function Destockage() {
  const { h, m, s } = useCountdown();

  return (
    <section className="rounded-xl border border-gray-100 bg-white/95 backdrop-blur-sm p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-amber-500 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            Destockage
          </h2>
          <div className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5">
            <Clock className="size-4 text-orange-600" />
            <span className="text-xs font-medium text-orange-700 sm:text-sm">
              Se termine dans{" "}
              <span className="font-mono font-bold" suppressHydrationWarning>
                {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:
                {String(s).padStart(2, "0")}
              </span>
            </span>
          </div>
        </div>
        <Link
          href="/destockage"
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-sm font-bold text-orange-600 transition-colors hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2"
        >
          Voir tout
          <ChevronRight className="size-4" />
        </Link>
      </div>

      {/* Product carousel */}
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 sm:gap-4">
          {DESTOCKAGE_PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group flex w-[140px] shrink-0 flex-col overflow-hidden rounded-lg border border-gray-100 bg-white transition hover:border-orange-200 hover:shadow-md sm:w-[200px]"
            >
              {/* Image container */}
              <div className="relative aspect-square bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-2 transition group-hover:scale-105"
                  sizes="200px"
                />
                {/* Discount badge */}
                <span className="absolute left-2 top-2 rounded bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  -{product.discount}%
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-2 text-xs font-medium text-gray-800 group-hover:text-orange-600 sm:text-sm">
                  {product.name}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-sm font-bold text-orange-600 sm:text-base">
                    {formatPrice(product.price)} FCFA
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {product.stock} article{product.stock > 1 ? "s" : ""} restant
                  {product.stock > 1 ? "s" : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
