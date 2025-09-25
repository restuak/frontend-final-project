"use client";

import { useState } from "react";
import { BE_URL } from "@/configs/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Loader2, Lock } from "lucide-react";
import useAuthStore from "@/store/authstore";

export default function SecuritySection({ profile }: any) {
  const { token } = useAuthStore();

  // Forgot Password
  const [busyForgot, setBusyForgot] = useState(false);
  const [msgForgot, setMsgForgot] = useState("");

  // Change Password
  const [busyChange, setBusyChange] = useState(false);
  const [msgChange, setMsgChange] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  /* ============= Handlers ============= */

  // Forgot Password (kirim link ke email)
  const sendResetLink = async () => {
    if (!profile?.email) return;
    setBusyForgot(true);
    setMsgForgot("");
    try {
      const res = await fetch(`${BE_URL}api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal kirim link reset");
      setMsgForgot("Tautan reset password sudah dikirim ke email.");
    } catch (err: any) {
      setMsgForgot(err.message || "Gagal mengirim tautan reset");
    } finally {
      setBusyForgot(false);
    }
  };

  // Change Password (pakai oldPassword)
  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPass) {
      setMsgChange("Konfirmasi password tidak cocok.");
      return;
    }
    setBusyChange(true);
    setMsgChange("");
    try {
      const res = await fetch(`${BE_URL}api/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal ubah password");
      setMsgChange("Password berhasil diubah.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPass("");
    } catch (err: any) {
      setMsgChange(err.message || "Error ubah password");
    } finally {
      setBusyChange(false);
    }
  };

  /* ============= UI ============= */
  return (
    <section className="rounded-3xl border border-[#F2E3E7] bg-white p-6 shadow-sm md:p-8 space-y-8">
      {/* Forgot Password */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-[#FCE9F2] p-3 text-[#C53678]">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#25171A]">
              Forgot Password
            </h2>
            <p className="text-sm text-[#4A3B3F]">
              Kami akan mengirim tautan reset password ke email Anda.
            </p>
          </div>
        </div>
        <Button
          onClick={sendResetLink}
          disabled={busyForgot}
          className="w-fit rounded-xl bg-[#C53678] px-6 text-white hover:bg-[#a72d65]"
        >
          {busyForgot ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Kirim Tautan Reset"
          )}
        </Button>
        {msgForgot && <p className="text-sm mt-2">{msgForgot}</p>}
      </div>

      {/* Change Password */}
      <form onSubmit={changePassword} className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-[#FCE9F2] p-3 text-[#C53678]">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#25171A]">
              Change Password
            </h2>
            <p className="text-sm text-[#4A3B3F]">
              Masukkan password lama untuk mengubah ke password baru.
            </p>
          </div>
        </div>

        <Input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Password lama"
          className="h-11 rounded-xl border-[#F2E3E7] bg-[#FFFAFA]"
        />
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Password baru"
          className="h-11 rounded-xl border-[#F2E3E7] bg-[#FFFAFA]"
        />
        <Input
          type="password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          placeholder="Konfirmasi password baru"
          className="h-11 rounded-xl border-[#F2E3E7] bg-[#FFFAFA]"
        />

        <div className="flex justify-end">
          <Button
            disabled={busyChange}
            className="rounded-xl bg-[#C53678] px-6 text-white hover:bg-[#a72d65]"
          >
            {busyChange ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Ubah Password"
            )}
          </Button>
        </div>
        {msgChange && <p className="text-sm mt-2">{msgChange}</p>}
      </form>
    </section>
  );
}
