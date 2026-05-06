"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-gray-900 hover:text-orange-500 transition"
          >
            <LayoutDashboard className="size-5" />
            <span className="font-semibold">Admin</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-orange-500 transition"
          >
            <ArrowLeft className="size-4" />
            <span>Retour au site</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="relative hidden h-8 w-20 sm:block">
            <Image
              src="/logo2.png"
              alt="Unpeu"
              fill
              className="object-contain"
              sizes="80px"
            />
          </Link>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-8 ring-1 ring-gray-200",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
