import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechMarquee from "@/components/TechMarquee";
import Services from "@/components/Services";
import WhatWeBuild from "@/components/WhatWeBuild";
import Industries from "@/components/Industries";
import WhyUs from "@/components/WhyUs";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TechMarquee />
        <Services />
        <WhatWeBuild />
        <Industries />
        <WhyUs />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
