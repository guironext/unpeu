"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Target,
  BarChart3,
  Settings,
  Handshake,
} from "lucide-react";

const SIDEBAR_LINKS = [
  { href: "/commercial", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/commercial/clients", label: "Clients", icon: Users },
  { href: "/commercial/products", label: "Catalogue", icon: Package },
  { href: "/commercial/deals", label: "Projets & Deals", icon: Handshake },
  { href: "/commercial/quotations", label: "Devis", icon: FileText },
  { href: "/commercial/objectives", label: "Objectifs", icon: Target },
  { href: "/commercial/analytics", label: "Analytiques", icon: BarChart3 },
  { href: "/commercial/settings", label: "Paramètres", icon: Settings },
];

export function CommercialSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 flex-col border-r border-gray-200 bg-gray-50/50">
      <nav className="flex-1 space-y-0.5 p-3">
        {SIDEBAR_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/commercial"
              ? pathname === "/commercial"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
