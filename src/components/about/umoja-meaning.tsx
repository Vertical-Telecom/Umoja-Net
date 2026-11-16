"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Handshake, Sprout, Users } from "@/components/icons";

/**
 * "Umoja significa Unidade": 3 separadores; cada um mostra como a palavra se torna ação.
 * PENDENTE: os textos de "conectar" e "crescer junto" são propostas; confirmar com o cliente.
 */
const items = [
  {
    label: "Unidade é estar presente.",
    icon: Handshake,
    text: "E a nossa missão é transformar essa palavra em ação todos os dias, em cada instalação, em cada atendimento e em cada cliente que confia em nós.",
  },
  {
    label: "Unidade é conectar.",
    icon: Users,
    text: "Ligamos casas, escolas e negócios para que ninguém fique de fora. Cada nova ligação aproxima famílias, ideias e oportunidades.",
  },
  {
    label: "Unidade é crescer junto",
    icon: Sprout,
    text: "Crescemos com os bairros que servimos: quando a comunidade avança, a Umoja Net avança com ela.",
  },
] as const;

export function UmojaMeaning() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = items[active];
  const Icon = current.icon;

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (active + keys[e.key] + items.length) % items.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = items.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    /* Frame do design: 1440×722, conteúdo de 1288px (margens de 76px). */
    <section
      aria-labelledby="significado"
      className="bg-surface px-5 py-20 sm:px-8 lg:px-12 lg:pt-[122px] lg:pb-[129px] xl:px-[76px]"
    >
      <div className="mx-auto max-w-[1288px]">
        <div className="mx-auto flex max-w-[864px] flex-col items-center gap-3.5 text-center">
          <h2
            id="significado"
            className="font-display text-[26px] leading-[34px] font-semibold tracking-normal text-foundation-blue-600 sm:text-[36px] sm:leading-[46px]"
          >
            Umoja significa <span className="text-brand-500">Unidade</span>
            <br />
            E é essa palavra que <span className="text-brand-500">guia tudo o que fazemos.</span>
          </h2>
          <p className="max-w-[761px] font-display text-lg leading-[28px] font-normal text-foundation-blue-200 sm:text-[22px] sm:leading-[30px]">
            Escolhemos um nome africano porque acreditamos na nossa identidade, na nossa cultura e no poder da união.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:mt-20 lg:grid-cols-[329px_minmax(0,1fr)]">
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="O que é a unidade"
            className="flex flex-col gap-3 lg:gap-[18px]"
          >
            {items.map((item, i) => {
              const on = i === active;
              return (
                <button
                  key={item.label}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  id={`unidade-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="unidade-painel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onKeyDown}
                  className={`min-h-[63px] cursor-pointer rounded-xl bg-white px-4 py-4 text-left font-display text-lg leading-[30px] font-medium text-foundation-purple-900 transition-all duration-200 ${
                    on ? "shadow-lg ring-1 shadow-brand-500/10 ring-brand-300" : "hover:ring-1 hover:ring-brand-200"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div
            id="unidade-painel"
            role="tabpanel"
            aria-labelledby={`unidade-tab-${active}`}
            className="flex flex-col items-start gap-6 rounded-3xl bg-white p-6 sm:flex-row sm:items-center sm:gap-[52px] sm:p-12"
          >
            <span className="grid size-24 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-500 sm:size-[127px]">
              <Icon className="size-14 sm:size-20" />
            </span>
            <p
              key={active}
              className="max-w-[574px] animate-fade-up font-display text-base leading-[28px] font-normal text-foundation-purple-900 sm:text-lg sm:leading-[30px]"
            >
              {current.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
