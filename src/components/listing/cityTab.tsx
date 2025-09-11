// components/CityTabs.tsx
"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

interface CityTabsProps {
  cities: {
    name: string;
    image: string; 
  }[];
}

export default function CityTabs({ cities }: CityTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "all";
  const city = searchParams.get("city") || "all";

  return (
    <div className=" grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 mx-5 md:mx-60 md:mt-10">
      {cities.map((c) => (
        <div
          key={c.name}
          onClick={() =>
            router.push(`/properties/search?city=${c.name}&type=${type}`)
          }
          className={`relative group cursor-pointer rounded-xl overflow-hidden shadow-lg border transition transform hover:scale-105 ${
            city === c.name ? "ring-4 ring-[#C53678]" : ""
          }`}
        >
          {/* Gambar kota */}
          <Image
            src={c.image}
            alt={c.name}
            width={400}
            height={250}
            className="object-cover w-full h-40 md:h-48"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 flex items-center justify-center">
            <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-lg">
              {c.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
