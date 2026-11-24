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

      <div className="relative mx-auto mt-auto flex w-full flex-col items-center px-5 text-center sm:px-8 lg:px-12 xl:px-[76px]">
        <h1 className="max-w-[720px] type-display">
          <span className="text-gradient-accent">Entretenimento</span> e <span className="text-gradient-accent">velocidade</span>{" "}
          no mesmo pacote
        </h1>
        <p className="mt-4 max-w-[600px] type-lead">
          Tenha internet rápida, estável e pacotes completos com DSTV Stream para toda a família.
        </p>

        <FeatureTicker />
      </div>
    </section>
  );
}
