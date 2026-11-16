import Image from "next/image";
import { FeatureTicker } from "./feature-ticker";
// hero.jpg: imagem extraída de planpage/Rectangle 3.svg (o next/image não otimiza SVG).
import heroImage from "../../../public/img/planpage/hero.jpg";

/** Hero da página "Planos": título centrado em baixo e destaques em vidro que alternam (FeatureTicker). */
export function PlansHero() {
  return (
    <section className="relative isolate flex min-h-[max(600px,100svh)] overflow-hidden bg-brand-950 pt-28 pb-12 text-white lg:pb-[clamp(40px,8svh,72px)]">
      <Image
        src={heroImage}
        alt="Família sorridente no sofá, com pipocas, a ver televisão com luzes coloridas à volta"
        fill
        sizes="100vw"
        preload
        placeholder="blur"
        className="-z-20 object-cover"
      />
      {/* Degradê do Rectangle 3.svg: preto a 0,8 × 0,93 a partir de ~34% da altura */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(to bottom, transparent 34%, rgb(0 0 0 / 0.74) 66%)" }}
      />

      <div className="relative mx-auto mt-auto flex w-full max-w-[1440px] flex-col items-center px-5 text-center sm:px-8 lg:px-12 xl:px-[76px]">
        <h1 className="max-w-[720px] font-display text-[40px] leading-[48px] font-semibold tracking-[-1.5px] sm:text-[48px] sm:leading-[57px] lg:text-[56px] lg:leading-[66px] lg:tracking-[-2px]">
          <span className="text-accent-400">Entretenimento</span> e <span className="text-accent-400">velocidade</span>{" "}
          no mesmo pacote
        </h1>
        <p className="mt-4 max-w-[600px] font-display text-lg leading-[26px] font-normal lg:text-[22px] lg:leading-[30px]">
          Tenha internet rápida, estável e pacotes completos com DSTV Stream para toda a família.
        </p>

        <FeatureTicker />
      </div>
    </section>
  );
}
