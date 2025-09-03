"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

export default function SignInPageView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleSignIn = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");

  //   if (!email.includes("@")) {
  //     setError("Email tidak valid.");
  //     return;
  //   }
  //   if (password.length < 6) {
  //     setError("Password minimal 6 karakter.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const res = await fetch("/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message || "Login gagal");

  //     console.log("Login sukses", data);
 
  //   } catch (err: any) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleGoogleSignIn = async () => {
  //   try {
  //     window.location.href = "/api/auth/google"; 
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAFA]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-[#25171A] mb-6 text-center">
          Sign In to Restify
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4" > #onSubmit={/*handleSignIn*/}
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

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 border-[#C53678] focus:ring-[#C53678]"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C53678] hover:bg-white hover:border hover:border-[#C53678] hover:text-[#C53678] text-white rounded-xl"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <Button
          // onClick={handleGoogleSignIn}
          className="mt-4 w-full border border-gray-300 bg-white text-[#25171A] hover:bg-gray-100 flex items-center gap-2 rounded-xl"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          Sign in with Google
        </Button>

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
