"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { Close } from "@/components/icons";
import m01 from "../../../public/img/homepage/moral/WhatsApp Image 2026-11-12 at 11.48.27 (1).jpeg";
import m02 from "../../../public/img/homepage/moral/WhatsApp Image 2026-11-12 at 11.48.27.jpeg";
import m03 from "../../../public/img/homepage/moral/WhatsApp Image 2026-11-12 at 11.48.28 (1).jpeg";
import m04 from "../../../public/img/homepage/moral/WhatsApp Image 2026-11-12 at 11.48.28 (2).jpeg";
import m05 from "../../../public/img/homepage/moral/WhatsApp Image 2026-11-12 at 11.48.28 (3).jpeg";
import m06 from "../../../public/img/homepage/moral/WhatsApp Image 2026-11-12 at 11.48.28 (4).jpeg";
import m07 from "../../../public/img/homepage/moral/WhatsApp Image 2026-11-12 at 11.48.28.jpeg";
import m08 from "../../../public/img/homepage/moral/WhatsApp Image 2026-11-12 at 11.48.29 (1).jpeg";
import m09 from "../../../public/img/homepage/moral/WhatsApp Image 2026-11-12 at 11.48.29 (2).jpeg";
import m10 from "../../../public/img/homepage/moral/WhatsApp Image 2026-11-12 at 11.48.29 (3).jpeg";
import m11 from "../../../public/img/homepage/moral/WhatsApp Image 2026-11-12 at 11.48.29 (4).jpeg";
import m12 from "../../../public/img/homepage/moral/WhatsApp Image 2026-11-12 at 11.48.29.jpeg";

type Photo = { src: StaticImageData; alt: string };

const photos: Photo[] = [
  { src: m01, alt: "Técnico da Umoja Net a trabalhar num bastidor de equipamentos de rede" },
  { src: m02, alt: "Técnicos da Umoja Net junto a um bastidor de rede" },
  { src: m03, alt: "Equipa reunida ao ar livre com portáteis" },
  { src: m04, alt: "Técnico num terraço com cabos e antenas" },
  { src: m05, alt: "Técnicos a subir uma torre de telecomunicações" },
  { src: m06, alt: "Técnico no topo de uma torre a instalar uma antena" },
  { src: m07, alt: "Equipa a planear o trabalho com portáteis" },
  { src: m08, alt: "Dois técnicos no terreno" },
  { src: m09, alt: "Dois técnicos sorridentes ao fim do dia" },
  { src: m10, alt: "Técnico com capacete a preparar equipamento" },
  { src: m11, alt: "Técnico a trabalhar no alto de um poste" },
  { src: m12, alt: "Técnicos a instalar equipamento num edifício" },
];

/**
 * 4 colunas de 3 fotos. Cada coluna sobe sem parar (escada rolante) a uma velocidade diferente;
 * a lista é repetida 2× para o ciclo não ter salto.
 */
const columns: { photos: number[]; heights: string[]; duration: number }[] = [
  { photos: [0, 4, 8], heights: ["h-36", "h-44", "h-40"], duration: 34 },
  { photos: [1, 5, 9], heights: ["h-44", "h-36", "h-40"], duration: 28 },
  { photos: [2, 6, 10], heights: ["h-40", "h-44", "h-36"], duration: 38 },
  { photos: [3, 7, 11], heights: ["h-36", "h-40", "h-44"], duration: 31 },
];

/**
 * "Mural": fotos da equipa em molduras inclinadas (ângulo da referência) que sobem como uma escada rolante;
 * as de cima desaparecem e as outras continuam a subir.
 * - Rato por cima de uma coluna: só essa coluna pára.
 * - Clique numa foto: abre-a em grande, direita e por cima da página; fecha com o botão, clique fora ou Esc.
 */
export function TeamMural() {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open === null) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      lastFocus.current?.focus();
    };
  }, [open]);

  const current = open !== null ? photos[open] : null;

  return (
    <section aria-labelledby="mural-titulo" className="relative overflow-hidden bg-brand-950">
      {/* Continuidade com o logo da secção de cima: o topo começa exatamente na cor do logo na linha de corte
          (tokens logo-cut-md/lg em globals.css) e escurece até ao fundo. Sem logo no telemóvel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-logo-cut-md to-transparent max-md:hidden lg:from-logo-cut-lg"
      />
      <div className="mx-auto grid max-w-[1440px] items-center gap-6 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-10 lg:px-12 xl:px-[76px]">
        {/* Texto, alinhado ao centro do mural */}
        <div className="relative z-10">
          <h2
            id="mural-titulo"
            className="type-h2 text-white"
          >
            Quem faz a sua <span className="text-gradient-accent">internet</span> acontecer
          </h2>
          <p className="mt-4 max-w-[400px] type-body text-white/80">
            Por trás de cada ligação há uma equipa no terreno: nas torres, nas instalações e no apoio a cada cliente.
          </p>
        </div>

        {/* Mural: as fotos desaparecem no topo e no fundo (máscara) enquanto sobem */}
        <div
          className="relative h-[420px] sm:h-[520px]"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 16%, black 84%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 16%, black 84%, transparent)",
          }}
        >
          <div
            className="absolute top-1/2 left-1/2 grid w-[620px] grid-cols-4 gap-3 sm:w-[720px]"
            style={{ transform: "translate(-50%, -50%) perspective(2400px) rotateX(22deg) rotateZ(-15deg)" }}
          >
            {columns.map((col, c) => {
              const hasOpen = open !== null;
              return (
                <div key={c} className="relative">
                  <ul
                    className="flex flex-col motion-safe:animate-mural-up hover:[animation-play-state:paused]"
                    style={{
                      animationDuration: `${col.duration}s`,
                      // Com uma foto aberta, o mural fica parado até a fechar.
                      ...(hasOpen ? { animationPlayState: "paused" } : {}),
                    }}
                  >
                    {[0, 1].map((copy) =>
                      col.photos.map((index, r) => {
                        const photo = photos[index];
                        const duplicate = copy === 1;
                        return (
                          <li key={`${copy}-${index}`} className="pb-3" aria-hidden={duplicate || undefined}>
                            <button
                              type="button"
                              data-mural-card
                              tabIndex={duplicate ? -1 : 0}
                              aria-haspopup="dialog"
                              aria-label={duplicate ? undefined : `Abrir foto: ${photo.alt}`}
                              onClick={() => setOpen(index)}
                              className={`relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border-[3px] border-white bg-surface shadow-lg shadow-brand-950/20 transition-transform duration-300 ease-out hover:scale-[1.04] ${
                                col.heights[r]
                              }`}
                            >
                              <Image
                                src={photo.src}
                                alt={duplicate ? "" : photo.alt}
                                fill
                                sizes="(min-width: 640px) 240px, 200px"
                                placeholder="blur"
                                className="object-cover"
                              />
                            </button>
                          </li>
                        );
                      }),
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Foto aberta em grande */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[100] flex animate-fade-up items-center justify-center bg-brand-950/80 p-4 backdrop-blur-sm sm:p-10"
          onClick={() => setOpen(null)}
        >
          <figure
            className="relative flex max-h-full max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.src}
              alt={current.alt}
              sizes="(min-width: 1024px) 1024px, 100vw"
              placeholder="blur"
              className="h-auto max-h-[80svh] w-auto max-w-full rounded-3xl border-4 border-white object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-center text-sm text-white/85">{current.alt}</figcaption>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Fechar foto"
              className="absolute -top-3 -right-3 grid size-11 cursor-pointer place-items-center rounded-full bg-white text-ink shadow-lg transition-colors hover:bg-brand-50"
            >
              <Close className="size-5" />
            </button>
          </figure>
        </div>
      )}
    </section>
  );
}
