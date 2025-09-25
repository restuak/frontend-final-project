"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyParams } from "@/interface/property.types";
import { BE_URL } from "@/configs/config";

const TAKE = 50; 
const VISIBLE_COUNT = 10; 

export default function PropertiesShowcase() {
  const [properties, setProperties] = useState<PropertyParams[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>(["all"]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [city, setCity] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const fetchProperties = async (opts?: {
    city?: string;
    category?: string;
  }) => {
    setLoading(true);
    try {
      const params: any = { take: TAKE, sort: "rating_desc" };
      if (opts?.city) params.city = opts.city;
      if (opts?.category && opts.category !== "all")
        params.category = opts.category;

      const { data } = await axios.get(`${BE_URL}api/properties`, {
        params,
        headers: { "Cache-Control": "no-store" },
      });

      let results: PropertyParams[] = data?.items ?? data?.data ?? [];

      // filter properti yang punya gambar
      results = results.filter((p) => p.imageUrl && p.imageUrl.trim() !== "");

      setProperties(results);
      setPage(0);

      // ekstrak kategori unik dari properti
      const uniqueCats = Array.from(
        new Set(results.map((p: any) => p.category?.toLowerCase()))
      ).filter(Boolean);
      setAllCategories(["all", ...uniqueCats]);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setProperties([]);
      setAllCategories(["all"]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties({ category, city: city ?? undefined });

  }, [category, city]);

  // auto slide tiap 6 detik
  useEffect(() => {
    if (!properties.length) return;
    const interval = setInterval(() => {
      setPage((prev) =>
        (prev + 1) * VISIBLE_COUNT >= properties.length ? 0 : prev + 1
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [properties]);

  const handleEnableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async () => {
          const userCity = "Jakarta";
          setCity(userCity);
          fetchProperties({ city: userCity, category });
        },
        () => {
          fetchProperties({ category });
        }
      );
    } else {
      fetchProperties({ category });
    }
  };

  if (loading)
    return <p className="text-center my-10">Loading properties...</p>;
  if (!properties.length)
    return <p className="text-center my-10">No properties found.</p>;

  const start = page * VISIBLE_COUNT;
  const currentItems = properties.slice(start, start + VISIBLE_COUNT);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-bold text-center mb-6">
        Rekomendasi Untukmu
      </h2>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleEnableLocation}
          className="flex items-center gap-2 px-5 py-3 text-sm rounded-lg border hover:bg-gray-50 transition"
        >
          <MapPin className="w-4 h-4" />
          {city ? `Lokasi: ${city}` : "Gunakan Lokasi"}
        </button>
      </div>

      {/* Filter kategori dari hasil properties */}
      <div className="flex justify-center gap-3 mb-6 mt-6 flex-wrap">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              category === cat
                ? "bg-[#FF5841] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat === "all"
              ? "Semua"
              : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Carousel Grid */}
      <div className="relative">
        <button
          onClick={() =>
            setPage((prev) =>
              prev === 0
                ? Math.floor(properties.length / VISIBLE_COUNT)
                : prev - 1
            )
          }
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {currentItems.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              href={`/properties/${p.slug || p.id}`}
              className="rounded-2xl overflow-hidden shadow border hover:shadow-lg transition bg-white"
            >
              <div className="relative w-full h-40 sm:h-48 lg:h-56">
                <Image
                  src={p.imageUrl || "/img/default-property.jpg"}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 20vw"
                  priority={i < 2}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-base lg:text-lg line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-600">{p.city}</p>
                <p className="text-sm text-[#FF5841] font-semibold">
                  Rp {Number(p.price ?? 0).toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-yellow-500 mt-1">
                  ⭐ {Number(p.rating ?? 0).toFixed(1)} / 5
                </p>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={() =>
            setPage((prev) =>
              (prev + 1) * VISIBLE_COUNT >= properties.length ? 0 : prev + 1
            )
          }
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
