import { HeroSection } from "./hero-section";
import { WhatYouGet } from "./what-you-get";
import { HowItWork } from "./how-it-work";
import { WhyChooseUs } from "./why-choose-us";
import { FAQ } from "./faq";
import { Testimonials } from "./testimonials";
import { SeoContent } from "./seo-content";
import { Footer } from "./footer";

export async function HomePage() {
  return (
    <main className="bg-background">
      <HeroSection />
      <HowItWork />
      <WhatYouGet />
      <WhyChooseUs />
      {/* <FAQ /> */}
      <Testimonials />
      {/* <SeoContent /> */}
      <Footer />
    </main>
  );
}
