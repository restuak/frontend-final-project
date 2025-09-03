"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PromoCarouselProps {
  promos: {
    id: string;
    image: string;
    title: string;
  }[];
}

export default function PromoCarousel({ promos }: PromoCarouselProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promos.length]);

  const handleClick = (id: string) => {
    router.push(`/properties/search?promo=${id}`);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mb-12 overflow-hidden rounded-2xl shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={promos[current].id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-64 md:h-96 cursor-pointer"
          onClick={() => handleClick(promos[current].id)}
        >
          <Image
            src={promos[current].image}
            alt={promos[current].title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h2 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg">
              {promos[current].title}
            </h2>
          </div>
        </motion.div>
      </AnimatePresence>

     
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {promos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${
              current === i ? "bg-[#FF5841]" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
