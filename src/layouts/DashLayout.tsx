import ProtectedRoute from "@/components/auth/ProtectedRoute";
import type { Metadata } from "next";
import SideBar from "@/components/common/SideBar";
import React from "react";
import MobileSideBar from "@/components/common/MobileSideBar";
import "@/styles/dash.css";

export const generateMetadata = ({
  pageTitle,
}: {
  pageTitle?: string;
}): Metadata => ({
  title: pageTitle ? `${pageTitle} - Env Byte` : "Env Byte",
});

interface DashLayoutProps {
  children: React.ReactNode;
}

const DashLayout: React.FC<DashLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <SideBar />
        <MobileSideBar />
        <main className="min-h-screen w-full py-2 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashLayout;
