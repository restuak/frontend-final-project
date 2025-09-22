"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { BE_URL } from "@/configs/config";

export interface Property {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  category: string;
  facilities: string[];
  imageUrl: string | null;
  price: number;
  rating: number;
}

const PER_PAGE = 5;
const MAX_PRICE = 2_500_000;

export function useSearchProperties() {
  const searchParams = useSearchParams();

  //  Inisialisasi dari query URL
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "all"
  );
  const [facilities, setFacilities] = useState<string[]>(
    searchParams.get("facilities")
      ? searchParams.get("facilities")!.split(",")
      : []
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : MAX_PRICE
  );
  const [startDate, setStartDate] = useState<string | undefined>(
    searchParams.get("startDate") ?? undefined
  );
  const [endDate, setEndDate] = useState<string | undefined>(
    searchParams.get("endDate") ?? undefined
  );
  const [guests, setGuests] = useState<number>(
    searchParams.get("guests") ? Number(searchParams.get("guests")) : 1
  );
  const [currentPage, setCurrentPage] = useState(
    searchParams.get("page") ? Number(searchParams.get("page")) : 1
  );

  // Data
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params: any = {
        take: PER_PAGE,
        skip: (currentPage - 1) * PER_PAGE,
      };

      if (city && city !== "all") params.city = city;
      if (category && category !== "all") params.category = category;
      if (facilities.length) params.facilities = facilities.join(",");
      if (maxPrice) params.maxPrice = maxPrice;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (guests) params.guests = guests;

      const { data } = await axios.get(`${BE_URL}/api/properties/`, {
        params,
      });

      const results: Property[] = data?.items ?? data?.data ?? [];
      setProperties(results);
      setTotalPages(Math.ceil((data?.total ?? results.length) / PER_PAGE));
    } catch (err) {
      console.error("Error fetching properties:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
     }, [
    city,
    category,
    facilities,
    maxPrice,
    startDate,
    endDate,
    guests,
    currentPage,
  ]);

  const resetFilters = () => {
    setCity("");
    setCategory("all");
    setFacilities([]);
    setMaxPrice(MAX_PRICE);
    setStartDate(undefined);
    setEndDate(undefined);
    setGuests(1);
    setCurrentPage(1);
  };

  return {
    loading,
    properties,
    city,
    setCity,
    category,
    setCategory,
    facilities,
    setFacilities,
    maxPrice,
    setMaxPrice,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    guests,
    setGuests,
    currentPage,
    setCurrentPage,
    totalPages,
    resetFilters,
    MAX_PRICE,
    PER_PAGE,
  };
}
