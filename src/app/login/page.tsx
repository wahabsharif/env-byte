"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/users/login", {
        username,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data;

        dispatch(
          setCredentials({
            ...user, // Spread first_name, last_name, and role
            token,
          })
        );

        // Redirect to the admin page after login
        router.push("/dash");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid username or password, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 p-10 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">
          Login
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-100">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-100">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800"
            />
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <button
              type="submit"
              className="w-full p-2 uppercase border-2 font-madenz border-thLightGreen rounded-tr-lg rounded-br-2xl bg-thLightGreen text-white hover:bg-gray-900 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-thLightGreen focus:ring-offset-2"
            >
              Login
            </button>
          </motion.div>
        </form>

        {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      </div>
    </div>
  );
}
