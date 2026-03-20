"use client";

import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    href: "/categories/phones",
    label: "Téléphones & Tablettes",
    image: "https://images.unsplash.com/photo-1511707171634-488808c59dbe?w=200&h=200&fit=crop",
  },
  {
    href: "/categories/electronics",
    label: "TV & Electronique",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop",
  },
  {
    href: "/categories/computing",
    label: "Informatique",
    image: "https://images.unsplash.com/photo-1496181132586-9e7e7247fd5d?w=200&h=200&fit=crop",
  },
  {
    href: "/categories/fashion",
    label: "Mode & Vêtements",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop",
  },
  {
    href: "/categories/beauty",
    label: "Beauté & Hygiène",
    image: "https://images.unsplash.com/photo-1596462509314-39caa910a0f?w=200&h=200&fit=crop",
  },
  {
    href: "/categories/supermarket",
    label: "Supermarché & Alimentaire",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop",
  },
  {
    href: "/categories/cars",
    label: "Voitures & Motos",
    image: "https://images.unsplash.com/photo-1549317661-e6594c4c9dbb?w=200&h=200&fit=crop",
  },
  {
    href: "/categories/home",
    label: "Maison & Terrain",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&h=200&fit=crop",
  },
];

const MenuIcons = () => {
  return (
    <section className="w-full rounded-2xl bg-transparent py-12 sm:py-16">
      {/* Section header */}
      

      {/* Category grid */}
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 lg:gap-8">
          {CATEGORIES.map(({ href, label, image }) => (
            <Link
              key={label}
              href={href}
              className="group flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-orange-200/60 sm:p-8"
            >
              {/* Image container */}
              <div className="relative mb-4 aspect-square w-full max-w-[140px] overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-100 transition-all duration-300 group-hover:ring-orange-200/50">
                <Image
                  src={image}
                  alt={label}
                  fill
                  sizes="(max-width: 640px) 140px, 180px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {/* Label */}
              <span className="text-center text-sm font-medium text-gray-700 transition-colors group-hover:text-orange-600 sm:text-base">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuIcons;