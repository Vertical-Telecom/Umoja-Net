"use client";

import Image, { type StaticImageData } from "next/image";
import { useState, type ComponentType, type SVGProps } from "react";
import { internetPlans } from "@/data/plans";
import { site } from "@/lib/site";
import { ArrowRight, Handshake, Heart, Users } from "@/components/icons";
// plano-*.jpg: imagens extraídas dos SVG de planpage/.
import ukambaImage from "../../../public/img/planpage/plano-ukamba.jpg";
import omungaImage from "../../../public/img/planpage/plano-omunga.jpg";
import muigeImage from "../../../public/img/planpage/plano-muige.jpg";

/**
 * Significado de cada nome. O de Ukamba (Amizade) e o texto vêm do protótipo.
 * PENDENTE: confirmar com o cliente "União" (Omunga) e "Família" (Muige) e os textos desses dois.
 */
const details: Record<
  string,
  { image: StaticImageData; alt: string; meaning: string; text: string; icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  ukamba: {
    image: ukambaImage,
    alt: "Três mulheres com lenços amarelos e roxos, de mãos dadas",
    meaning: "Amizade",
    text: "Não importa a distância, estamos sempre ligados, unidos por este sentimento de Amizade.",
    icon: Handshake,
  },
  omunga: {
    image: omungaImage,
    alt: "Dois homens sorridentes a apertar as mãos, com roupas tradicionais",
    meaning: "União",
    text: "A grandeza da nossa união leva-nos além. Juntos chegamos mais longe, ligados por este sentimento de União.",
    icon: Users,
  },
  muige: {
    image: muigeImage,
    alt: "Pai e mãe com o bebé ao colo, em frente a uma casa tradicional",
    meaning: "Família",
    text: "O verdadeiro valor está nos laços que construímos: uma casa cheia, ligada e unida pelo sentimento de Família.",
    icon: Heart,
  },
};

const DURATION = "duration-700";

/**
 * Acordeão horizontal: os 3 planos começam fechados (3 fotos iguais) e um abre ao passar o rato
 * por cima (ou ao receber foco pelo teclado): mostra a foto e o painel com o significado,
 * e os outros encolhem para faixas estreitas. Ao sair do bloco fecham todos.
 * Em ecrãs de toque abre com um toque. No telemóvel empilha na vertical.
 */
export function PlanAccordion() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <ul
      className="mt-20 flex flex-col gap-3 lg:mt-28 lg:h-[560px] lg:flex-row"
      onMouseLeave={() => setActive(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setActive(null);
      }}
    >
      {internetPlans.map((plan, i) => {
        const d = details[plan.id];
        if (!d) return null;
        const on = i === active;
        const idle = active === null;
        const shrunk = !idle && !on;
        const short = plan.name.replace(/^Plano\s+/, "");
        const Icon = d.icon;
        return (
          <li
            key={plan.id}
            onMouseEnter={() => setActive(i)}
            className={`min-w-0 overflow-hidden transition-[flex-grow,flex-basis] ease-[cubic-bezier(0.65,0,0.35,1)] ${DURATION} ${
              shrunk ? "lg:flex-[0_0_96px]" : "lg:flex-[1_1_0%]"
            }`}
          >
            <div
              className={`grid h-full transition-[grid-template-columns] ease-[cubic-bezier(0.65,0,0.35,1)] ${DURATION} ${
                on ? "gap-3 lg:grid-cols-[360px_minmax(0,1fr)]" : "gap-0 lg:grid-cols-[minmax(0,1fr)_0px]"
              }`}
            >
              {/* Foto: abre o plano ao passar o rato (no li), ao receber foco ou com um toque */}
              <button
                type="button"
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-expanded={on}
                aria-controls={`plano-painel-${plan.id}`}
                aria-label={`Ver ${plan.name}`}
                className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-[32px] p-6 text-left text-white transition-[height] ${DURATION} lg:h-full ${
                  on ? "h-80 cursor-default" : idle ? "h-56 cursor-pointer" : "h-24 cursor-pointer"
                }`}
              >
                <Image
                  src={d.image}
                  alt={d.alt}
                  fill
                  sizes="(min-width: 1024px) 430px, 100vw"
                  placeholder="blur"
                  className={`-z-20 object-cover transition-transform ${DURATION} ${on ? "" : "group-hover:scale-105"}`}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-linear-to-t from-[#12002f]/90 via-[#12002f]/25 via-45% to-transparent"
                />
                <span
                  className={`font-display text-[26px] leading-8 font-semibold whitespace-nowrap transition-opacity duration-300 sm:text-[28px] ${
                    shrunk ? "opacity-100 lg:opacity-0" : "opacity-100 delay-200"
                  }`}
                >
                  Plano
                  <br />
                  <span className="text-gradient-accent">{short}</span>
                </span>
              </button>

              {/* Painel com o significado do nome */}
              <div
                id={`plano-painel-${plan.id}`}
                className={`overflow-hidden rounded-3xl bg-surface ${on ? "" : "max-lg:hidden"}`}
                inert={!on}
              >
                <div
                  className={`flex h-full flex-col justify-center p-8 transition-opacity duration-500 sm:p-12 lg:min-w-[420px] ${
                    on ? "opacity-100 delay-300" : "opacity-0"
                  }`}
                >
                  <Icon className="size-12 text-accent-400" />
                  <h3 className="mt-6 max-w-[360px] font-display text-[26px] leading-8 font-semibold text-foundation-purple-900 sm:text-[28px] sm:leading-[34px]">
                    {plan.name}:
                    <br />
                    {short} significa
                    <br />
                    <span className="text-brand-500">{d.meaning}</span>
                  </h3>
                  <p className="mt-4 max-w-[380px] font-display text-base leading-[26px] text-foundation-blue-200 sm:text-lg sm:leading-[28px]">
                    {d.text}
                  </p>
                  <a
                    href={site.hireHref}
                    className="group mt-8 inline-flex h-12 items-center gap-2 self-start rounded-full bg-brand-500 px-6 font-display text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-600"
                  >
                    Adquirir plano
                    <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
