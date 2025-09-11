"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { passwordSchema, PasswordInput } from "@/lib/passvalidation";
import axios from "axios";

export default function VerifyEmailView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState<string | null>(null);

  const [form, setForm] = useState<PasswordInput>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PasswordInput, string>>
  >({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token tidak ditemukan.");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BE_URL}/api/auth/verify`,
          { params: { token } }
        );

        setEmail(res.data.user.email);
        setStatus("success");
        setMessage(res.data.message || "Email berhasil diverifikasi!");
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || err.message || "Terjadi kesalahan"
        );
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  const handleSetPassword = async () => {
    const parseResult = passwordSchema.safeParse(form);
    if (!parseResult.success) {
      const newErrors: Partial<Record<keyof PasswordInput, string>> = {};
      parseResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof PasswordInput;
        if (field) newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSaving(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/api/auth/setpassword`,
        { token, password: form.password }
      );

      if (!res.data.status && res.data.message) {
        throw new Error(res.data.message);
      }

      // sukses
      router.push("/auth/signin");
    } catch (err: any) {
      alert(
        err.response?.data?.message || err.message || "Gagal menyimpan password"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAFA]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl text-center">
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-[#C53678] w-8 h-8" />
            <p className="mt-4 text-[#25171A]">Sedang memverifikasi email...</p>
          </div>
        ) : status === "success" ? (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              Email Terverifikasi
            </h1>
            <p className="text-[#25171A] mb-6">{message}</p>

            {/* Form Set Password */}
            <div className="space-y-4 text-left">
              <div>
                <Input
                  type="password"
                  placeholder="Password baru"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Konfirmasi password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-500">
                Password minimal 6 karakter, mengandung huruf kecil, huruf
                besar, dan angka.
              </p>

              <Button
                className="w-full bg-[#C53678] text-white rounded-xl"
                onClick={handleSetPassword}
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Set Password & Lanjut Login"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Verifikasi Gagal
            </h1>
            <p className="text-[#25171A] mb-6">{message}</p>
            <Button
              className="w-full bg-gray-500 text-white rounded-xl"
              onClick={() => router.push("/auth/signup")}
            >
              Kembali ke Sign Up
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
