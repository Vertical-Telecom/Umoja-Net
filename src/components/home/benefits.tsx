"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import { site } from "@/lib/site";
import { ArrowUp, BadgeCheck, Check, Download, Headphones, Rocket, Spinner, User } from "@/components/icons";
import cardImage from "../../../public/img/beneficios/card.jpg";

/**
 * "Tudo o que espera de uma boa internet": os 3 benefícios contados como um fluxo
 * (pedido do cliente → Download Ilimitado → Velocidade Real → Suporte Atento),
 * ligados por uma linha, ao estilo da referência enviada.
 */

const downloadItems = [
  "Sem limite de dados",
  "Streaming e séries",
  "Videochamadas",
  "Jogos online",
  "Downloads pesados",
];

const speedItems = [
  { plan: "Ukamba · 6 Mbps", detail: "Uso individual, redes sociais e navegação" },
  { plan: "Omunga · 8 Mbps", detail: "Casa partilhada e teletrabalho" },
  { plan: "Muige · 10 Mbps", detail: "Vários dispositivos e streaming HD" },
];

/** Passos da animação (intervalo de STEP_MS): chips → destaque do plano → cartão. */
const STEP_MS = 420;
const CHIPS_DONE = downloadItems.length;
const HIGHLIGHT_START = CHIPS_DONE + 1;
const TOTAL_STEPS = HIGHLIGHT_START + speedItems.length;

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

function Pill({ icon: Icon, children, as: Tag = "p" }: { icon: Icon; children: string; as?: "p" | "h3" }) {
  return (
    <Tag className="relative z-10 inline-flex h-7 items-center gap-1.5 rounded-full border border-line bg-white px-3 font-mono text-[11px] font-medium tracking-wider text-ink uppercase shadow-sm">
      <Icon className="size-3.5 text-brand-600" />
      {children}
    </Tag>
  );
}

function useInViewOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

export function Benefits() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setStep(TOTAL_STEPS), 0);
      return () => window.clearTimeout(id);
    }
    const id = window.setInterval(() => {
      setStep((s) => {
        if (s >= TOTAL_STEPS) {
          window.clearInterval(id);
          return s;
        }
        return s + 1;
      });
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [inView]);

  const checked = Math.min(step, CHIPS_DONE);
  const highlight = step >= HIGHLIGHT_START ? Math.min(step - HIGHLIGHT_START, speedItems.length - 1) : -1;
  const cardVisible = step >= TOTAL_STEPS;

  return (
    <section aria-labelledby="beneficios-titulo" className="mx-auto max-w-6xl px-5 pt-20 sm:px-8 sm:pt-24">
      <div
        ref={ref}
        className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-[240px_minmax(0,1fr)_minmax(0,1fr)_300px] lg:gap-8"
      >
        {/*
          Linha de ligação (desktop): passa pelo 1.º selo, desce depois da 1.ª coluna
          e segue pelos restantes selos. Desenha-se quando a secção entra no ecrã.
        */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 hidden h-[86px] lg:block">
          <span
            className="absolute top-[13px] left-0 h-[37px] w-[257px] rounded-tr-[28px] border-t-2 border-r-2 border-brand-500 transition-[clip-path] duration-700 ease-out"
            style={{ clipPath: inView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
          />
          <span
            className="absolute top-[48px] right-0 left-[255px] h-[37px] rounded-bl-[28px] border-b-2 border-l-2 border-brand-500 transition-[clip-path] delay-500 duration-1000 ease-out"
            style={{ clipPath: inView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
          />
        </div>

        {/* 1. Benefícios: título da secção */}
        <div className="flex flex-col items-start gap-5">
          <Pill icon={BadgeCheck}>Benefícios</Pill>
          <div className="relative w-full rounded-2xl bg-white p-5 pb-14 shadow-xl ring-1 shadow-brand-500/10 ring-line">
            <h2 id="beneficios-titulo" className="text-lg leading-snug font-semibold text-ink">
              Tudo o que espera de uma boa internet, e mais.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Porque qualidade, velocidade e estabilidade fazem diferença no seu dia.
            </p>
            <span
              aria-hidden="true"
              className="absolute right-4 bottom-4 grid size-8 place-items-center rounded-lg bg-brand-600 text-white"
            >
              <ArrowUp className="size-4" />
            </span>
          </div>
        </div>

        {/* 2. Download Ilimitado */}
        <div className="flex flex-col items-start gap-5 lg:pt-[72px]">
          <Pill as="h3" icon={Download}>
            Download Ilimitado
          </Pill>
          <p className="sr-only">Assista, trabalhe, jogue e navegue sem limites.</p>
          <ul className="flex flex-col items-start gap-2.5">
            {downloadItems.map((item, i) => {
              const done = i < checked;
              return (
                <li
                  key={item}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] tracking-wider uppercase transition-colors duration-300 ${
                    done ? "border-brand-200 bg-brand-50 text-ink" : "border-line text-muted/70"
                  }`}
                >
                  {done ? (
                    <Check className="size-3.5 text-brand-600" />
                  ) : (
                    <Spinner className="size-3.5 animate-spin text-brand-300" />
                  )}
                  {item}
                  <span className="sr-only">{done ? " (incluído)" : ""}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 3. Velocidade Real */}
        <div className="flex flex-col items-start gap-5 lg:pt-[72px]">
          <Pill as="h3" icon={Rocket}>
            Velocidade Real
          </Pill>
          <p className="sr-only">Planos que entregam exatamente a velocidade que você contrata.</p>
          <ul className="flex flex-col gap-5">
            {speedItems.map((item, i) => {
              const on = i === highlight;
              return (
                <li
                  key={item.plan}
                  className={`flex gap-2.5 font-mono text-[12px] leading-relaxed tracking-wide uppercase transition-colors duration-300 ${
                    on ? "text-ink" : "text-muted/70"
                  }`}
                >
                  <User className={`mt-0.5 size-3.5 shrink-0 ${on ? "text-brand-600" : "text-muted/50"}`} />
                  <span>
                    <span className="block font-semibold">{item.plan}</span>
                    {item.detail}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 4. Suporte Atento: cartão com imagem desfocada */}
        <div className="flex flex-col items-start gap-5 lg:pt-[72px]">
          <Pill as="h3" icon={Headphones}>
            Suporte Atento
          </Pill>
          <article
            className={`relative isolate flex min-h-[340px] w-full flex-col justify-end overflow-hidden rounded-3xl p-5 text-white shadow-2xl shadow-brand-950/30 transition-all duration-700 ease-out ${
              cardVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <Image
              src={cardImage}
              alt=""
              fill
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
              placeholder="blur"
              className="-z-20 object-cover"
            />
            {/* Desfoque em degradê: nítido em cima, ligeiramente desfocado em baixo (onde está o texto). */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 backdrop-blur-[2px]"
              style={{
                maskImage: "linear-gradient(to bottom, transparent 15%, black 75%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 15%, black 75%)",
              }}
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-brand-950/90 via-brand-950/40 to-brand-950/10" />
            <p className="text-2xl leading-tight font-semibold">Suporte sempre presente</p>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              Atendimento rápido, claro e disponível quando você mais precisa.
            </p>
            <a
              href={site.contactHref}
              className="mt-4 inline-flex min-h-11 items-center self-start rounded-xl border border-white/20 bg-white/15 px-4 text-sm font-medium backdrop-blur-md transition-colors duration-200 hover:bg-white/25"
            >
              Fale connosco
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
