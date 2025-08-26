"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1600&q=80"
          alt="Destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#FFFAFA]/95 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-[#25171A] mb-6 text-center">
          Sign In to Restify
        </h1>

        <form className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            className="border-[#C53678] focus:ring-[#C53678]"
          />
          <Input
            type="password"
            placeholder="Password"
            className="border-[#C53678] focus:ring-[#C53678]"
          />

          <Button
            type="submit"
            className="w-full bg-[#C53678] hover:bg-white hover:border hover:border-[#C53678] hover:text-[#C53678] text-white rounded-xl"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm mt-4 text-[#25171A]">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="text-[#C53678] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
