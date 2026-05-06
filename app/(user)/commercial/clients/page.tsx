import { ClientsContent } from "./ClientsContent";
import { getCommercialClientsData } from "./actions";
import { redirect } from "next/navigation";

export default async function ClientsPage() {
  const data = await getCommercialClientsData();
  if (data === null) redirect("/");

  return <ClientsContent data={data} />;
}
