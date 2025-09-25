"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { BE_URL } from "@/configs/config";
import {
  Camera,
  CheckCircle2,
  Mail,
  CalendarDays,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import {
  fmtDate,
  toPhoneString,
  allowedImageExtensions,
  MAX_IMAGE_SIZE,
} from "./helpers";
import useAuthStore from "@/store/authstore";

export default function ProfileSummary({ profile, setProfile }: any) {
  const { token } = useAuthStore();
  const [photoPreview, setPhotoPreview] = useState(
    profile.avatar || "/img/profile-placeholder.svg"
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoMsg, setPhotoMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoMsg("");
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !allowedImageExtensions.includes(ext)) {
      setPhotoMsg("Format tidak didukung (JPG, JPEG, PNG, GIF).");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setPhotoMsg("Maksimum ukuran file 1MB.");
      return;
    }

    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const onPhotoSubmit = async () => {
    if (!photoFile || !token) return;
    setPhotoBusy(true);
    setPhotoMsg("");
    try {
      const fd = new FormData();
      fd.append("avatar", photoFile);

      const res = await fetch(`${BE_URL}api/user/profile`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal update foto");

      setProfile({
        ...profile,
        avatar: photoPreview,
        updated_at: new Date().toISOString(),
      });
      setPhotoMsg("Foto berhasil diperbarui.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPhotoFile(null);
    } catch (e: any) {
      setPhotoMsg(e?.message || "Gagal update foto");
    } finally {
      setPhotoBusy(false);
    }
  };

  const summary = [
    {
      label: "Member Sejak",
      value: fmtDate(profile?.created_at),
      icon: CalendarDays,
    },
  ];

  return (
    <section className="rounded-3xl border border-[#F2E3E7] bg-white p-6 shadow-sm md:p-8">
      {/* AVATAR & INFO */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="relative">
            <div className="h-28 w-28 overflow-hidden rounded-3xl border border-[#F2E3E7] bg-[#FCE9F2] shadow-inner">
              <img
                src={photoPreview}
                alt="Foto profil"
                className="h-full w-full object-cover"
              />
            </div>
            <label
              htmlFor="profilePhoto"
              className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#C53678] text-white shadow-lg transition hover:bg-[#a72d65]"
            >
              <Camera className="h-4 w-4" />
            </label>
            <input
              ref={fileInputRef}
              id="profilePhoto"
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              className="hidden"
              onChange={onPhotoChange}
            />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-[#25171A]">
              {profile.first_name} {profile.last_name}
            </h1>
            <span className="rounded-full bg-[#FCE9F2] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#C53678]">
              {profile.role}
            </span>

            <p className="flex items-center gap-2 text-sm text-[#4A3B3F]">
              <Mail className="h-4 w-4 text-[#C53678]" /> {profile.email}
            </p>
            <p className="text-sm text-[#4A3B3F]">ID Pengguna: {profile.id}</p>

            {profile.isVerified ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> Email terverifikasi
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                <ShieldAlert className="h-4 w-4" /> Email belum terverifikasi
              </span>
            )}
          </div>
        </div>

        {/* PHOTO UPLOAD ACTION */}
        <div className="w-full max-w-xs space-y-2">
          {photoFile ? (
            <Button
              onClick={onPhotoSubmit}
              disabled={photoBusy}
              className="w-full rounded-xl bg-[#C53678] text-white hover:bg-[#a72d65]"
            >
              {photoBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Simpan Foto"
              )}
            </Button>
          ) : (
            <p className="text-sm text-[#4A3B3F]">
              Unggah foto baru untuk memperbarui avatar Anda.
            </p>
          )}
          {photoMsg && <p className="text-xs text-[#C53678]">{photoMsg}</p>}
        </div>
      </div>

      {/* SUMMARY INFO */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {summary.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[#F2E3E7] bg-[#FFFAFA] p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <s.icon className="h-5 w-5 text-[#C53678]" />
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {s.label}
                </p>
                <p className="text-sm font-semibold text-[#25171A]">
                  {s.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
