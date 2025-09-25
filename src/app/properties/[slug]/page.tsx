"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { BE_URL } from "@/configs/config";

interface Room {
  id: string;
  name: string;
  capacity: number;
  price: number;
  images: string[];
  facilities: string[];
  daily: { date: string; price: number; available: number }[];
}

interface PropertyDetail {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  category: string;
  images: string[];
  price: number;
  rating: number;
  rooms: Room[];
}

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Room & Date states
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<any>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  useEffect(() => {
    if (!slug) return;
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${BE_URL}api/properties/${slug}`);
        const data = await res.json();
        setProperty(data.data);
      } catch (err) {
        console.error("Failed to fetch property detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  if (loading) return <p className="text-center my-10">Loading...</p>;
  if (!property)
    return <p className="text-center my-10">Property not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-24 pb-10">
      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div className="col-span-2 md:col-span-2">
              <Image
                src={property.images[0] || "/img/default-property.jpg"}
                alt={property.name}
                width={800}
                height={500}
                className="rounded-lg object-cover w-full h-[220px] md:h-[400px]"
              />
            </div>
            {property.images.slice(1, 3).map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={`thumb-${i}`}
                width={400}
                height={200}
                className="rounded-lg object-cover w-full h-[100px] md:h-[195px]"
              />
            ))}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{property.name}</h1>
            <p className="text-gray-600">
              {property.city} · {property.category}
            </p>
            <p className="text-yellow-500 text-sm md:text-base">
              ⭐ {property.rating.toFixed(1)} / 5
            </p>
          </div>

          {/* Description */}
          <div>
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-sm md:text-base leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Room Types */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Available Rooms</h2>
            <div className="grid gap-4">
              {property.rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition ${
                    selectedRoom === room.id
                      ? "border-[#FF5841] bg-orange-50"
                      : "hover:border-[#FF5841]/60"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{room.name}</h3>
                      <p className="text-sm text-gray-600">
                        Kapasitas: {room.capacity} orang
                      </p>
                      <p className="text-[#FF5841] font-semibold">
                        Rp {room.price.toLocaleString("id-ID")} / night
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {room.images.slice(0, 2).map((img, i) => (
                        <Image
                          key={i}
                          src={img}
                          alt={`${room.name}-${i}`}
                          width={100}
                          height={80}
                          className="rounded-md object-cover w-20 h-16"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Fasilitas: {room.facilities.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT Booking Box */}
        <div className="p-4 md:p-6 border rounded-xl shadow sticky top-24 h-fit">
          <p className="text-lg md:text-xl font-bold text-[#FF5841]">
            Rp {property.price.toLocaleString("id-ID")}{" "}
            <span className="text-sm text-gray-500"> / night</span>
          </p>

          {/* Date Picker */}
          <div className="mt-4">
            <DateRange
              ranges={dateRange}
              onChange={(item) => setDateRange([item.selection])}
              rangeColors={["#FF5841"]}
              months={1}
              direction="vertical"
              className="w-full"
            />
          </div>

          {/* Confirm Button */}
          <button
            disabled={!selectedRoom}
            className={`w-full mt-4 py-3 rounded-lg font-semibold transition ${
              selectedRoom
                ? "bg-[#FF5841] text-white hover:bg-[#C53678]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {selectedRoom ? "Reserve Now" : "Select a Room First"}
          </button>
        </div>
      </div>
    </div>
  );
}
