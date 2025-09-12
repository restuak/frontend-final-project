"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/store/search.store";

import LocationPicker from "./location";
import DatePicker from "./date";
import GuestPicker from "./guest";

export default function SearchForm() {
  const { location, dateRange, guests } = useSearchStore();

  // state popup
  const [openLocation, setOpenLocation] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openGuest, setOpenGuest] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Lokasi:", location);
    console.log("Tanggal:", dateRange);
    console.log("Tamu:", guests);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 space-y-3"
    >
      {/* Location */}
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start"
        onClick={() => setOpenLocation(true)}
      >
        {location || "Pilih Lokasi"}
      </Button>
      <LocationPicker
        open={openLocation}
        onClose={() => setOpenLocation(false)}
      />

      {/* Date */}
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start"
        onClick={() => setOpenDate(true)}
      >
        {dateRange ? `${dateRange[0]} - ${dateRange[1]}` : "Pilih Tanggal"}
      </Button>
      <DatePicker open={openDate} onClose={() => setOpenDate(false)} />

      {/* Guest */}
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start"
        onClick={() => setOpenGuest(true)}
      >
        {guests ? `${guests} Tamu` : "Pilih Jumlah Tamu"}
      </Button>
      <GuestPicker open={openGuest} onClose={() => setOpenGuest(false)} />

      {/* Submit */}
      <Button
        type="submit"
        className="w-full mt-4 bg-[#FF5841] hover:bg-[#C53678] text-white font-semibold py-2 rounded-md"
      >
        Ayo Cari
      </Button>
    </form>
  );
}
