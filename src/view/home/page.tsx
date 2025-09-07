import Hero from "@/components/hero";
import CityTabs from "@/components/listing/cityTab";
import PropertyFilter from "@/components/listing/propertyFilter";
import PropertyListing from "@/components/listing/propertyListing";
import PromoCarousel from "@/components/promo/promoCarousel";
import WhyRestify from "@/components/whyRestify";
import PartnerPayment from "@/components/partnerPayment";
import PartnerTenant from "@/components/partnerTenant";
import PromoPage from "@/components/promo/promoPage";



export default function HomeView() {
  
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
   
      <PropertyListing city="all" type="all" />
      <PropertyFilter
        types={["Apartment", "House", "Hotel", "Villa", "Cottage"]}
      />
      <WhyRestify />
      <PartnerTenant />
      <PartnerPayment />
    </main>
  );
}
