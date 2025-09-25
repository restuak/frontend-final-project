"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import axios, { AxiosError } from "axios";
import { BE_URL } from "@/configs/config";

export default function SignUpPageView() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !email.includes("@")) {
      setError("Email tidak valid.");
      return;
    }

    try {
      setLoading(true);

      // endpoint hanya kirim email 
      await axios.post(`${BE_URL}api/auth/register`, { email });

      setSuccess(
        "Berhasil! Silakan cek email untuk menyelesaikan pendaftaran."
      );
      setEmail("");
    } catch (err) {
      const e = err as AxiosError<any>;
      if (e.response) {
        setError(e.response.data?.message || "Signup gagal");
      } else if (e.request) {
        setError("Server tidak merespons. Pastikan backend aktif.");
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BE_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAFA] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-[#25171A] mb-6 text-center uppercase">
          Sign Up
        </h1>

        {error && (
          <div className="bg-rose-50 text-rose-700 text-sm p-2 rounded mb-4 border border-rose-100">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-700 text-sm p-2 rounded mb-4 border border-emerald-100 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignUp}>
          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 rounded-xl border-[#F2E3E7] focus:border-[#C53678] focus:ring-[#C53678]/30"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#C53678] hover:bg-[#a72d65] text-white rounded-xl"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign Up"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        {/* GOOGLE LOGIN */}
        <Button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 rounded-xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
