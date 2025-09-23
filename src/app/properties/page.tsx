"use client";

import SearchBar from "./components/searchBar";
import SearchFilters from "./components/searchFilter";
import SearchResults from "./components/searchResult";
import { useSearchProperties } from "./components/usePropertySearch";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PropertiesPage() {
  const {
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
    setStartDate,
    setEndDate,
    setGuests,
    currentPage,
    setCurrentPage,
    totalPages,
    resetFilters,
    MAX_PRICE,
  } = useSearchProperties();

  const router = useRouter();
  const searchParams = useSearchParams();

  // helper untuk update URL query
  const updateQuery = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, val]) => {
      if (val !== undefined && val !== "") params.set(key, val);
      else params.delete(key);
    });

    router.push(`/properties?${params.toString()}`);
  };

  // saat load pertama kali baca query dari URL
  useEffect(() => {
    if (searchParams.get("city")) setCity(searchParams.get("city")!);
    if (searchParams.get("category"))
      setCategory(searchParams.get("category")!);
    if (searchParams.get("maxPrice"))
      setMaxPrice(Number(searchParams.get("maxPrice")));
    if (searchParams.get("facilities"))
      setFacilities(searchParams.get("facilities")!.split(","));
    if (searchParams.get("startDate"))
      setStartDate(searchParams.get("startDate")!);
    if (searchParams.get("endDate")) setEndDate(searchParams.get("endDate")!);
    if (searchParams.get("guests"))
      setGuests(Number(searchParams.get("guests")));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-28">
      {/* Search bar */}
      <div className="mb-6">
        <SearchBar
          onSearch={({ location, duration, guests: guestObj }) => {
            setCity(location ?? "");
            setStartDate(duration?.startDate?.toISOString());
            setEndDate(duration?.endDate?.toISOString());
            setGuests((guestObj?.adults ?? 0) + (guestObj?.children ?? 0));
            setCurrentPage(1);

            updateQuery({
              city: location || undefined,
              startDate: duration?.startDate?.toISOString(),
              endDate: duration?.endDate?.toISOString(),
              guests: guestObj
                ? String((guestObj.adults ?? 0) + (guestObj.children ?? 0))
                : undefined,
            });
          }}
        />
      </div>

 
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
        {/* Sidebar filters */}
        <SearchFilters
          category={category}
          setCategory={(v) => {
            setCategory(v);
            setCurrentPage(1);
            updateQuery({ category: v });
          }}
          maxPrice={maxPrice}
          setMaxPrice={(v) => {
            setMaxPrice(v);
            setCurrentPage(1);
            updateQuery({ maxPrice: String(v) });
          }}
          facilities={facilities}
          setFacilities={(v) => {
            setFacilities(v);
            setCurrentPage(1);
            updateQuery({ facilities: v.join(",") });
          }}
          resetFilters={() => {
            resetFilters();
            setCurrentPage(1);
            router.push("/properties"); 
          }}
          MAX_PRICE={MAX_PRICE}
          city={city}
          setCity={(v) => {
            setCity(v);
            setCurrentPage(1);
            updateQuery({ city: v });
          }}
        />

        {/* Results */}
        <SearchResults
          loading={loading}
          properties={properties}
          category={category}
          location={city}
          currentPage={currentPage}
          setCurrentPage={(p) => {
            setCurrentPage(p);
            updateQuery({ page: String(p) });
          }}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
