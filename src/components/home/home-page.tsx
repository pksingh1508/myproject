import { HeroSection } from "./hero-section";
import { TracksMarquee } from "./tracks-marquee";
import { HowItWork } from "./how-it-work";
import { WhatYouGet } from "./what-you-get";
import { WhyChooseUs } from "./why-choose-us";
import { Testimonials } from "./testimonials";
import { ClosingCta } from "./closing-cta";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <TracksMarquee />
      <HowItWork />
      <WhatYouGet />
      <WhyChooseUs />
      <Testimonials />
      <ClosingCta />
    </>
  );
}
