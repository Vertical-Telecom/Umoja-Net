import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import { BookOpen, Users } from "@/components/icons";
// cta.jpg: imagem extraída de aboutpage/cta.svg.
import impactImage from "../../../public/img/aboutpage/cta.jpg";

function Chip({
  icon: Icon,
  title,
  text,
  className = "",
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  text: string;
  className?: string;
}) {
  return (
    <li
      className={`flex w-max items-center gap-3 rounded-2xl border border-white/20 bg-white/10 py-3 pr-5 pl-4 backdrop-blur-md ${className}`}
    >
      <Icon className="size-6 shrink-0 text-foundation-purple-50" />
      <p className="text-sm leading-tight">
        <strong className="block font-semibold">{title}</strong>
        <span className="text-white/80">{text}</span>
      </p>
    </li>
  );
}

/** "Tecnologia com impacto real": cartão com imagem, antes do rodapé. */
export function Impact() {
  return (
    <section aria-labelledby="impacto" className="mx-auto max-w-[1336px] px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="relative isolate flex min-h-[520px] flex-col overflow-hidden rounded-[32px] bg-brand-950 px-6 pt-12 pb-6 text-white sm:px-10 sm:pt-16 md:aspect-[1288/818] md:min-h-0">
        <Image
          src={impactImage}
          alt="Homem sorridente a usar o telemóvel à noite, com luzes da cidade ao fundo"
          fill
          sizes="(min-width: 1336px) 1288px, 100vw"
          placeholder="blur"
          className="-z-20 object-cover"
        />
        {/* Escurece o topo, onde está o texto (degradê do cta.svg) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ background: "linear-gradient(to top, transparent 45%, rgb(2 0 15 / 0.55) 70%)" }}
        />
        {/* No telemóvel o texto ocupa mais altura: reforça o contraste */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#02000f]/45 md:hidden" />

        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="impacto"
            className="font-display text-[28px] leading-[36px] font-semibold tracking-[-0.5px] sm:text-[36px] sm:leading-[44px]"
          >
            Tecnologia com impacto real
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
            Acreditamos na inclusão digital como uma ferramenta de transformação. Cada bairro que conectamos é uma nova
            oportunidade de acesso ao conhecimento, ao trabalho, ao entretenimento e ao crescimento económico.
          </p>
        </div>

        <ul className="mt-auto flex flex-col gap-3 md:contents">
          <Chip
            icon={BookOpen}
            title="Mais acesso"
            text="ao conhecimento"
            className="md:absolute md:top-[69%] md:left-[24%]"
          />
          <Chip
            icon={Users}
            title="Inclusão digital"
            text="nas comunidades"
            className="md:absolute md:top-[80%] md:left-[56%]"
          />
        </ul>
      </div>
    </section>
  );
}
