"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/properties/components/searchBar";

export default function Hero() {
  const router = useRouter();

  const images = [
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600&h=900&fit=crop",
    "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=1600&h=900&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=900&fit=crop",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative w-full">
      {/* DESKTOP VIEW */}
      <div className="hidden md:block relative w-full h-screen overflow-hidden">
        <img
          src={images[current]}
          alt="destination"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center max-w-7xl mx-auto px-6 text-center">
          {/* Text */}
          <div className="text-white max-w-3xl mb-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-snug drop-shadow-lg">
              Booking villa & hotel terbaik <br /> dengan harga promo
            </h1>
            <p className="mt-4 text-lg text-gray-200 drop-shadow">
              Temukan penginapan impianmu dengan mudah, cepat, dan hemat.
            </p>
          </div>

          {/* Search Bar  */}
          <div className="w-full max-w-4xl">
            <SearchBar
              onSearch={({ location, duration, guests }) => {
                const params = new URLSearchParams();

                if (location) params.set("city", location);
                if (duration?.startDate)
                  params.set("startDate", duration.startDate.toISOString());
                if (duration?.endDate)
                  params.set("endDate", duration.endDate.toISOString());
                if (guests)
                  params.set(
                    "guests",
                    String((guests.adults ?? 0) + (guests.children ?? 0))
                  );

                router.push(`/properties?${params.toString()}`);
              }}
            />
          </div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden relative h-[80vh] w-full overflow-hidden">
        <img
          src={images[current]}
          alt="destination"
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center px-4 text-center">
          <h1 className="text-white text-2xl font-bold leading-snug mb-4 drop-shadow-lg">
            Booking villa & hotel terbaik dengan harga promo
          </h1>
          <div className="w-full max-w-md">
            <SearchBar
              onSearch={({ location, duration, guests }) => {
                const params = new URLSearchParams();

                if (location) params.set("city", location);
                if (duration?.startDate)
                  params.set("startDate", duration.startDate.toISOString());
                if (duration?.endDate)
                  params.set("endDate", duration.endDate.toISOString());
                if (guests)
                  params.set(
                    "guests",
                    String((guests.adults ?? 0) + (guests.children ?? 0))
                  );

                router.push(`/properties?${params.toString()}`);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
