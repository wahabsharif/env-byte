import ProjectList from "@/components/dashboard/projects/ProjectList";
import DashLayout, { generateMetadata } from "@/layouts/DashLayout";

export const metadata = generateMetadata({ pageTitle: "Projects" });

export default function Projects() {
  return (
    <DashLayout>
      <ProjectList />
    </DashLayout>
  );
}
