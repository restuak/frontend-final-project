"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import { tenants } from "@/data/tenants";

export default function PartnerTenant() {
  return (
    <section className="py-12 pb-0 bg-offWhite text-mainText">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-2 text-center">Partner Hotel</h2>
        <p className="mb-6 text-gray-700 text-center">
          Kami bermitra dengan jaringan hotel dalam dan luar negeri untuk
          memastikan kenyamanan Anda di mana pun Anda berada.
        </p>

        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[
            AutoScroll({
              speed: 1,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="flex items-center">
            {tenants.map((logo, idx) => (
              <CarouselItem
                key={idx}
                className="basis-1/3 md:basis-1/6 flex items-center justify-center"
              >
                <Image
                  src={logo}
                  alt="Hotel Partner"
                  width={70}
                  height={60}
                  className="object-contain"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
