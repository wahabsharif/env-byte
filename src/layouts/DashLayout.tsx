import ProtectedRoute from "@/components/auth/ProtectedRoute";
import type { Metadata } from "next";
import SideBar from "@/components/common/SideBar";
import React from "react";
import MobileSideBar from "@/components/common/MobileSideBar";

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
      <div className="flex">
        <SideBar />
        <MobileSideBar />
        <div className="flex-1 p-4">
          <main>{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashLayout;
