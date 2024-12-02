"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ClientEditModal from "@/components/dashboard/clients/ClientEditModal";
import AddClient from "@/components/dashboard/clients/AddClient";

type Client = {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  country_id: number;
};

type Country = {
  id: number;
  country_name: string; // Changed to match the API response
};

const ClientsList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch clients and countries when the component mounts
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("/api/clients");
        console.log("Fetched clients:", res.data); // Log the fetched data
        setClients(res.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    const fetchCountries = async () => {
      try {
        const res = await axios.get("/api/countries");
        setCountries(res.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchClients();
    fetchCountries();
  }, []);

  // Handle editing the client
  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  // Handle deleting the client
  const handleDelete = async (id: number) => {
    const clientToDelete = clients.find((client) => client.id === id);
    if (clientToDelete) {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete: (${clientToDelete.first_name} ${clientToDelete.last_name})?`
      );
      if (confirmDelete) {
        try {
          const res = await axios.delete(`/api/clients/${id}`);
          if (res.status === 204) {
            setClients((prevClients) =>
              prevClients.filter((client) => client.id !== id)
            );
          } else {
            alert("Failed to delete client");
          }
        } catch (error) {
          console.error("Error deleting client:", error);
          alert("An unexpected error occurred while deleting the client.");
        }
      }
    }
  };

  // Handle saving the updated client and re-fetch the list of clients
  const handleSave = async (updatedClient: Client) => {
    try {
      const res = await axios.put(
        `/api/clients/${updatedClient.id}`,
        updatedClient
      );
      if (res.status === 200) {
        // After saving, re-fetch the client list to ensure it is updated
        const updatedClients = await axios.get("/api/clients");
        setClients(updatedClients.data); // Set the updated client list
      } else {
        alert("Failed to update client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Failed to update client");
    }
  };

  // Handle adding a new client
  const handleAddClient = async (newClient: Client) => {
    console.log("Adding new client:", newClient);

    try {
      const res = await axios.post("/api/clients", newClient);
      console.log("New client response:", res);
      if (res.status === 201) {
        setClients((prevClients) => [...prevClients, res.data]);
        handleCloseAddModal(); // Close modal after successful add
      } else {
        alert("Failed to add client");
      }
    } catch (error: unknown) {
      console.error("Error adding client:", error);
      if (error instanceof Error) {
        alert(`Failed to add client: ${error.message}`);
      } else {
        alert("An unexpected error occurred while adding the client.");
      }
    }
  };

  // Close modal handlers
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Get country name from country ID
  const getCountryName = (countryId: number) => {
    const country = countries.find((country) => country.id === countryId);
    return country ? country.country_name : "Unknown";
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4 text-center text-thLightGreen">
          Clients List
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Client
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white rounded-xl">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left text-sm font-bold text-gray-600">
                Title
              </th>
              <th className="py-2 px-4 text-left text-sm font-bold text-gray-600">
                Name
              </th>
              <th className="py-2 px-4 text-left text-sm font-bold text-gray-600">
                Email
              </th>
              <th className="py-2 px-4 text-left text-sm font-bold text-gray-600">
                Phone
              </th>
              <th className="py-2 px-4 text-left text-sm font-bold text-gray-600">
                Country
              </th>
              <th className="py-2 px-4 text-left text-sm font-bold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client.id} className="border-gray-200">
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {client.title ?? "N/A"}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {client.first_name} {client.last_name}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {client.email}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {client.phone || client.mobile}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600">
                    {getCountryName(client.country_id)}{" "}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600 space-y-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="bg-green-950 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No clients available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedClient && (
        <ClientEditModal
          isOpen={isModalOpen}
          client={selectedClient}
          countries={countries}
          onClose={handleCloseModal}
          onSave={handleSave} // This will trigger the client update
        />
      )}

      <AddClient
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAddClient}
      />
    </div>
  );
};

export default ClientsList;
