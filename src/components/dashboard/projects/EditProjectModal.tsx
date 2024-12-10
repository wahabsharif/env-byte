"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Client, Currency, Project } from "@/data/types";
import { FaTimes, FaPlus } from "react-icons/fa";

interface EditProjectModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentProject: Project;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  setIsOpen,
  currentProject,
}) => {
  const [projectType, setProjectType] = useState(currentProject.project_type);
  const [clientId, setClientId] = useState(currentProject.client_id);
  const [projectName, setProjectName] = useState(currentProject.project_name);
  const [currencyId, setCurrencyId] = useState(currentProject.currency_id);
  const [quotedAmount, setQuotedAmount] = useState(
    currentProject.quoted_amount
  );
  const [dealAmount, setDealAmount] = useState(
    currentProject.deal_amount || ""
  );
  const [paidAmount, setPaidAmount] = useState<number[]>(
    Array.isArray(currentProject.paid_amount) ? currentProject.paid_amount : []
  );
  const [description, setDescription] = useState(currentProject.description);
  const [projectNote, setProjectNote] = useState(
    currentProject.project_note || ""
  );
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

  // Update paidAmount if currentProject changes
  useEffect(() => {
    if (Array.isArray(currentProject.paid_amount)) {
      setPaidAmount(currentProject.paid_amount);
    } else if (typeof currentProject.paid_amount === "string") {
      const paidAmounts = currentProject.paid_amount
        .split(",")
        .map((amt) => Number(amt.trim()))
        .filter((amt) => !isNaN(amt));
      setPaidAmount(paidAmounts);
    } else {
      setPaidAmount([]);
    }
  }, [currentProject]);

  const handleAddPayment = () => {
    setPaidAmount([...paidAmount, 0]);
  };

  const handleRemovePayment = (index: number) => {
    const updatedPaidAmount = paidAmount.filter((_, i) => i !== index);
    setPaidAmount(updatedPaidAmount);
  };

  const handlePaymentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.trim() === "" ? 0 : Number(e.target.value);

    if (!isNaN(value)) {
      const updatedPaidAmount = [...paidAmount];
      updatedPaidAmount[index] = value;
      setPaidAmount(updatedPaidAmount);
    } else {
      console.error("Invalid value entered:", e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/projects/${currentProject.id}`, {
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
      console.error("Error editing project:", error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
        <div className="bg-gray-900/80 backdrop-blur-lg inset-0 p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl mb-4 font-bold text-gray-200">Edit Project</h2>
          <form onSubmit={handleSubmit} className="h-full">
            {/* Client Selection */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-200">
                Client
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(Number(e.target.value))}
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

            {/* Project Name */}
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

            {/* Project Type */}
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

            {/* Currency Selection */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-200">
                Currency
              </label>
              <select
                value={currencyId}
                onChange={(e) => setCurrencyId(Number(e.target.value))}
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

            {/* Quoted Amount */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-200">
                Quoted Amount
              </label>
              <input
                type="number"
                value={quotedAmount}
                onChange={(e) => setQuotedAmount(Number(e.target.value))}
                className="w-full p-2 border rounded-full"
                required
              />
            </div>

            {/* Deal Amount */}
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

            {/* Paid Amounts Section */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-200">
                Paid Amounts
              </label>
              {paidAmount.length === 0 && (
                <div className="text-red-800 tracking-widest text-md">
                  No payment Received.
                </div>
              )}
              {paidAmount.map((amount, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => handlePaymentChange(e, index)}
                    className="w-full p-2 my-1 border rounded-full"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemovePayment(index)}
                    className="text-white bg-red-900 p-2 rounded-full"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddPayment}
                className="bg-thGreen text-white px-2 py-1 rounded-full mt-2 flex justify-center items-center"
              >
                <FaPlus className="mr-2 text-sm" />
                Add Payment
              </button>
            </div>

            {/* Description */}
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

            {/* Project Note */}
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

            {/* Buttons */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-full"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-full"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditProjectModal;
