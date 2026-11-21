import { Hero } from "@/components/home/hero";
import { Benefits } from "@/components/home/benefits";
import { ExpressNews } from "@/components/home/express-news";
import { TeamMural } from "@/components/home/team-mural";

export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <ExpressNews />
      <TeamMural />
    </>
  );
}
