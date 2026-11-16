import type { Metadata } from "next";
import { PlansHero } from "@/components/plans/plans-hero";
import { PlansSection } from "@/components/home/plans-section";
import { PlanNames } from "@/components/plans/plan-names";
import { RightChoice } from "@/components/plans/right-choice";

export const metadata: Metadata = {
  title: "Planos",
  description:
    "Planos de internet Ukamba, Omunga e Muige e pacotes com DSTV Stream. Velocidades reais, download ilimitado e instalação rápida em Luanda.",
};

export default function PlanosPage() {
  return (
    <>
      <PlansHero />
      <PlansSection />
      <PlanNames />
      <RightChoice />
    </>
  );
}
