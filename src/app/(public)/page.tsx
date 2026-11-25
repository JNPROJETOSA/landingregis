import { Hero } from "@/sections/Hero";
import { ExamMarquee } from "@/sections/ExamMarquee";
import { Identification } from "@/sections/Identification";
import { ExamProfiles } from "@/sections/ExamProfiles";
import { HowItWorks } from "@/sections/HowItWorks";
import { Methodology } from "@/sections/Methodology";
import { ComparisonSection } from "@/sections/ComparisonSection";
import { Platform } from "@/sections/Platform";
import { Mentor } from "@/sections/Mentor";
import { SocialProof } from "@/sections/SocialProof";
import { LimitedSpots } from "@/sections/LimitedSpots";
import { Faq } from "@/sections/Faq";
import { Candidatura } from "@/sections/Candidatura";

export default function Home() {
  return (
    <>
      <Hero />
      <ExamMarquee />
      <Identification />
      <ExamProfiles />
      <HowItWorks />
      <Methodology />
      <ComparisonSection />
      <Platform />
      <Mentor />
      <SocialProof />
      <LimitedSpots />
      <Faq />
      <Candidatura />
    </>
  );
}
