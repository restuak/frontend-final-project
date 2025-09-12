"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ProfilePageProps {
  role: "user" | "owner";
  isVerified: boolean;
  name: string;
  email: string;
  phone?: string;
}

export default function ProfilePage({
  role,
  isVerified,
  name,
  email,
  phone,
}: ProfilePageProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-[#C53678] mb-6">Profile</h1>

      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-6 grid md:grid-cols-2 gap-8">
          {/* Info kiri */}
          <div>
            <div className="w-24 h-24 rounded-full bg-rose-200 flex items-center justify-center text-3xl font-bold text-[#C53678]">
              {name.charAt(0).toUpperCase()}
            </div>
            <p className="mt-3 text-lg font-semibold text-[#25171a]">{name}</p>
            <p className="text-sm text-gray-600">
              {role === "owner" ? "Tenant Owner" : "User"}
            </p>
            <p
              className={`mt-2 inline-block px-3 py-1 rounded-full text-sm ${
                isVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isVerified ? "Verified Account" : "Not Verified"}
            </p>
          </div>

          {/* Info kanan */}
          <div>
            <h2 className="text-xl font-semibold text-[#C53678] mb-4">
              Personal Info
            </h2>
            <p className="text-sm text-gray-600">Email: {email}</p>
            {phone && <p className="text-sm text-gray-600">Phone: {phone}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
