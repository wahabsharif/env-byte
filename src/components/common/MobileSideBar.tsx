"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { sideBarData } from "@/data/sideBarData";
import Link from "next/link";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { SiAuthy } from "react-icons/si";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const MobileSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);

  React.useEffect(() => {
    const userInfo = sessionStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        setFirstName(parsedUserInfo.first_name);
      } catch (error) {
        console.error("Failed to parse userInfo from sessionStorage", error);
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/"; // Redirect to home or login page
  };

  return (
    <div className="lg:hidden">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1 z-50 p-2 bg-thGreen text-white rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? "left-44" : "left-1"
        }`}
      >
        {isOpen ? <FaArrowLeft size={18} /> : <FaArrowRight size={18} />}
      </motion.button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : -250 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-48 bg-gray-800 text-white p-3 shadow-lg flex flex-col rounded-r-xl z-40"
      >
        <h1 className="text-xl flex justify-center items-center font-bold tracking-wider text-thLightGreen mb-2 text-center">
          <SiAuthy className="mx-2" />
          {firstName}
        </h1>
        <nav className="flex-1">
          <ul>
            {sideBarData.map((item, index) => (
              <motion.li
                key={index}
                className="p-2 mb-2 bg-thGreen rounded-lg shadow-xl cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  href={item.path}
                  className="flex items-center space-x-4 w-full"
                  onClick={() => setIsOpen(false)} // Close sidebar on link click
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
            ))}
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
      </motion.div>
    </div>
  );
};

export default MobileSideBar;
