import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashLayout, { generateMetadata } from "@/layouts/DashLayout";

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
