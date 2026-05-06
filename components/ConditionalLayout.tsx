"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

export function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col">{children}</main>
      <Footer />
    </>
  );
}
