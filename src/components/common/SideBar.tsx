"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { sideBarData } from "@/data/sideBarData";
import Link from "next/link";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { SiAuthy } from "react-icons/si";

const SideBar = () => {
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the 'userInfo' object from sessionStorage
    const userInfo = sessionStorage.getItem("userInfo");

    if (userInfo) {
      try {
        // Parse the JSON string and extract the first_name
        const parsedUserInfo = JSON.parse(userInfo);
        setFirstName(parsedUserInfo.first_name);
      } catch (error) {
        console.error("Failed to parse userInfo from sessionStorage", error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear all session data
    sessionStorage.clear();
    // Optionally, you can redirect the user after logout
    window.location.href = "/"; // Redirects to home or login page
  };

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="shadow-lg flex-col rounded-r-xl min-h-screen p-2 w-48 bg-gray-800 text-white top-0 left-0 hidden lg:flex "
      // className="fixed w-48 "
    >
      <h1 className="text-xl flex justify-center items-center font-bold tracking-wider text-thLightGreen mb-2 text-center">
        <SiAuthy className="mx-2 " />
        {firstName}
      </h1>
      <nav className="flex-1">
        <ul>
          {sideBarData.map((item, index) => {
            return (
              <motion.li
                key={index}
                className="p-2 mb-2 bg-thGreen rounded-lg shadow-xl cursor-pointer"
                whileHover={{
                  scale: 1.05, // Scale effect on hover
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  href={item.path}
                  className="flex items-center space-x-4 w-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-md text-gray-300 font-bold"
                  >
                    <item.icon />
                  </motion.div>
                  <span className="text-md">{item.title}</span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Buttons Section */}
      <div className="mt-auto border-t-2 pt-4 space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="w-full p-2 text-md font-semibold text-white bg-thGreen rounded-lg shadow-xl flex items-center justify-start space-x-4"
        >
          <FiSettings className="text-xl" />
          <span>Settings</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="w-full p-2 text-md font-semibold text-white bg-thGreen rounded-lg shadow-xl flex items-center justify-start space-x-4"
          onClick={handleLogout}
        >
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default SideBar;
