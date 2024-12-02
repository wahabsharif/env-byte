import React, { useState, useEffect } from "react";
import axios from "axios";
import { Client, Country } from "@/data/types";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newClient: Client) => void;
};

const AddClient: React.FC<ModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [newClient, setNewClient] = useState<Client>({
    id: 0,
    title: "Mr.", // Set a default value like "Mr." or another valid title
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    mobile: "",
    country_id: 0,
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get("/api/countries");
        console.log("Fetched countries:", res.data); // Log the fetched countries
        setCountries(res.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Changed ${name} to ${value}`); // Log changes to verify
    setNewClient((prev) => ({
      ...prev,
      [name]: value, // Dynamically update the field based on its name
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload

    // Log the current state of newClient to check if the title is set properly
    console.log("Form Submitted, newClient:", newClient);

    if (!newClient.title) {
      setError("Please select a title");
      return;
    }

    if (newClient.first_name && newClient.last_name && newClient.email) {
      onAdd(newClient);
      onClose();
      setError(""); // Clear error if validation passes
    } else {
      setError("Please fill all required fields");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-gray-900/80 backdrop-blur-lg inset-0 p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-center text-thLightGreen">
          Add Client
        </h2>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-200">
              Title
            </label>
            <select
              name="title"
              value={newClient.title}
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
          <div>
            <label className="block text-gray-200 font-bold">First Name</label>
            <input
              type="text"
              name="first_name"
              value={newClient.first_name}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-full"
            />
          </div>
          <div>
            <label className="block text-gray-200 font-bold">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={newClient.last_name}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-full"
            />
          </div>
          <div>
            <label className="block text-gray-200 font-bold">Email</label>
            <input
              type="email"
              name="email"
              value={newClient.email}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-full"
            />
          </div>
          <div>
            <label className="block text-gray-200 font-bold">Phone</label>
            <input
              type="text"
              name="phone"
              value={newClient.phone}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-full"
            />
          </div>
          <div>
            <label className="block text-gray-200 font-bold">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={newClient.mobile}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-full"
            />
          </div>
          <div>
            <label className="block text-gray-200 font-bold">Country</label>
            <select
              name="country_id"
              value={newClient.country_id}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded-full"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.country_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-800 text-white rounded-full hover:bg-blue-600"
            >
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
