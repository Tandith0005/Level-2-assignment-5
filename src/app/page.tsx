import Image from "next/image";
import HeroSection from "../components/homepage/heroSection";
import UpcomingEventsSlider from "../components/homepage/upcomingEventSlider";
import EventCategoriesSection from "../components/homepage/eventCategories";
import CTASection from "../components/homepage/ctaSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <UpcomingEventsSlider />
      <EventCategoriesSection />
      <CTASection />
    </div>
  );
}
