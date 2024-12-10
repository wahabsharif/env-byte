import ProjectReports from "@/components/dashboard/ProjectReports";
import DashLayout, { generateMetadata } from "@/layouts/DashLayout";

export const metadata = generateMetadata({ pageTitle: "Dashboard" });

export default function Dashboard() {
  return (
    <DashLayout>
      <ProjectReports />
    </DashLayout>
  );
}
