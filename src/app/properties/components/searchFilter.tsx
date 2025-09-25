"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BE_URL } from "@/configs/config";
import { CityPropsParams } from "@/interface/property.types";

const CATEGORY_OPTIONS = [
  "all",
  "hotel",
  "villa",
  "apartment",
  "resort",
  "guesthouse",
];
const FACILITY_OPTIONS = ["wifi", "pool", "parking", "ac"];

export default function SearchFilters({
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
  facilities,
  setFacilities,
  resetFilters,
  MAX_PRICE,
  city,
  setCity,
}: CityPropsParams) {
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // fetch semua properties lalu ambil city
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await axios.get(`${BE_URL}api/properties/`, {
          params: { take: 500 },
        });

        const props: CityPropsParams[] = data?.data || data?.items || [];
        const uniqueCities: string[] = Array.from(
          new Set(
            props.map((p) => p.city).filter((c): c is string => Boolean(c))
          )
        );

        setCityOptions(uniqueCities);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
        setCityOptions([]);
      }
    };
    fetchCities();
  }, []);

  // update suggestions saat user ketik
  const handleCityChange = (val: string) => {
    setCity(val);
    if (val.length > 1) {
      setSuggestions(
        cityOptions.filter((c) => c.toLowerCase().includes(val.toLowerCase()))
      );
    } else {
      setSuggestions([]);
    }
  };

  return (
    <aside className="col-span-1 space-y-6">
      <h2 className="font-bold text-lg">Filter</h2>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-semibold mb-2">Price</label>
        <input
          type="range"
          min={0}
          max={MAX_PRICE}
          step={50_000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-sm mt-1">
          Up to Rp {maxPrice.toLocaleString("id-ID")}
        </p>
      </div>

      {/* Facilities */}
      <div>
        <label className="block text-sm font-semibold mb-2">Facilities</label>
        {FACILITY_OPTIONS.map((f) => (
          <div key={f} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={f}
              checked={facilities.includes(f)}
              onChange={() =>
                setFacilities(
                  facilities.includes(f)
                    ? facilities.filter((x) => x !== f)
                    : [...facilities, f]
                )
              }
            />
            <label htmlFor={f} className="text-sm capitalize">
              {f}
            </label>
          </div>
        ))}
      </div>

      {/* Reset */}
      <button
        onClick={resetFilters}
        className="w-full bg-gray-200 hover:bg-gray-300 rounded p-2 text-sm"
      >
        Reset Filters
      </button>
    </aside>
  );
}
