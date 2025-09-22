import Hero from "@/components/hero";
import WhyRestify from "@/components/other/whyRestify";
import PartnerPayment from "@/components/other/partnerPayment";
import PartnerTenant from "@/components/other/partnerTenant";
import CityCarousel from "@/components/listing/propertyByCity";
import PropertiesCarousel from "@/components/listing/propertyPage";

export default function HomeView() {
  return (
    <main>
      <Hero />

      <PropertiesCarousel />
      <CityCarousel />

      <WhyRestify />
      <PartnerTenant />
      <PartnerPayment />
    </main>
  );
}
