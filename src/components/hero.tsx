"use client";

import { useState, useEffect } from "react";
import SearchForm from "../features/search/searchform";
export default function Hero() {
  const images = [
    "https://res.cloudinary.com/demo/image/upload/w_1600,h_900,c_fill/beach.jpg",
    "https://res.cloudinary.com/demo/image/upload/w_1600,h_900,c_fill/mountain.jpg",
    "https://res.cloudinary.com/demo/image/upload/w_1600,h_900,c_fill/beach.jpg",
    "https://res.cloudinary.com/demo/image/upload/w_1600,h_900,c_fill/mountain.jpg",
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
      <div className="hidden md:block relative w-full h-[90vh] overflow-hidden">
        <img
          src={images[current]}
          alt="destination"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 h-full flex items-center justify-between max-w-7xl mx-auto px-6">
          {/* Text */}
          <div className="text-white max-w-xl">
            <h1 className="text-4xl lg:text-5xl font-bold leading-snug">
              Booking hotel murah online <br /> dengan harga promo
            </h1>
          </div>

        
          <SearchForm />
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden px-4 py-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
         
          <div className="relative h-65 w-full overflow-hidden">
            <img
              src={images[current]}
              alt="destination"
              className="w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h1 className="text-white text-xl font-bold text-center px-3">
                Booking hotel murah online dengan harga promo
              </h1>
            </div>
          </div>

         
          <div className="p-4">
            <SearchForm />
          </div>
        </div>
      </div>
    </section>
  );
}
