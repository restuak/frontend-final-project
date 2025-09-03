"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300  ${
        scrolled ? "bg-rose-50 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
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

        {/* Desktop */}
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

        {/* Mobile */}
        <div className="md:hidden flex items-center space-x-2">
          <Link
            href="/auth/signin"
            className="p-2 rounded-full bg-[#C53678] text-white hover:bg-white hover:text-[#C53678] border-2 border-[#C53678] transition"
          >
            <User size={20} />
          </Link>
          
        </div>
      </div>
    </nav>
  );
}
