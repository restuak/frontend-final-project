"use client";

import { useState } from "react";
import { BE_URL } from "@/configs/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import useAuthStore from "@/store/authstore";

export default function EmailSection({ profile, setProfile }: any) {
  const { token } = useAuthStore();
  const [email, setEmail] = useState(profile.email);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");

  const updateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(`${BE_URL}api/user/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal update email");

      setProfile({
        ...profile,
        email,
        isVerified: false,
        updated_at: new Date().toISOString(),
      });
      setMsg("Email berhasil diperbarui. Silakan verifikasi.");
    } catch (e: any) {
      setMsg(e?.message || "Error update email");
    } finally {
      setBusy(false);
    }
  };

  const resendVerification = async () => {
    if (!token) return;
    setVerifyBusy(true);
    setVerifyMsg("");
    try {
      const res = await fetch(`${BE_URL}api/user/verify-email`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal kirim verifikasi");
      setVerifyMsg("Tautan verifikasi telah dikirim ulang.");
    } catch (e: any) {
      setVerifyMsg(e?.message || "Error verifikasi ulang");
    } finally {
      setVerifyBusy(false);
    }
  };

  return (
    <section className="rounded-3xl border border-[#F2E3E7] bg-white p-6 shadow-sm md:p-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={updateEmail} className="space-y-4">
          <h2 className="text-lg font-semibold text-[#25171A]">Ubah Email</h2>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email baru"
            className="h-11 rounded-xl border-[#F2E3E7] bg-[#FFFAFA]"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-[#C53678] px-6 text-white hover:bg-[#a72d65]"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Simpan Email"
              )}
            </Button>
          </div>
          {msg && <p className="text-sm">{msg}</p>}
        </form>

        <div>
          <h2 className="text-lg font-semibold text-[#25171A] mb-3">
            Status Verifikasi
          </h2>
          <div className="rounded-2xl border border-dashed border-[#F2E3E7] bg-[#FFFAFA] p-4">
            <div className="flex items-center gap-2 text-sm text-[#4A3B3F] mb-3">
              {profile.isVerified ? (
                <>
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Email
                  terverifikasi
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4 text-amber-600" /> Email belum
                  terverifikasi
                </>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={resendVerification}
              disabled={verifyBusy || profile.isVerified}
              className="rounded-xl border-[#C53678] text-[#C53678] hover:bg-[#FCE9F2]"
            >
              {verifyBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Kirim ulang verifikasi"
              )}
            </Button>
            {verifyMsg && <p className="text-sm mt-3">{verifyMsg}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
