import React from "react";
import type { Metadata } from "next";
import NavBar from "@/components/common/NavBar";
import "@/styles/globals.css";

interface WebLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

// Function to generate dynamic metadata
export const generateMetadata = ({
  pageTitle,
}: {
  pageTitle?: string;
}): Metadata => ({
  title: pageTitle ? `${pageTitle} - Env Byte` : "Env Byte",
});

const WebLayout: React.FC<WebLayoutProps> = ({ children }) => {
  return (
    <div className="text-gray-50">
      <header>
        <NavBar />
      </header>
      <main>{children}</main>
    </div>
  );
};

export default WebLayout;
