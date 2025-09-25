"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { BE_URL } from "@/configs/config";

interface Property {
  id: string;
  name: string;
  city: string;
  imageUrl: string | null;
}

interface City {
  name: string;
  imageUrl: string;
  count: number;
}

export default function PopularCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await axios.get(`${BE_URL}api/properties`, {
          params: { take: 500 },
          headers: { "Cache-Control": "no-store" },
        });

      
        const props: Property[] = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.items)
          ? data.items
          : [];

        if (props.length) {
          const cityMap: Record<string, City> = {};

          for (const p of props) {
            if (!p.city) continue;
            if (!cityMap[p.city]) {
              cityMap[p.city] = {
                name: p.city,
                imageUrl: p.imageUrl || "/img/city/default.jpg",
                count: 1,
              };
            } else {
              cityMap[p.city].count += 1;
            }
          }

          const sorted = Object.values(cityMap).sort(
            (a, b) => b.count - a.count
          );
          setCities(sorted.slice(0, 4));
        } else {
          setCities([]);
        }
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (loading) return <p className="text-center my-10">Loading cities...</p>;
  if (!cities.length)
    return <p className="text-center my-10">No cities found</p>;

  return (
    <section className="max-w-6xl mx-auto my-12 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        Destinasi Populer
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cities.map((city) => (
          <Link
            key={city.name}
            href={`/properties?city=${encodeURIComponent(city.name)}`}
            className="cursor-pointer rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white group"
          >
            <div className="relative w-full h-40 md:h-60 lg:h-72">
              <Image
                src={city.imageUrl}
                alt={city.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="font-semibold text-lg md:text-xl">{city.name}</h3>
              <p className="text-sm text-gray-500">{city.count} properti</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
