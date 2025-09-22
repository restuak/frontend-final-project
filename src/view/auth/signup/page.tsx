"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Loader2,
  CheckCircle,
  User,
  Building2,
} from "lucide-react";
import axios from "axios";
import { BE_URL } from "@/configs/config";

export default function SignUpPageView() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"USER" | "TENANT" | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.includes("@")) {
      setError("Email tidak valid.");
      return;
    }

    if (!role) {
      setError("Pilih role terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BE_URL}/api/auth/register`, {
        email,
        role, 
      });

      setSuccess("Akun berhasil dibuat! Silakan cek email untuk verifikasi.");
      setEmail("");
      setRole(null);
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Signup gagal");
      } else if (err.request) {
        setError("Server tidak merespon. Cek koneksi atau backend aktif.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/api/auth/google";
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

        {success && (
          <div className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignUp}>
          {/* ROLE SELECTOR */}
          <div className="flex justify-between gap-3">
            <Button
              type="button"
              onClick={() => setRole("USER")}
              className={`flex-1 rounded-xl border ${
                role === "USER"
                  ? "bg-[#C53678] text-white"
                  : "bg-white text-[#C53678] border-[#C53678]"
              }`}
            >
              <User className="w-4 h-4 mr-2" /> User
            </Button>
            <Button
              type="button"
              onClick={() => setRole("TENANT")}
              className={`flex-1 rounded-xl border ${
                role === "TENANT"
                  ? "bg-[#C53678] text-white"
                  : "bg-white text-[#C53678] border-[#C53678]"
              }`}
            >
              <Building2 className="w-4 h-4 mr-2" /> Owner Property
            </Button>
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 border-[#C53678] focus:ring-[#C53678]"
              required
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

        {/* GARIS PEMBATAS */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* GOOGLE LOGIN */}
        <Button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 rounded-xl"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign Up with Google
        </Button>

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
