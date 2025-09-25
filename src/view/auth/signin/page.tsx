"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  User,
  Building2,
} from "lucide-react";
import useAuthStore from "@/store/authstore";
import { UserRole } from "@/interface/auth.types";

export default function SignInPageView() {
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, error, loading, token, user } = useAuthStore();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn({ role, email, password });
  };

  useEffect(() => {
    if (token && user) {
      if (user.role === UserRole.TENANT) router.push("/dashboard/properties");
      else router.push("/");
    }
  }, [token, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAFA] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-[#25171A] mb-6 text-center">
          SIGN IN
        </h1>

        {/* Switch role */}
        <div className="mb-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole(UserRole.USER)}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${
              role === UserRole.USER
                ? "bg-[#C53678] text-white border-[#C53678]"
                : "bg-white text-[#25171A] border-[#F2E3E7] hover:border-[#C53678]"
            }`}
          >
            <User className="h-4 w-4" />
            User
          </button>
          <button
            type="button"
            onClick={() => setRole(UserRole.TENANT)}
            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${
              role === UserRole.TENANT
                ? "bg-[#C53678] text-white border-[#C53678]"
                : "bg-white text-[#25171A] border-[#F2E3E7] hover:border-[#C53678]"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Tenant
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 text-sm p-2 rounded mb-4 border border-rose-100">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignIn}>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 h-11 rounded-xl border-[#F2E3E7] focus:border-[#C53678] focus:ring-[#C53678]/30"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10 h-11 rounded-xl border-[#F2E3E7] focus:border-[#C53678] focus:ring-[#C53678]/30"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3.5 text-gray-500"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#C53678] hover:bg-[#a72d65] text-white rounded-xl"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
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
