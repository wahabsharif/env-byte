import React, { useState, useEffect } from "react";
import axios from "axios";
import { Client, Currency } from "@/data/types";

interface AddProjectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [projectType, setProjectType] = useState("");
  const [clientId, setClientId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [currencyId, setCurrencyId] = useState("");
  const [quotedAmount, setQuotedAmount] = useState("");
  const [dealAmount, setDealAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [description, setDescription] = useState("");
  const [projectNote, setProjectNote] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [clientsResponse, currenciesResponse] = await Promise.all([
            axios.get("/api/clients"),
            axios.get("/api/currencies"),
          ]);
          setClients(clientsResponse.data);
          setCurrencies(currenciesResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/projects", {
        project_type: projectType,
        client_id: clientId,
        project_name: projectName,
        currency_id: currencyId,
        quoted_amount: quotedAmount,
        deal_amount: dealAmount,
        paid_amount: paidAmount,
        description,
        project_note: projectNote,
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
        <div className="bg-gray-900/80 backdrop-blur-lg inset-0 p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl mb-4 font-bold text-gray-200">
            Add New Project
          </h2>
          <form onSubmit={handleSubmit} className="h-full">
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-200">
                Client
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full p-2 border rounded-full"
                required
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.first_name} {client.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-200">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-2 border rounded-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-200">
                Project Type
              </label>
              <input
                type="text"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full p-2 border rounded-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-200">
                Currency
              </label>
              <select
                value={currencyId}
                onChange={(e) => setCurrencyId(e.target.value)}
                className="w-full p-2 border rounded-full"
                required
              >
                <option value="">Select a currency</option>
                {currencies.map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.currency_name} ({currency.currency_symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-200">
                Quoted Amount
              </label>
              <input
                type="number"
                value={quotedAmount}
                onChange={(e) => setQuotedAmount(e.target.value)}
                className="w-full p-2 border rounded-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-200">
                Deal Amount
              </label>
              <input
                type="number"
                value={dealAmount}
                onChange={(e) => setDealAmount(e.target.value)}
                className="w-full p-2 border rounded-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-200">
                Paid Amount
              </label>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className="w-full p-2 border rounded-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-200">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-xl"
                rows={4}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-200">
                Project Note
              </label>
              <textarea
                value={projectNote}
                onChange={(e) => setProjectNote(e.target.value)}
                className="w-full p-2 border rounded-xl"
                rows={2}
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded-full mr-2"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-800 text-white px-4 py-2 rounded-full"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddProjectModal;
