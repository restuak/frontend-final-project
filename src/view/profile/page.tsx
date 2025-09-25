"use client";

import { useState, useEffect } from "react";
import useAuthStore from "@/store/authstore";
import { BE_URL } from "@/configs/config";
import { Loader2 } from "lucide-react";

import ProfileSummary from "./components/profileSummary";
import ProfileTabs from "./components/profileTabs";
import PersonalForm from "./components/personalForm";
import SecuritySection from "./components/securitySection";
import EmailSection from "./components/emailSection";

export default function ProfilePage() {
  const { token } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"personal" | "security" | "email">("personal");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${BE_URL}api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#C53678]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className=" min-h-[100vh] flex items-center justify-center text-sm text-gray-600">
        Gagal memuat profil.
      </div>
    );
  }

  return (
    <div className="bg-[#FFFAFA] pb-16 pt-24">
      <div className="mx-auto w-full max-w-6xl px-4 space-y-8">
        <ProfileSummary profile={profile} setProfile={setProfile} />

        <ProfileTabs tab={tab} setTab={setTab} />

        {tab === "personal" && (
          <PersonalForm profile={profile} setProfile={setProfile} />
        )}
        {tab === "security" && <SecuritySection profile={profile} />}
        {tab === "email" && (
          <EmailSection profile={profile} setProfile={setProfile} />
        )}
      </div>
    </div>
  );
}
