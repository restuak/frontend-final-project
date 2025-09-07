"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import { payments } from "../data/payment";

export default function PartnerPayment() {
  return (
    <section className="py-12 bg-white text-mainText">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Partner Pembayaran Resmi
        </h2>
        <p className="mb-6 text-gray-700 text-center">
          Kami bekerja sama dengan berbagai penyedia layanan pembayaran agar
          transaksi Anda selalu aman dan lancar.
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
            {payments.map((logo, idx) => (
              <CarouselItem
                key={idx}
                className="basis-1/3 md:basis-1/6 flex items-center justify-center"
              >
                <Image
                  src={logo}
                  alt="Payment Partner"
                  width={60}
                  height={50}
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
