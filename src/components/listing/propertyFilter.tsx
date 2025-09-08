// components/PropertyFilter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PropertyFilterProps {
  types: string[];
}

export default function PropertyFilter({ types }: PropertyFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || "all";
  const type = searchParams.get("type") || "all";

  return (
    <div className="flex gap-3 justify-center mb-6 flex-wrap">
      {types.map((t) => (
        <button
          key={t}
          onClick={() =>
            router.push(`/properties/search?city=${city}&type=${t}`)
          }
          className={`px-4 py-2 rounded-lg font-semibold shadow-lg transition ${
            type === t
              ? "bg-[#FF5841] text-white"
              : "bg-[#FFFAFA] text-[#25171A] hover:bg-[#C53678] hover:text-white"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
