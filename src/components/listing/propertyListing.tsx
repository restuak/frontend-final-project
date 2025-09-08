
"use client";

import Image from "next/image";
import { properties, Property   } from "@/data/property";
interface PropertyListingProps {
  city: string;
  type: string;
}

export default function PropertyListing({ city, type }: PropertyListingProps) {
  const filtered: Property[] = properties.filter(
    (p) =>
      (city === "all" || p.city === city) && (type === "all" || p.type === type)
  );

  return (
    <div className="grid md:grid-cols-3 gap-6 mx-10 my-10 ">
      {filtered.map((p) => (
        <div
          key={p.id}
          className="rounded-2xl overflow-hidden shadow-lg border border-white/20 transition hover:brightness-105"
        >
          <Image
            src={p.image || "/img/default-property.jpg"}
            alt={p.name}
            width={400}
            height={300}
            className="object-cover w-full h-64"
          />
          <div className="p-4 bg-white/10">
            <h2 className="font-bold text-[${COLORS.mainText}] text-lg">
              {p.name}
            </h2>
            <p className="text-sm text-white/80">
              {p.city} | {p.type}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
