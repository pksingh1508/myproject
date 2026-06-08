import { HeroSection } from "./hero-section";
import { WhatYouGet } from "./what-you-get";
import { HowItWork } from "./how-it-work";
import { WhyChooseUs } from "./why-choose-us";
import { Testimonials } from "./testimonials";
import { Footer } from "./footer";

export async function HomePage() {
  return (
    <main className="bg-background">
      <HeroSection />
      <HowItWork />
      <WhatYouGet />
      <WhyChooseUs />
      <Testimonials />
      <Footer />
    </main>
  );
}
