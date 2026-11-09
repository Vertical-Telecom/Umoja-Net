import { Hero } from "@/components/home/hero";
import { Benefits } from "@/components/home/benefits";
import { PlansSection } from "@/components/home/plans-section";
import { Entertainment } from "@/components/home/entertainment";
import { Network } from "@/components/home/network";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="relative z-10 rounded-b-[3rem] bg-white">
        <Benefits />
        <PlansSection />
      </div>
      <Entertainment />
      <Network />
    </>
  );
}
