import { Hero } from "@/components/landing/Hero";
import { StatsScene } from "@/components/landing/StatsScene";
import { EmailScene } from "@/components/landing/EmailScene";
import { UrlScene } from "@/components/landing/UrlScene";
import { AiScene } from "@/components/landing/AiScene";
import { Features, FinalCta, ModulesTeaser } from "@/components/landing/Features";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsScene />
      <EmailScene />
      <UrlScene />
      <AiScene />
      <Features />
      <ModulesTeaser />
      <FinalCta />
    </>
  );
}
