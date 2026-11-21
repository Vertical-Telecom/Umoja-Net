import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
// hero.jpg: imagem extraída de aboutpage/hero/BG.svg (o next/image não otimiza SVG).
import heroImage from "../../../public/img/aboutpage/hero.jpg";

/** Hero da página "Sobre nós": título em baixo à esquerda, texto e botão à direita (como os slides 2 e 3 do Início). */
export function AboutHero() {
  return (
    <section className="relative isolate flex min-h-[max(560px,100svh)] overflow-hidden bg-brand-950 pt-24 pb-16 text-white lg:pt-0 lg:pb-0">
      <Image
        src={heroImage}
        alt="Família angolana sorridente, com roupas tradicionais, em frente a casas de uma aldeia"
        fill
        sizes="100vw"
        preload
        placeholder="blur"
        className="-z-20 object-cover"
        style={{ objectPosition: "center 70%" }}
      />
      {/* Desfoque em degradê: nítido em cima, desfocado em baixo (atrás do texto), como no design */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 backdrop-blur-xl"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 28%, black 78%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 28%, black 78%)",
        }}
      />
      {/* Escurece a parte de baixo, onde está o texto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(to bottom, transparent 28%, rgb(4 2 13 / 0.4) 68%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-[#04020d]/90 via-[#04020d]/50 via-55% to-transparent lg:hidden"
      />

      <div className="relative mx-auto flex w-full flex-col px-5 sm:px-8 lg:px-12 xl:px-19">
        <div className="mt-auto flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12 lg:pb-[clamp(72px,15svh,122px)]">
          <h1 className="font-display text-[40px] leading-12 font-semibold tracking-[-1.5px] sm:text-[48px] sm:leading-14.25 lg:max-w-124 lg:text-[56px] lg:leading-16.5 lg:tracking-[-2px]">
            Ligados pela <span className="text-gradient-accent">conexão</span>, movidos pela{" "}
            <span className="text-gradient-accent">unidade</span>.
          </h1>
          <div className="flex flex-col items-start gap-6 lg:max-w-110.25 lg:pt-1.5">
            <p className="font-display text-lg leading-6.5 font-normal text-white lg:text-[24px] lg:leading-7.5">
              Nós acreditamos na força da unidade. É por isso que conectamos pessoas, culturas e histórias.
            </p>
            <Link
              href="/planos"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-[60px] bg-white px-6 py-4 font-display text-base leading-6 font-semibold text-foundation-blue-600 shadow-lg shadow-brand-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-50"
            >
              Ver Planos
              <ArrowRight className="size-6 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
