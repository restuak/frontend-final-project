"use client";

import { useState, useEffect } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import axios from "axios";
import { BE_URL } from "@/configs/config";
import { SearcPropsParams } from "@/interface/property.types";

export default function SearchBar({ onSearch }: SearcPropsParams) {
  const [location, setLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);

  const [showDate, setShowDate] = useState(false);
  const [dateRange, setDateRange] = useState<
    { startDate?: Date; endDate?: Date; key: string }[]
  >([{ startDate: undefined, endDate: undefined, key: "selection" }]);

  const [showGuests, setShowGuests] = useState(false);
  //default kosong
  const [guests, setGuests] = useState<{ adults?: number; children?: number }>(
    {}
  );

  //aftar kota unik dari BE
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await axios.get(`${BE_URL}api/properties/`);
        if (data?.success && Array.isArray(data.data)) {
          const rawCities: string[] = data.data
            .map((p: any) => p.city)
            .filter((c: string): c is string => Boolean(c));
          const uniqueCities = Array.from(new Set(rawCities));
          setAllCities(uniqueCities);
        }
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      }
    };
    fetchCities();
  }, []);

  const handleLocationChange = (val: string) => {
    setLocation(val);
    if (val.length > 0) {
      setLocationSuggestions(
        allCities.filter((c) => c.toLowerCase().includes(val.toLowerCase()))
      );
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleDateChange = (ranges: RangeKeyDict) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([
      {
        startDate: startDate ?? undefined,
        endDate: endDate ?? undefined,
        key: "selection",
      },
    ]);
  };

  const handleSearch = () => {
    if (
      !location &&
      !dateRange[0].startDate &&
      !dateRange[0].endDate &&
      !guests.adults &&
      !guests.children
    ) {
      onSearch({});
      return;
    }
    onSearch({
      location: location || undefined,
      duration:
        dateRange[0].startDate || dateRange[0].endDate
          ? { startDate: dateRange[0].startDate, endDate: dateRange[0].endDate }
          : undefined,
      guests:
        guests.adults || guests.children
          ? { adults: guests.adults ?? 0, children: guests.children ?? 0 }
          : undefined,
    });
  };

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-4 flex flex-col sm:flex-row gap-4 relative">
      {/* Location */}
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => handleLocationChange(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        />
        {locationSuggestions.length > 0 && (
          <ul className="absolute z-20 bg-white border rounded mt-1 shadow w-full text-sm max-h-40 overflow-y-auto">
            {locationSuggestions.map((s) => (
              <li
                key={s}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setLocation(s);
                  setLocationSuggestions([]);
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Date Range */}
      <div className="flex-1 relative">
        <button
          onClick={() => setShowDate(!showDate)}
          className="w-full border rounded-lg px-4 py-2 text-left"
        >
          {dateRange[0].startDate && dateRange[0].endDate
            ? `${dateRange[0].startDate.toLocaleDateString()} - ${dateRange[0].endDate.toLocaleDateString()}`
            : "Select Dates"}
        </button>
        {showDate && (
          <div className="absolute z-20 mt-2 bg-white shadow-lg p-3 rounded-lg">
            <DateRange
              ranges={dateRange}
              onChange={handleDateChange}
              moveRangeOnFirstSelection={false}
              editableDateInputs={true}
            />
            <button
              onClick={() => setShowDate(false)}
              className="mt-2 px-3 py-1 bg-[#FF5841] text-white rounded"
            >
              Ok
            </button>
          </div>
        )}
      </div>

      {/* Guests */}
      <div className="w-48 relative">
        <button
          onClick={() => setShowGuests(!showGuests)}
          className="w-full border rounded-lg px-4 py-2 text-left"
        >
          {guests.adults || guests.children
            ? `${guests.adults ?? 0} Adults, ${guests.children ?? 0} Children`
            : "Guests"}
        </button>
        {showGuests && (
          <div className="absolute z-20 mt-2 bg-white shadow-lg p-3 rounded-lg w-56">
            <div className="flex justify-between items-center mb-2">
              <span>Dewasa</span>
              <input
                type="number"
                min={0}
                value={guests.adults ?? ""}
                onChange={(e) =>
                  setGuests({ ...guests, adults: Number(e.target.value) })
                }
                className="w-16 border rounded px-2 py-1"
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Anak</span>
              <input
                type="number"
                min={0}
                value={guests.children ?? ""}
                onChange={(e) =>
                  setGuests({ ...guests, children: Number(e.target.value) })
                }
                className="w-16 border rounded px-2 py-1"
              />
            </div>
            <button
              onClick={() => setShowGuests(false)}
              className="mt-3 w-full px-3 py-1 bg-[#FF5841] text-white rounded"
            >
              Ok
            </button>
          </div>
        )}
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-[#FF5841] text-white px-6 py-2 rounded-lg hover:bg-[#e14d38]"
      >
        Cari
      </button>
    </div>
  );
}
