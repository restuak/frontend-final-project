"use client";

import Link from "next/link";
import Image from "next/image";
import { SearchPropsResult } from "@/interface/property.types";


export default function SearchResults({
  loading,
  properties,
  category,
  location,
  currentPage,
  setCurrentPage,
  totalPages,
}: SearchPropsResult) {
  return (
    <main className="col-span-3 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {category === "all" && !location
            ? "Hasil Pencarian"
            : `Hasil Pencarian ${category !== "all" ? category : ""}`}
        </h1>
        <p className="text-gray-600">
          {properties.length} properti ditemukan di halaman ini
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <>
          {properties.map((p) => (
            <Link
              key={p.id}
              href={`/properties/${p.slug || p.id}`}
              className="flex gap-4 border rounded-lg p-4 shadow hover:bg-gray-50 transition"
            >
              <Image
                src={p.imageUrl || "/img/default-property.webp"}
                alt={p.name}
                width={200}
                height={150}
                className="object-cover rounded-lg"
              />
              <div className="flex-1 space-y-1">
                <h2 className="font-bold text-lg">{p.name}</h2>
                <p className="text-sm text-gray-500">{p.city}</p>
                <p className="text-xs text-gray-400 italic">{p.category}</p>
                <p className="text-xs text-yellow-500">
                  ⭐ {p.rating?.toFixed(1) ?? "0.0"} / 5
                </p>
                <p className="font-semibold text-[#FF5841]">
                  Rp {p.price?.toLocaleString("id-ID") ?? "0"}
                </p>

                {/* Fasilitas */}
                {(p.facilities ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(p.facilities ?? []).slice(0, 4).map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 text-xs bg-gray-100 rounded-full text-gray-700"
                      >
                        {f}
                      </span>
                    ))}
                    {(p.facilities ?? []).length > 4 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                        +{(p.facilities ?? []).length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-[#FF5841] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
