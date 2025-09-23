"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, UserRound } from "lucide-react";
import { BE_URL } from "@/configs/config";
import { passwordSchema, type PasswordInput } from "@/lib/passvalidation";

type FormState = {
  first_name: string;
  last_name: string;
} & PasswordInput;

export default function CompleteRegistrationView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [form, setForm] = useState<FormState>({
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setBootError(
        "Token tidak ditemukan. Silakan buka tautan dari email Anda."
      );
    }
  }, [token]);

  const validate = (): boolean => {
    const fieldErrs: Partial<Record<keyof FormState, string>> = {};
    if (!form.first_name.trim())
      fieldErrs.first_name = "Nama depan wajib diisi.";
    if (!form.last_name.trim())
      fieldErrs.last_name = "Nama belakang wajib diisi.";

    const pass = passwordSchema.safeParse({
      password: form.password,
      confirmPassword: form.confirmPassword,
    });
    if (!pass.success) {
      pass.error.issues.forEach((iss) => {
        const key = iss.path[0] as "password" | "confirmPassword";
        fieldErrs[key] = iss.message;
      });
    }

    setErrors(fieldErrs);
    return Object.keys(fieldErrs).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(null);

    if (!validate()) return;
    if (!token) {
      setBootError("Token tidak ditemukan.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        token,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        password: form.password,
      };

      // ⬅️ sesuai permintaan: endpoint baru
      await axios.post(`${BE_URL}api/auth/complete`, payload);

      setApiSuccess("regis succes");
      setTimeout(() => router.push("/auth/signin"), 900);
    } catch (err) {
      const e = err as AxiosError<any>;
      setApiError(
        e.response?.data?.message ||
          e.message ||
          "Gagal menyelesaikan registrasi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAFA] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-[#25171A] mb-2 text-center">
          Complete Registration
        </h1>
        <p className="text-sm text-[#4A3B3F] text-center mb-6">
          Lengkapi data di bawah untuk mengaktifkan akun Anda.
        </p>

        {bootError && (
          <div className="mb-4 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {bootError}
          </div>
        )}
        {apiError && (
          <div className="mb-4 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {apiError}
          </div>
        )}
        {apiSuccess && (
          <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {apiSuccess}
          </div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
          {/* FIRST NAME */}
          <div className="relative">
            <UserRound className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="First name"
              value={form.first_name}
              onChange={(e) =>
                setForm((p) => ({ ...p, first_name: e.target.value }))
              }
              className="pl-10 h-11 rounded-xl border-[#F2E3E7] focus:border-[#C53678] focus:ring-[#C53678]/30"
            />
            {errors.first_name && (
              <p className="text-xs text-rose-600 mt-1">{errors.first_name}</p>
            )}
          </div>

          {/* LAST NAME */}
          <div className="relative">
            <UserRound className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Last name"
              value={form.last_name}
              onChange={(e) =>
                setForm((p) => ({ ...p, last_name: e.target.value }))
              }
              className="pl-10 h-11 rounded-xl border-[#F2E3E7] focus:border-[#C53678] focus:ring-[#C53678]/30"
            />
            {errors.last_name && (
              <p className="text-xs text-rose-600 mt-1">{errors.last_name}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              autoComplete="new-password"
              className="pl-10 h-11 rounded-xl border-[#F2E3E7] focus:border-[#C53678] focus:ring-[#C53678]/30"
            />
            {errors.password && (
              <p className="text-xs text-rose-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((p) => ({ ...p, confirmPassword: e.target.value }))
              }
              autoComplete="new-password"
              className="pl-10 h-11 rounded-xl border-[#F2E3E7] focus:border-[#C53678] focus:ring-[#C53678]/30"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-rose-600 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <p className="text-xs text-gray-500 -mt-2">
            Password 6–12 karakter, tanpa spasi, wajib ada huruf besar, kecil,
            angka, dan simbol.
          </p>

          <Button
            type="submit"
            disabled={loading || !!bootError}
            className="w-full h-11 rounded-xl bg-[#C53678] text-white hover:bg-[#a72d65]"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Complete Registration"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
