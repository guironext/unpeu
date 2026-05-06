"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const MAISON_PRODUCTS = [
  {
    id: "m1",
    name: "Mixeur Blender 2 en 1 - 500W",
    price: 15000,
    originalPrice: 28000,
    discount: 46,
    image: "/logo1.png",
  },
  {
    id: "m2",
    name: "Réfrigérateur 121L - Classe A",
    price: 121500,
    originalPrice: 185000,
    discount: 34,
    image: "/logo2.png",
  },
  {
    id: "m3",
    name: "Four Micro-ondes 20L - Noir",
    price: 33000,
    originalPrice: 52000,
    discount: 37,
    image: "/logo3.png",
  },
  {
    id: "m4",
    name: "Aspirateur Sans Fil - 2 en 1",
    price: 24500,
    originalPrice: 42000,
    discount: 42,
    image: "/logo1.png",
  },
  {
    id: "m5",
    name: "Fer à Repasser Vapeur - 1800W",
    price: 8900,
    originalPrice: 15000,
    discount: 41,
    image: "/logo2.png",
  },
  {
    id: "m6",
    name: "Bouilloire Électrique 1.8L",
    price: 6500,
    originalPrice: 12000,
    discount: 46,
    image: "/logo3.png",
  },
  {
    id: "m7",
    name: "Étagère Murale 5 Niveaux",
    price: 12500,
    originalPrice: 22000,
    discount: 43,
    image: "/logo1.png",
  },
  {
    id: "m8",
    name: "Lampe LED Bureau - USB",
    price: 4200,
    originalPrice: 8500,
    discount: 51,
    image: "/logo2.png",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function BestSellers() {
  return (
    <section className="mt-6 rounded-xl border border-gray-100 bg-white/95 backdrop-blur-sm p-4 shadow-sm sm:p-6">
      {/* Header - Jumia style */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
          Semaine de la maison | Offres à saisir
        </h2>
        <Link
          href="/maison"
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-sm font-bold text-orange-600 transition-colors hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:outline-offset-2"
        >
          Voir tout
          <ChevronRight className="size-4" />
        </Link>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {MAISON_PRODUCTS.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white transition hover:border-orange-200 hover:shadow-md"
          >
              {/* Image container */}
              <div className="relative aspect-square bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-2 transition group-hover:scale-105"
                  sizes="160px"
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
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
