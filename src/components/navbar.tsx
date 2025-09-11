"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "@/store/authstore";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const { user, token, signOut } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayName =
    user?.first_name?.trim() ||
    (user?.email ? user.email.split("@")[0] : "Guest");

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-rose-50 shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/restify_logo.png"
              alt="Restify Logo"
              width={45}
              height={45}
            />
            <span
              className={`text-2xl font-bold ${
                scrolled ? "text-[#25171a]" : "text-[#C53678]"
              }`}
            >
              RESTIFY
            </span>
          </Link>

          {/* Desktop Menu */}
          {!token ? (
            <div className="hidden md:flex space-x-4">
              <Link
                href="/auth/signin"
                className="px-4 py-2 rounded-2xl border-2 border-[#C53678] text-[#C53678] hover:bg-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-2xl bg-[#C53678] text-white hover:bg-white hover:text-[#C53678] border-2 border-[#C53678] transition"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-6">
              <span className="font-semibold text-[#25171a]">
                Hi, {displayName}
              </span>

              {user?.role === "TENANT" ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-[#C53678] hover:underline"
                  >
                    My Dashboard
                  </Link>
                  <Link
                    href="/properties/create"
                    className="text-[#C53678] hover:underline"
                  >
                    Create Properties
                  </Link>
                </>
              ) : (
                <Link href="/rooms" className="text-[#C53678] hover:underline">
                  Pilih Room
                </Link>
              )}

              <Link href="/profile" className="text-[#C53678] hover:underline">
                Profile
              </Link>

              <button
                onClick={signOut}
                className="px-4 py-2 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpenMenu(true)}
              className="p-2 rounded-full bg-[#C53678] text-white hover:bg-white hover:text-[#C53678] border-2 border-[#C53678] transition"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {openMenu && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenMenu(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-50 flex flex-col p-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-[#C53678]">
                  {token ? `Hi, ${displayName}` : "Welcome to Restify"}
                </span>
                <button onClick={() => setOpenMenu(false)}>
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              <div className="flex flex-col space-y-4">
                {!token ? (
                  <>
                    <Link
                      href="/auth/signin"
                      onClick={() => setOpenMenu(false)}
                      className="px-4 py-2 rounded-xl border-2 border-[#C53678] text-[#C53678] hover:bg-[#C53678] hover:text-white transition"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setOpenMenu(false)}
                      className="px-4 py-2 rounded-xl bg-[#C53678] text-white hover:bg-white hover:text-[#C53678] border-2 border-[#C53678] transition"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    {user?.role === "TENANT" ? (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setOpenMenu(false)}
                          className="text-[#C53678] font-medium hover:underline"
                        >
                          My Dashboard
                        </Link>
                        <Link
                          href="/properties/create"
                          onClick={() => setOpenMenu(false)}
                          className="text-[#C53678] font-medium hover:underline"
                        >
                          Create Properties
                        </Link>
                      </>
                    ) : (
                      <Link
                        href="/rooms"
                        onClick={() => setOpenMenu(false)}
                        className="text-[#C53678] font-medium hover:underline"
                      >
                        Pilih Room
                      </Link>
                    )}

                    <Link
                      href="/profile"
                      onClick={() => setOpenMenu(false)}
                      className="text-[#C53678] font-medium hover:underline"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={() => {
                        signOut();
                        setOpenMenu(false);
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
