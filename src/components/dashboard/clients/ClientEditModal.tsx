import React, { useState, useEffect } from "react";

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
  country_name: string;
};

type ModalProps = {
  isOpen: boolean;
  client: Client;
  countries: Country[];
  onClose: () => void;
  onSave: (updatedClient: Client) => void;
};

const ClientEditModal: React.FC<ModalProps> = ({
  isOpen,
  client,
  countries,
  onClose,
  onSave,
}) => {
  const [updatedClient, setUpdatedClient] = useState<Client>(client);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setUpdatedClient(client); // This will ensure the modal reflects the latest client data
  }, [client]); // Re-run when the client prop changes

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      updatedClient.title &&
      updatedClient.first_name &&
      updatedClient.last_name &&
      updatedClient.email
    ) {
      onSave(updatedClient);
      onClose();
      setError(""); // Clear error
    } else {
      setError("Please fill all required fields");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-gray-900/80 backdrop-blur-lg inset-0 p-6 rounded-lg shadow-lg w-11/12 sm:w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-thLightGreen">
          Edit Client
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-200">Title</label>
          <select
            name="title"
            value={updatedClient.title}
            onChange={handleChange}
            className="w-full p-2 rounded-full"
          >
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Dr.">Dr.</option>
            <option value="Prof.">Prof.</option>
            <option value="Ms.">Ms.</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-200">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            value={updatedClient.first_name}
            onChange={handleChange}
            className="w-full border p-2 rounded-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-200">
            Last Name
          </label>
          <input
            type="text"
            name="last_name"
            value={updatedClient.last_name}
            onChange={handleChange}
            className="w-full border p-2 rounded-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-200">Email</label>
          <input
            type="email"
            name="email"
            value={updatedClient.email}
            onChange={handleChange}
            className="w-full border p-2 rounded-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-200">Phone</label>
          <input
            type="text"
            name="phone"
            value={updatedClient.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-200">
            Mobile
          </label>
          <input
            type="text"
            name="mobile"
            value={updatedClient.mobile}
            onChange={handleChange}
            className="w-full border p-2 rounded-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-200">
            Country
          </label>
          <select
            name="country_id"
            value={updatedClient.country_id}
            onChange={handleChange}
            className="w-full p-2 rounded-full"
          >
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.country_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-full hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-800 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientEditModal;
