import { CommercialHeader } from "@/components/commercial/CommercialHeader";
import { CommercialSidebar } from "@/components/commercial/CommercialSidebar";
import { CommercialFooter } from "@/components/commercial/CommercialFooter";

export default function CommercialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <CommercialHeader />
      <div className="flex flex-1">
        <CommercialSidebar />
        <main className="flex-1 overflow-auto bg-white p-4 sm:p-6">
          {children}
        </main>
      </div>
      <CommercialFooter />
    </div>
  );
}
