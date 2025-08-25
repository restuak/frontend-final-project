"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Restify Logo" width={36} height={36} />
          <span className="text-2xl font-bold text-[#1A7F64]">RESTIFY</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Button
            asChild
            className="rounded-full bg-transparent text-[#1A7F64] border border-[#1A7F64] hover:bg-[#1A7F64] hover:text-white"
          >
            <Link href="/login">Log In</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-[#1A7F64] text-white hover:bg-[#15664F]"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 rounded-md text-[#1A7F64]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-3">
          <Button
            asChild
            className="rounded-full bg-transparent text-[#1A7F64] border border-[#1A7F64] hover:bg-[#1A7F64] hover:text-white"
          >
            <Link href="/login">Log In</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-[#1A7F64] text-white hover:bg-[#15664F]"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
