"use client";

import { useState } from "react";

export default function useSearch() {
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
  const [guests, setGuests] = useState({
    rooms: 1,
    adults: 1,
    children: 0,
  });

  return {
    location,
    setLocation,
    dateRange,
    setDateRange,
    guests,
    setGuests,
  };
}
