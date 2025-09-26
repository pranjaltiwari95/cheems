import CallToAction from "@/components/call-to-action";
import FAQsThree from "@/components/faqs-3";
import FeaturesSection from "@/components/features";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import TestimonialSection from "@/components/testimonials";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="faqs">
        <FAQsThree />
      </div>
      <div id="testimonials">
        <TestimonialSection />
      </div>
      <CallToAction />
      <FooterSection />
    </>
  );
}
