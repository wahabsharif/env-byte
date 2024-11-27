"use client";

import React, { useState } from "react";
import { navBarData } from "@/data/navBarData";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TiArrowSortedUp } from "react-icons/ti";
import dynamic from "next/dynamic";

const NavBar: React.FC = () => {
  const [submenuOpenIndex, setSubmenuOpenIndex] = useState<number | null>(null);

  return (
    <nav className="bg-gray-900 dark:bg-gray-800/70 backdrop-blur-md fixed top-8 left-1/2 transform -translate-x-1/2 w-[95%] z-50 rounded-xl shadow-lg hidden md:block transition ease-in-out">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Left Side: Logo and Menu */}
        <div className="flex items-center space-x-6">
          <Link href="/">
            <Image
              src="/images/logo/env-byte-landscape-logo.svg"
              alt="Logo"
              width={1000}
              height={1000}
              priority
              className="w-28"
            />
          </Link>

          {/* Center: Menu */}
          <div className="relative">
            <ul className="flex space-x-6">
              {navBarData.map((menuItem, index) => {
                if (menuItem.isButton) return null;
                return (
                  <motion.li
                    key={menuItem.label}
                    className="relative group text-black dark:text-white"
                    onMouseEnter={() =>
                      menuItem.submenu && setSubmenuOpenIndex(index)
                    }
                    onMouseLeave={() => setSubmenuOpenIndex(null)}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link href={menuItem.href}>
                      <motion.div
                        whileHover={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="flex items-center "
                      >
                        {menuItem.label}
                        {/* Arrow Icon - Appears when submenu exists */}
                        {menuItem.submenu && (
                          <motion.div
                            className="ml-1"
                            initial={{ rotate: 0 }}
                            animate={{
                              rotate: submenuOpenIndex === index ? 180 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <TiArrowSortedUp />
                          </motion.div>
                        )}
                      </motion.div>
                    </Link>
                    {/* Submenu */}
                    <AnimatePresence>
                      {menuItem.submenu && submenuOpenIndex === index && (
                        <motion.ul
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-48 space-y-1"
                        >
                          {menuItem.submenu.map((submenuItem) => (
                            <motion.li
                              key={submenuItem.label}
                              whileHover={{
                                scale: 1.1,
                              }}
                              transition={{ type: "spring", stiffness: 200 }}
                              className="bg-gray-900 dark:bg-gray-800 backdrop-blur-md rounded-xl shadow-lg "
                            >
                              <Link
                                href={submenuItem.href}
                                className="block px-4 py-2"
                              >
                                {submenuItem.label}
                              </Link>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right Side: Buttons */}
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Link
              href={"#"}
              className="p-2 uppercase border-2 font-madenz border-thLightGreen rounded-tl-2xl rounded-bl-lg"
            >
              Get A Quote
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Link
              href={"/login"}
              className="p-2 uppercase border-2 font-madenz border-thLightGreen rounded-tr-lg rounded-br-2xl"
            >
              Login
            </Link>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default dynamic(() => Promise.resolve(NavBar), { ssr: false });
