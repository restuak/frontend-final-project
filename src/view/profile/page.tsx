"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { BE_URL } from "@/configs/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  RefreshCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Camera,
  Loader2,
} from "lucide-react";

/* ===================== Types that match your Prisma schema ===================== */
type Role = "USER" | "TENANT" | "ADMIN";

type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  isVerified: boolean;
  phone_number?: number | null;
  created_at: string; // ISO string from DB
  updated_at: string; // ISO string from DB
  login_time_out?: string | null; // optional
  // ONLY use fields that exist in your Prisma schema
};

/* ===================== Helpers ===================== */
const allowedImageExtensions = ["jpg", "jpeg", "png", "gif"];
const MAX_IMAGE_SIZE = 1024 * 1024;

const fmtDate = (iso?: string | null, opts?: Intl.DateTimeFormatOptions) => {
  if (!iso) return "-";
  try {
    return new Intl.DateTimeFormat(
      "id-ID",
      opts ?? { dateStyle: "long" }
    ).format(new Date(iso));
  } catch {
    return "-";
  }
};

const toPhoneString = (v?: number | null) => (v == null ? "" : String(v));

/* ===================== Page ===================== */
export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"personal" | "security" | "email">("personal");

  // avatar local state
  const [photoPreview, setPhotoPreview] = useState<string>(
    "/img/profile-placeholder.svg"
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoMsg, setPhotoMsg] = useState<string>("");

  // forms
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [emailForm, setEmailForm] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailMsg, setEmailMsg] = useState<string>("");

  const [secBusy, setSecBusy] = useState(false);
  const [secMsg, setSecMsg] = useState<string>("");
  const [resetToken, setResetToken] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // fetch profile
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        const p: UserProfile = data.data;

        setProfile(p);
        setFirstName(p.first_name);
        setLastName(p.last_name);
        setPhone(toPhoneString(p.phone_number));
        setEmailForm(p.email);
        setPhotoPreview(p.avatar || "/img/profile-placeholder.svg");
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // summary chips
  const summary = useMemo(
    () => [
      {
        label: "Member Sejak",
        value: fmtDate(profile?.created_at),
        icon: CalendarDays,
      },
      {
        label: "Terakhir Diperbarui",
        value: fmtDate(profile?.updated_at, {
          dateStyle: "long",
          timeStyle: "short",
        }),
        icon: RefreshCcw,
      },
      {
        label: "Login Terakhir",
        value: profile?.login_time_out
          ? fmtDate(profile?.login_time_out, {
              dateStyle: "long",
              timeStyle: "short",
            })
          : "-",
        icon: Clock3,
      },
    ],
    [profile]
  );

  /* ===================== Handlers ===================== */

  // avatar change
  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoMsg("");
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !allowedImageExtensions.includes(ext)) {
      setPhotoMsg(
        "Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau GIF."
      );
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setPhotoMsg("Ukuran file maksimal 1MB.");
      return;
    }

    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });
  };

  // avatar submit (PATCH /user/profile multipart)
  const onPhotoSubmit = async () => {
    if (!photoFile || !profile) return;
    setPhotoBusy(true);
    setPhotoMsg("");
    try {
      const fd = new FormData();
      fd.append("avatar", photoFile);
      // still allow name to pass through untouched
      fd.append("first_name", firstName);
      fd.append("last_name", lastName);
      if (phone) fd.append("phone_number", phone);

      const res = await fetch(`${BE_URL}api/user/profile`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal memperbarui foto");

      setProfile({
        ...profile,
        avatar: photoPreview,
        updated_at: new Date().toISOString(),
      });
      setPhotoMsg("Foto profil berhasil diperbarui.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPhotoFile(null);
    } catch (e: any) {
      setPhotoMsg(e?.message || "Gagal memperbarui foto");
    } finally {
      setPhotoBusy(false);
    }
  };

  // personal info submit (PATCH /user/profile)
  const onPersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSecMsg("");
    try {
      const body = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phone ? Number(phone) : null,
      };
      const res = await fetch(`${BE_URL}api/user/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal menyimpan data");

      setProfile({
        ...profile,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone ? Number(phone) : null,
        updated_at: new Date().toISOString(),
      });
      setSecMsg("Data personal berhasil diperbarui.");
    } catch (e: any) {
      setSecMsg(e?.message || "Gagal memperbarui data");
    }
  };

  // SECURITY: send reset link (POST /auth/reset-password)
  const sendResetLink = async () => {
    if (!profile) return;
    setSecBusy(true);
    setSecMsg("");
    try {
      const res = await fetch(`${BE_URL}api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal mengirim tautan");
      setSecMsg("Tautan reset password telah dikirim ke email Anda.");
    } catch (e: any) {
      setSecMsg(e?.message || "Gagal mengirim tautan reset");
    } finally {
      setSecBusy(false);
    }
  };

  // SECURITY: confirm reset (POST /auth/confirm-reset)
  const onConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setSecMsg("Konfirmasi password tidak cocok.");
      return;
    }
    setSecBusy(true);
    setSecMsg("");
    try {
      const res = await fetch(`${BE_URL}api/auth/confirm-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, new_password: newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal mereset password");
      setResetToken("");
      setNewPass("");
      setConfirmPass("");
      setSecMsg("Password berhasil diubah.");
    } catch (e: any) {
      setSecMsg(e?.message || "Gagal mereset password");
    } finally {
      setSecBusy(false);
    }
  };

  // EMAIL: update email (PATCH /user/profile)
  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setEmailBusy(true);
    setEmailMsg("");
    try {
      const res = await fetch(`${BE_URL}api/user/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal menyimpan email");

      setProfile({
        ...profile,
        email: emailForm,
        isVerified: false,
        updated_at: new Date().toISOString(),
      });
      setEmailMsg("Email diperbarui. Silakan verifikasi email baru Anda.");
    } catch (e: any) {
      setEmailMsg(e?.message || "Gagal memperbarui email");
    } finally {
      setEmailBusy(false);
    }
  };

  // EMAIL: resend verification (POST /user/verify-email)
  const resendVerification = async () => {
    setVerifyBusy(true);
    setVerifyMsg("");
    try {
      const res = await fetch(`${BE_URL}api/user/verify-email`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Gagal mengirim verifikasi");
      setVerifyMsg("Tautan verifikasi telah dikirim ulang.");
    } catch (e: any) {
      setVerifyMsg(e?.message || "Gagal mengirim ulang verifikasi");
    } finally {
      setVerifyBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#C53678]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-600">
        Gagal memuat profil.
      </div>
    );
  }

  return (
    <div className="bg-[#FFFAFA] pb-16 pt-8">
      <div className="mx-auto w-full max-w-6xl px-4 space-y-8">
        {/* =================== SUMMARY (always visible) =================== */}
        <section className="rounded-3xl border border-[#F2E3E7] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row">
              {/* Avatar */}
              <div className="relative">
                <div className="h-28 w-28 overflow-hidden rounded-3xl border border-[#F2E3E7] bg-[#FCE9F2] shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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

              {/* Basic info */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold text-[#25171A]">
                    {profile.first_name} {profile.last_name}
                  </h1>
                  <span className="rounded-full bg-[#FCE9F2] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#C53678]">
                    {profile.role}
                  </span>
                </div>

                <div className="flex flex-col gap-2 text-sm text-[#4A3B3F]">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#C53678]" />
                    {profile.email}
                  </p>
                  <p className="flex items-center gap-2">
                    ID Pengguna: {profile.id}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {profile.isVerified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Email terverifikasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                      <ShieldAlert className="h-4 w-4" />
                      Email belum terverifikasi
                    </span>
                  )}
                </div>

                {/* Role-based quick link */}
                {profile.role === "USER" && (
                  <a
                    href="/transactions"
                    className="inline-block text-[#C53678] text-sm font-medium hover:underline"
                  >
                    Lihat Riwayat Transaksi
                  </a>
                )}
                {profile.role === "TENANT" && (
                  <a
                    href="/dashboard/properties"
                    className="inline-block text-[#C53678] text-sm font-medium hover:underline"
                  >
                    My Properties (Dashboard)
                  </a>
                )}
              </div>
            </div>

            {/* Save photo */}
            <div className="w-full max-w-xs space-y-2">
              {photoFile ? (
                <Button
                  type="button"
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
              <p className="text-xs text-gray-500">
                Format: JPG, JPEG, PNG, GIF. Maksimum 1MB.
              </p>
              {photoMsg && <p className="text-xs">{photoMsg}</p>}
            </div>
          </div>

          {/* quick stats */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {summary.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-[#F2E3E7] bg-[#FFFAFA] p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white p-2 text-[#C53678]">
                    <s.icon className="h-5 w-5" />
                  </div>
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

          {/* quick info (phone only, because schema doesn't have DOB/gender/address) */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-dashed border-[#F2E3E7] bg-[#FFFAFA] p-4 md:col-span-1">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Nomor telepon
              </p>
              <p className="mt-1 text-sm font-semibold text-[#25171A]">
                {toPhoneString(profile.phone_number) || "-"}
              </p>
            </div>
          </div>
        </section>

        {/* =================== Tabs =================== */}
        <div className="flex bg-white rounded-2xl shadow overflow-x-auto">
          {[
            { key: "personal", label: "Informasi Personal" },
            { key: "security", label: "Keamanan Akun" },
            { key: "email", label: "Email & Verifikasi" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`flex-1 px-4 py-3 text-sm md:text-base font-medium whitespace-nowrap transition-colors ${
                tab === t.key
                  ? "text-[#C53678] border-b-2 border-[#C53678] bg-[#FFFAFA]"
                  : "text-gray-600 hover:text-[#C53678]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* =================== Tab Content =================== */}
        <section className="rounded-3xl border border-[#F2E3E7] bg-white p-6 shadow-sm md:p-8">
          {/* PERSONAL */}
          {tab === "personal" && (
            <form onSubmit={onPersonalSubmit} className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-[#25171A]">
                    Nama depan
                  </label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-2 h-11 rounded-xl border-[#F2E3E7] bg-[#FFFAFA] text-sm focus:border-[#C53678] focus:ring-[#C53678]/40"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#25171A]">
                    Nama belakang
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-2 h-11 rounded-xl border-[#F2E3E7] bg-[#FFFAFA] text-sm focus:border-[#C53678] focus:ring-[#C53678]/40"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-[#25171A]">
                    Nomor telepon
                  </label>
                  <Input
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="62xxxxxxxxxx"
                    className="mt-2 h-11 rounded-xl border-[#F2E3E7] bg-[#FFFAFA] text-sm focus:border-[#C53678] focus:ring-[#C53678]/40"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="rounded-xl bg-[#C53678] px-6 text-white hover:bg-[#a72d65]">
                  Simpan Perubahan
                </Button>
              </div>
              {secMsg && <p className="text-sm">{secMsg}</p>}
            </form>
          )}

          {/* SECURITY (reset flow sesuai endpoint yang sudah ada) */}
          {tab === "security" && (
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Kirim link reset */}
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="rounded-2xl bg-[#FCE9F2] p-3 text-[#C53678]">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#25171A]">
                      Kirim Tautan Reset
                    </h2>
                    <p className="text-sm text-[#4A3B3F]">
                      Kami akan mengirim tautan reset password ke email Anda.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={sendResetLink}
                  disabled={secBusy}
                  className="rounded-xl bg-[#C53678] px-6 text-white hover:bg-[#a72d65]"
                >
                  {secBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Kirim Tautan Reset"
                  )}
                </Button>
              </div>

              {/* Konfirmasi reset */}
              <form onSubmit={onConfirmReset} className="space-y-4">
                <h2 className="text-lg font-semibold text-[#25171A]">
                  Konfirmasi Reset Password
                </h2>
                <div>
                  <label className="text-sm font-medium text-[#25171A]">
                    Token
                  </label>
                  <Input
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="Tempel token dari email"
                    className="mt-2 h-11 rounded-xl border-[#F2E3E7] bg-[#FFFAFA] text-sm focus:border-[#C53678] focus:ring-[#C53678]/40"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#25171A]">
                    Password baru
                  </label>
                  <Input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="mt-2 h-11 rounded-xl border-[#F2E3E7] bg-[#FFFAFA] text-sm focus:border-[#C53678] focus:ring-[#C53678]/40"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#25171A]">
                    Konfirmasi password baru
                  </label>
                  <Input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="mt-2 h-11 rounded-xl border-[#F2E3E7] bg-[#FFFAFA] text-sm focus:border-[#C53678] focus:ring-[#C53678]/40"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    disabled={secBusy}
                    className="rounded-xl bg-[#C53678] px-6 text-white hover:bg-[#a72d65]"
                  >
                    {secBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Ubah Password"
                    )}
                  </Button>
                </div>
                {secMsg && <p className="text-sm">{secMsg}</p>}
              </form>
            </div>
          )}

          {/* EMAIL & VERIFIKASI */}
          {tab === "email" && (
            <div className="grid gap-8 lg:grid-cols-2">
              <form onSubmit={onEmailSubmit} className="space-y-4">
                <h2 className="text-lg font-semibold text-[#25171A]">
                  Ubah Email
                </h2>
                <div>
                  <label className="text-sm font-medium text-[#25171A]">
                    Email utama
                  </label>
                  <Input
                    type="email"
                    value={emailForm}
                    onChange={(e) => setEmailForm(e.target.value)}
                    placeholder="Masukkan email aktif"
                    className="mt-2 h-11 rounded-xl border-[#F2E3E7] bg-[#FFFAFA] text-sm focus:border-[#C53678] focus:ring-[#C53678]/40"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Mengubah email akan mengatur ulang status verifikasi.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={emailBusy}
                    className="rounded-xl bg-[#C53678] px-6 text-white hover:bg-[#a72d65]"
                  >
                    {emailBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Simpan Email"
                    )}
                  </Button>
                </div>
                {emailMsg && <p className="text-sm">{emailMsg}</p>}
              </form>

              <div>
                <h2 className="text-lg font-semibold text-[#25171A] mb-3">
                  Status Verifikasi
                </h2>
                <div className="rounded-2xl border border-dashed border-[#F2E3E7] bg-[#FFFAFA] p-4">
                  <div className="flex items-center gap-2 text-sm text-[#4A3B3F] mb-3">
                    {profile.isVerified ? (
                      <>
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Email Anda sudah terverifikasi.
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="h-4 w-4 text-amber-600" />
                        Email Anda belum terverifikasi. Kirim ulang tautan
                        verifikasi.
                      </>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resendVerification}
                    disabled={verifyBusy || profile.isVerified}
                    className="rounded-xl border-[#C53678] text-[#C53678] hover:bg-[#FCE9F2] hover:text-[#C53678]"
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
          )}
        </section>
      </div>
    </div>
  );
}
