"use client";

import { useState } from "react";
import { BE_URL } from "@/configs/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuthStore from "@/store/authstore";

export default function PersonalForm({ profile, setProfile }: any) {
  const { token } = useAuthStore();
  const [firstName, setFirstName] = useState(profile.first_name);
  const [lastName, setLastName] = useState(profile.last_name);
  const [phone, setPhone] = useState(profile.phone_number || "");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setMsg("");
    setBusy(true);
    try {
      const body = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phone ? Number(phone) : null,
      };
      const res = await fetch(`${BE_URL}api/user/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal update");

      setProfile({
        ...profile,
        ...body,
        updated_at: new Date().toISOString(),
      });
      setMsg("Data personal berhasil diperbarui.");
    } catch (e: any) {
      setMsg(e?.message || "Gagal menyimpan data");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-3xl border border-[#F2E3E7] bg-white p-6 shadow-sm md:p-8">
      <form onSubmit={onSubmit} className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-[#25171A]">
              Nama Depan
            </label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-2 h-11 rounded-xl border-[#F2E3E7] bg-[#FFFAFA]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#25171A]">
              Nama Belakang
            </label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-2 h-11 rounded-xl border-[#F2E3E7] bg-[#FFFAFA]"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[#25171A]">
            Nomor Telepon
          </label>
          <Input
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="62xxxxxxxxxx"
            className="mt-2 h-11 rounded-xl border-[#F2E3E7] bg-[#FFFAFA]"
          />
        </div>

        <div className="flex justify-end">
          <Button
            disabled={busy}
            className="rounded-xl bg-[#C53678] px-6 text-white hover:bg-[#a72d65]"
          >
            {busy ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </section>
  );
}
