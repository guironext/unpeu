import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import "./globals.css";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { UserSync } from "@/components/UserSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unpeu-Unpeu | Vente en ligne",
  description: "Achetez en ligne - Électronique, Mode, Supermarché et plus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr">
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
          suppressHydrationWarning
        >
          <UserSync />
          <ConditionalLayout>{children}</ConditionalLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
