"use client";

import Image from "next/image";
import { internetPlans, tvPackages } from "@/data/plans";
import { site } from "@/lib/site";
import { CarouselArrows, useScrollCarousel } from "@/components/carousel";
import { ArrowRight, Check } from "@/components/icons";
import dstvStreamLogo from "../../../public/img/homepage/home/logo_dstv_stream.svg";

/**
 * Pacotes Internet + TV (DSTV Stream) no separador "Internet+TV": cartões brancos como os planos,
 * 3 visíveis em desktop; as setas mostram os restantes.
 */
export function TvPackages() {
  const { ref: trackRef, canPrev, canNext, prev, next } = useScrollCarousel<HTMLUListElement>();

  return (
    <>
      <ul
        ref={trackRef}
        className="scrollbar-none relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pt-2 pb-6 sm:mx-0 sm:scroll-px-0 sm:px-0"
      >
        {tvPackages.map((pkg) => {
          const upload = pkg.upload ?? internetPlans.find((p) => p.download === pkg.speed)?.upload;
          const benefits = [
            `Download de ${pkg.speed} Mbps`,
            ...(upload ? [`Upload de ${upload} Mbps`] : []),
            "Download Ilimitado",
            "Internet por fibra óptica",
          ];
          return (
            <li
              key={pkg.id}
              className={`flex w-[85%] shrink-0 snap-start flex-col rounded-3xl border bg-white transition-shadow duration-300 sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] ${
                pkg.featured ? "border-brand-950 shadow-xl shadow-brand-950/10" : "border-line hover:shadow-lg hover:shadow-brand-950/5"
              }`}
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-xl font-semibold text-foundation-purple-900">{pkg.name}</h3>
                  <Image src={dstvStreamLogo} alt="DSTV Stream" unoptimized className="h-4 w-auto shrink-0" />
                </div>
                <p className="mt-8 font-display text-5xl font-semibold tracking-tight text-foundation-purple-900 sm:text-[56px]">
                  {pkg.speed} Mbps
                </p>
                <p className="mt-6 max-w-[300px] text-[15px] leading-relaxed text-muted">
                  {pkg.name} da <strong className="font-semibold text-foundation-purple-900">DSTV Stream</strong>{" "}
                  incluso num único plano de{" "}
                  <strong className="font-semibold text-foundation-purple-900">{pkg.speed} Mbps</strong>
                </p>
                <a
                  href={site.hireHref}
                  aria-label={`Contratar ${pkg.name} de ${pkg.speed} Mbps por ${pkg.price}`}
                  className={`group mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full border font-display text-base font-semibold transition-all duration-200 ${
                    pkg.featured
                      ? "border-brand-950 bg-brand-950 text-white hover:bg-brand-900"
                      : "border-brand-950 text-foundation-purple-900 hover:border-brand-950 hover:bg-brand-950 hover:text-white"
                  }`}
                >
                  {pkg.price}
                  <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </div>

              <div className="border-t border-line p-6 sm:px-8 sm:pt-8 sm:pb-9">
                <p className="font-display font-medium text-foundation-purple-900">Benefícios incluídos</p>
                <ul className="mt-6 space-y-4">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-[15px] text-muted">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-950 text-white">
                        <Check className="size-3" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
      <CarouselArrows
        label="Navegar entre pacotes"
        canPrev={canPrev}
        canNext={canNext}
        onPrev={prev}
        onNext={next}
      />
    </>
  );
}
