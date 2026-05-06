import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminFooter } from "@/components/admin/AdminFooter";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const admin = await prisma.user.findFirst({
    where: { clerkId, role: "ADMIN" },
  });
  if (!admin) redirect("/");

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto bg-gray-50/50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <AdminFooter />
    </div>
  );
}
