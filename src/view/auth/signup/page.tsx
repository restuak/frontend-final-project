"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2 } from "lucide-react";

export default function SignUpPageView() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Email tidak valid.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup gagal");

      console.log("Signup sukses", data);
 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAFA]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-[#25171A] mb-6 text-center uppercase">
          Sign Up 
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 border-[#C53678] focus:ring-[#C53678]"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C53678] hover:bg-white hover:border hover:border-[#C53678] hover:text-[#C53678] text-white rounded-xl"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm mt-4 text-[#25171A]">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-[#C53678] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
