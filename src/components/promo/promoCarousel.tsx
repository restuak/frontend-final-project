// "use client";

// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import AutoScroll from "embla-carousel-auto-scroll";

// interface Promo {
//   id: string;
//   image: string;
//   title: string;
// }

// interface PromoCarouselProps {
//   promos: Promo[];
// }

// export default function PromoCarousel({ promos }: PromoCarouselProps) {
//   const router = useRouter();

//   const handleClick = (id: string) => {
//     router.push(`/properties/search?promo=${id}`);
//   };

//   return (
//     <div className="relative w-full max-w-6xl mx-auto mb-12">
//       <Carousel
//         opts={{
//           align: "start",
//           loop: true,
//         }}
//         plugins={[
//           AutoScroll({
//             speed: 1,
//             stopOnInteraction: true,
//           }),
//         ]}
//       >
//         <CarouselContent>
//           {promos.map((promo) => (
//             <CarouselItem
//               key={promo.id}
//               className="basis-full sm:basis-1/2 md:basis-1/3 cursor-pointer"
//               onClick={() => handleClick(promo.id)}
//             >
//               <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
//                 <Image
//                   src={promo.image}
//                   alt={promo.title}
//                   fill
//                   className="object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//                   <h2 className="text-white text-lg md:text-2xl font-bold drop-shadow-lg px-2 text-center">
//                     {promo.title}
//                   </h2>
//                 </div>
//               </div>
//             </CarouselItem>
//           ))}
//         </CarouselContent>

//         {/* tombol navigasi, tampil hanya di desktop */}
//         <CarouselPrevious className="hidden md:flex" />
//         <CarouselNext className="hidden md:flex" />
//       </Carousel>
//     </div>
//   );
// }
