"use client";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import AddProjectModal from "./AddProjectModal";
import EditProjectModal from "./EditProjectModal";
import { Project, Client, Currency } from "@/data/types";
import { sanitizeDateTime } from "@/lib/helper";
import { BarLoader } from "react-spinners";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<{ [key: string]: Client }>({});
  const [currencies, setCurrencies] = useState<{ [key: string]: Currency }>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchProjectsClientsAndCurrencies = async () => {
      try {
        setIsLoading(true);

        // Fetching projects first
        const projectResponse = await axios.get("/api/projects");
        const fetchedProjects: Project[] = projectResponse.data;

        // Sort projects by updated_at in descending order
        const sortedProjects = fetchedProjects.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

        setProjects(sortedProjects);

        // Fetching clients and currencies based on the fetched projects
        const clientIds = [
          ...new Set(fetchedProjects.map((project) => project.client_id)),
        ];
        const currencyIds = [
          ...new Set(fetchedProjects.map((project) => project.currency_id)),
        ];

        // Fetch clients and currencies in parallel
        const [clientResponse, currencyResponse] = await Promise.all([
          axios.get(`/api/clients?ids=${clientIds.join(",")}`),
          axios.get(`/api/currencies?ids=${currencyIds.join(",")}`),
        ]);

        const clientMap = clientResponse.data.reduce(
          (acc: { [key: string]: Client }, client: Client) => {
            acc[client.id] = client;
            return acc;
          },
          {}
        );

        const currencyMap = currencyResponse.data.reduce(
          (acc: { [key: string]: Currency }, currency: Currency) => {
            acc[currency.id] = currency;
            return acc;
          },
          {}
        );

        setClients(clientMap);
        setCurrencies(currencyMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectsClientsAndCurrencies();
  }, []);

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (projectId: number) => {
    try {
      await axios.delete(`/api/projects/${projectId}`);
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const formatAmount = (amount: string | number): string => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return num.toLocaleString("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Memoize payment status to avoid recalculating on every render
  const getPaymentStatus = useMemo(
    () => (dealAmount: string, paidAmount: string) => {
      const deal = parseFloat(dealAmount);
      const paid = parseFloat(paidAmount);
      return deal > paid ? "Pending" : "Paid";
    },
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BarLoader width={100} height={4} color="#14b8a6" loading={isLoading} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold mb-4 text-thLightGreen w-full text-center">
          Projects List
        </h1>
        <button
          className="mb-4 bg-green-800 text-white px-2 py-1 rounded-xl text-sm flex-shrink-0"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Project
        </button>
      </div>

      {/* Make table horizontally scrollable */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto bg-white rounded-xl">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-sm text-gray-600">Project Name</th>
              <th className="py-2 px-4 text-sm text-gray-600">Client Name</th>
              <th className="py-2 px-4 text-sm text-gray-600">Project Type</th>
              <th className="py-2 px-4 text-sm text-gray-600">Quoted Amount</th>
              <th className="py-2 px-4 text-sm text-gray-600">Deal Amount</th>
              <th className="py-2 px-4 text-sm text-gray-600">Paid Amount</th>
              <th className="py-2 px-4 text-sm text-gray-600">Description</th>
              <th className="py-2 px-4 text-sm text-gray-600">Note</th>
              <th className="py-2 px-4 text-sm text-gray-600">Project Date</th>
              <th className="py-2 px-4 text-sm text-gray-600">
                Payment Status
              </th>
              <th className="py-2 px-4 text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const client = clients[project.client_id];
              const currency = currencies[project.currency_id];
              const paymentStatus = getPaymentStatus(
                project.deal_amount,
                project.paid_amount
              );

              const paymentStatusClass =
                paymentStatus === "Pending" ? "bg-red-500" : "bg-green-500";

              return (
                <tr key={project.id} className="border-gray-200">
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {project.project_name}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {client
                      ? `${client.first_name} ${client.last_name}`
                      : "Loading..."}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {project.project_type}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {formatAmount(project.quoted_amount)}{" "}
                    {currency?.currency_symbol} ({currency?.currency_name})
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {formatAmount(project.deal_amount)}{" "}
                    {currency?.currency_symbol} ({currency?.currency_name})
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {formatAmount(project.paid_amount)}{" "}
                    {currency?.currency_symbol} ({currency?.currency_name})
                  </td>

                  <td className="py-2 px-4 text-sm text-gray-600">
                    {project.description}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {project.project_note}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {sanitizeDateTime(project.created_at)}
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-center text-gray-300 ${paymentStatusClass} flex items-center justify-center`}
                    >
                      {paymentStatus}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    <div className="flex space-x-2">
                      <button
                        className="bg-green-800 text-white px-2 py-1 rounded-lg"
                        onClick={() => handleEdit(project)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-lg"
                        onClick={() => handleDelete(project.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <AddProjectModal
          isOpen={isAddModalOpen}
          setIsOpen={setIsAddModalOpen}
        />
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && currentProject && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          currentProject={currentProject}
        />
      )}
    </div>
  );
};

export default ProjectList;
