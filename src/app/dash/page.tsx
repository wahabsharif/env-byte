import ProtectedRoute from "@/components/common/ProtectedRoute";
import DashLayout, { generateMetadata } from "@/components/layouts/DashLayout";

export const metadata = generateMetadata({ pageTitle: "Dashboard" });

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashLayout>
        <></>
      </DashLayout>
    </ProtectedRoute>
  );
}
