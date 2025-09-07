// import PromoCarousel from "./promoCarousel";
// import { supabase } from "@/lib/db";

// export default async function PromoPage() {
//   const { data, error } = await supabase.from("promo").select("id, title, img");

//   if (error) {
//     console.error("Supabase error:", error.message);
//   }

//   const promos = (data || []).map((item, idx) => ({
//     id: item.id ?? String(idx), 
//     title: item.title ?? "Promo Spesial",
//     image:
//       item.img && item.img.trim() !== "" ? item.img : `/img/prom/1.webp`, 
//   }));

//   return <PromoCarousel promos={promos} />;
// }
