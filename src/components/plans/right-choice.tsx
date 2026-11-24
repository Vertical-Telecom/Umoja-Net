import Image from "next/image";
import { Check } from "@/components/icons";
// cta.jpg: imagem extraída de planpage/Rectangle 650.svg.
import ctaImage from "../../../public/img/planpage/cta.jpg";

const highlights = ["Velocidade real", "Sem limites de dados", "Suporte rápido", "Instalação eficiente"];

/** "A escolha certa para quem não quer perder tempo com internet lenta." (antes do rodapé) */
export function RightChoice() {
  return (
    <section
      aria-labelledby="escolha-certa"
      className="relative isolate flex min-h-[max(560px,min(872px,100svh))] overflow-hidden bg-brand-950 text-white"
    >
      <Image
        src={ctaImage}
        alt="Mulher sorridente a usar o portátil no sofá"
        fill
        sizes="100vw"
        className="-z-20 object-cover"
        style={{ objectPosition: "70% center" }}
      />
      {/* Imagem sem escurecimento nem desfoque, como no design. */}

      <div className="relative mx-auto flex w-full flex-col justify-center px-5 py-20 sm:px-8 lg:px-12 xl:px-[76px]">
        <h2
          id="escolha-certa"
          className="max-w-[660px] type-h2"
        >
          A escolha certa para quem não quer <br className="hidden lg:block" />
          perder tempo com internet lenta.
        </h2>
        <p className="mt-6 max-w-[560px] type-body text-white">
          Os nossos planos foram pensados para entregar exatamente o que você precisa: velocidade estável, download
          ilimitado e uma experiência fluida em todos os dispositivos.
        </p>
        {/* Selos (design): 72px de altura, raio 8, padding 24, gap 10, fundo #F5F7F9; ícone 24×24 laranja. */}
        <ul className="mt-12 flex flex-wrap gap-4 lg:mt-20">
          {highlights.map((h) => (
            <li key={h} className="inline-flex h-[72px] items-center gap-2.5 rounded-lg bg-[#f5f7f9] p-6">
              <span className="grid size-6 shrink-0 place-items-center rounded-md border border-accent-400 text-accent-400">
                <Check className="size-3.5" />
              </span>
              <span aria-hidden="true" className="h-3 w-px bg-foundation-blue-200/60" />
              <span className="font-display text-base leading-3 text-foundation-blue-200">{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
