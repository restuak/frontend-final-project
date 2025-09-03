import Hero from "@/components/hero";
import CityTabs from "@/components/listing/cityTab";
import PropertyFilter from "@/components/listing/propertyFilter";
import PropertyListing from "@/components/listing/propertyListing";
import PromoCarousel from "@/components/promo/promoCarousel";



export default function HomeView() {
  const promos = [
    {
      id: "summer",
      image: "/img/prom/1.webp",
      title: "Promo Summer Bali",
    },
    {
      id: "weekend",
      image: "/img/prom/2.webp",
      title: "Weekend Hemat Jakarta",
    },
    {
      id: "luxury",
      image: "/img/prom/3.webp",
      title: "Luxury Deals Bandung",
    },
  ];
  return (
    <main>
      <Hero />
      <CityTabs
        cities={[
          { name: "Bali", image: "/img/city/bali.jpg" },
          { name: "Jogja", image: "/img/city/jakarta.webp" },
          { name: "Malang", image: "/img/city/malang.jfif" },
          { name: "Jakarta", image: "/img/city/jakarta.jpg" },
        ]}
      />
      <PromoCarousel promos={promos} />
      <PropertyListing city="all" type="all" />
      <PropertyFilter
        types={["Apartment", "House", "Hotel", "Villa", "Cottage"]}
      />
    </main>
  );
}
