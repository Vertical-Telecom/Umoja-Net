"use client";

import Image from "next/image";
import { tvPackages } from "@/data/plans";
import { site } from "@/lib/site";
import { CarouselArrows, useScrollCarousel } from "@/components/carousel";
import { ArrowRight } from "@/components/icons";
import comboImage from "../../../public/img/home/combo.png";
import dstvStreamLogo from "../../../public/img/home/logo_dstv_stream.svg";

/** "Entretenimento e velocidade": pacotes DSTV Stream sobre imagem. */
export function Entertainment() {
  const { ref: trackRef, canPrev, canNext, prev, next } = useScrollCarousel<HTMLUListElement>();

  return (
    <section
      id="entretenimento"
      aria-labelledby="entretenimento-titulo"
      className="relative isolate -mt-12 overflow-hidden bg-brand-950 pt-28 pb-32 text-white sm:pt-32"
    >
      <Image
        src={comboImage}
        alt=""
        fill
        sizes="100vw"
        placeholder="blur"
        className="-z-20 object-cover object-[60%_center]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-brand-950/80 via-brand-950/30 to-brand-950/85" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 id="entretenimento-titulo" className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
          <span className="text-gradient-accent">Entretenimento e velocidade</span>
          <br />
          no mesmo pacote!
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/85 sm:text-base">
          Tenha internet rápida e acesso ao DSTV Stream para filmes, séries, futebol e canais ao vivo.
        </p>

        <ul
          ref={trackRef}
          className="scrollbar-none relative -mx-5 mt-40 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-6 sm:mx-0 sm:mt-64 lg:mt-80 sm:scroll-px-0 sm:px-0"
        >
          {tvPackages.map((pkg) => (
            <li
              key={pkg.id}
              className="flex w-[78%] shrink-0 snap-start flex-col rounded-3xl border border-white/20 bg-brand-950/35 p-5 backdrop-blur-xl sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)]"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{pkg.name}</h3>
                <Image src={dstvStreamLogo} alt="DSTV Stream" unoptimized className="h-3.5 w-auto shrink-0" />
              </div>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-semibold">{pkg.speed} Mbps</span>
                <span className="text-xs text-white/70">Ilimitado</span>
              </p>
              <p className="mt-3 text-xs leading-relaxed text-white/80">
                Pacote Grande da <strong className="font-semibold text-white">DSTV Stream</strong> incluso num único
                plano de {pkg.speed} Mbps
              </p>
              <a
                href={site.hireHref}
                aria-label={`Contratar pacote de ${pkg.speed} Mbps por ${pkg.price}`}
                className={`mt-5 inline-flex min-h-11 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-200 ${
                  pkg.featured
                    ? "border-white bg-white text-ink hover:bg-brand-50"
                    : "border-white/70 text-white hover:bg-white hover:text-ink"
                }`}
              >
                {pkg.price}
              </a>
              <a
                href={site.contactHref}
                className="group mt-4 inline-flex min-h-11 items-center gap-2 self-start text-sm font-medium"
              >
                Ver detalhes
                <span className="sr-only"> do pacote de {pkg.speed} Mbps</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </li>
          ))}
        </ul>
        <CarouselArrows
          tone="dark"
          label="Navegar entre pacotes"
          canPrev={canPrev}
          canNext={canNext}
          onPrev={prev}
          onNext={next}
        />
      </div>
    </section>
  );
}
