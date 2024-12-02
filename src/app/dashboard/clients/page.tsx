import ClientsList from "@/components/dashboard/clients/ClientsList";
import DashLayout, { generateMetadata } from "@/layouts/DashLayout";

export const metadata = generateMetadata({ pageTitle: "Clients" });

export default function Clients() {
  return (
    <DashLayout>
      <ClientsList />
    </DashLayout>
  );
}
