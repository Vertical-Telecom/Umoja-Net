import { Hero } from "@/components/home/hero";
import { Benefits } from "@/components/home/benefits";
import { ExpressNews } from "@/components/home/express-news";
import { TeamMural } from "@/components/home/team-mural";
import { InterestForm } from "@/components/home/interest-form";

export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <ExpressNews />
      <TeamMural />
      <InterestForm />
    </>
  );
}
