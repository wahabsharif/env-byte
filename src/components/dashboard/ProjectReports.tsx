"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useRouter } from "next/navigation"; // Next.js navigation hook

// Register the chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Type definition for the project data
interface Project {
  quoted_amount: number;
  deal_amount: number;
  paid_amount: number[] | number; // paid_amount can either be a number or an array of numbers
}

// Helper function to format numbers as currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {}).format(amount);
};

const ProjectReports: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // Initialize the Next.js router

  useEffect(() => {
    // Fetch project data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/projects");
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means it runs once on component mount

  // Calculate the total quoted_amount, deal_amount, paid_amount, and pending_amount
  const totalQuotedAmount = projects.reduce(
    (acc, project) => acc + project.quoted_amount,
    0
  );
  const totalDealAmount = projects.reduce(
    (acc, project) => acc + project.deal_amount,
    0
  );
  const totalPaidAmount = projects.reduce((acc, project) => {
    // Ensure paid_amount is an array before calling .reduce()
    const paidAmount = Array.isArray(project.paid_amount)
      ? project.paid_amount.reduce((sum, amt) => sum + amt, 0)
      : project.paid_amount || 0; // If it's not an array, use the value directly (fallback to 0 if undefined)

    return acc + paidAmount;
  }, 0);
  const totalPendingAmount = totalDealAmount - totalPaidAmount;

  // Prepare the data for the Doughnut chart
  const data = {
    labels: ["Quoted Amount", "Deal Amount", "Paid Amount", "Pending Amount"],
    datasets: [
      {
        label: "Project Summary",
        data: [
          totalQuotedAmount,
          totalDealAmount,
          totalPaidAmount,
          totalPendingAmount,
        ],
        backgroundColor: ["#FF6F61", "#F5A623", "#166534", "#991b1b"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Options for animated chart
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to resize freely
    plugins: {
      tooltip: {
        enabled: true,
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    onClick: () => {
      router.push("/dashboard/projects");
    },
  };

  // Loading and error handling
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-thLightGreen text-center">
        Project Financial Report
      </h1>
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Doughnut Chart Section */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="w-72 h-72 sm:w-96 sm:h-96 cursor-pointer">
            <Doughnut data={data} options={options} />
          </div>
        </div>

        {/* Summary Section */}
        <div className="w-full lg:w-1/2 flex flex-col text-gray-300 space-y-4">
          <p className="text-sm md:text-lg font-medium p-2 rounded-lg bg-[#FF6F61] text-center">
            <strong>Total Quoted Amount:</strong>{" "}
            {formatCurrency(totalQuotedAmount)}
          </p>
          <p className="text-sm md:text-lg font-medium p-2 rounded-lg bg-[#F5A623] text-center">
            <strong>Total Deal Amount:</strong>{" "}
            {formatCurrency(totalDealAmount)}
          </p>
          <p className="text-sm md:text-lg font-medium p-2 rounded-lg bg-[#166534] text-center">
            <strong>Total Paid Amount:</strong>{" "}
            {formatCurrency(totalPaidAmount)}
          </p>
          <p className="text-sm md:text-lg font-medium p-2 rounded-lg bg-[#991b1b] text-center">
            <strong>Total Pending Amount:</strong>{" "}
            {formatCurrency(totalPendingAmount)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectReports;
