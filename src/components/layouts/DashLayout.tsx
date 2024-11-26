import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

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
    <div>
      <aside className="text-gray-50">
        <nav>
          <h1 className="text-5xl">Admin Dashboard</h1>
          <ul className="m-5 text-xl">
            <li>
              <Link href="/">Home</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main style={{ marginLeft: "200px", padding: "20px" }}>{children}</main>
    </div>
  );
};

export default DashLayout;
