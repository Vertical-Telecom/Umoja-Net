import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { AboutIntro } from "@/components/about/about-intro";
import { UmojaMeaning } from "@/components/about/umoja-meaning";
import { MissionValues } from "@/components/about/mission-values";
import { Impact } from "@/components/about/impact";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "A Umoja Net nasceu para aproximar pessoas através de uma internet fiável, humana e feita para a realidade africana. Conheça a nossa missão, visão e valores.",
};

export default function SobrePage() {
  return (
    <>
      <AboutHero />
      <AboutIntro />
      <UmojaMeaning />
      <MissionValues />
      <Impact />
    </>
  );
}
