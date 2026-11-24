"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import { site } from "@/lib/site";
import { internetPlans } from "@/data/plans";
import { ArrowRight, BookOpen, Cast, Check, Download, Gauge, Headphones, Rocket, Users } from "@/components/icons";
import logoMark from "../../../public/img/homepage/home/logo.svg";
import logoHorizontal from "../../../public/img/homepage/home/Logo Horizontal.svg";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/** Plano mais rápido dos 3 principais (para a ilustração de "Velocidade Real"). */
const fastest = internetPlans.find((p) => p.id === "muige") ?? internetPlans[0];

/** Etiquetas dos lados (como as integrações do vídeo): o que a internet da Umoja liga. */
const leftTags: { icon: Icon; label: string }[] = [
  { icon: Cast, label: "Streaming e séries" },
  { icon: Users, label: "Videochamadas" },
];
const rightTags: { icon: Icon; label: string }[] = [
  { icon: Rocket, label: "Jogos online" },
  { icon: BookOpen, label: "Teletrabalho e estudos" },
];

/** Deteta quando a secção entra no ecrã (para a animação de entrada). */
function useInViewOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(id);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

/** Classes de "aparecer" com atraso (fade + subida). */
const reveal = (on: boolean, delay: string) =>
  `transition-all duration-700 ease-out ${delay} ${on ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`;

function Tag({ icon: Icon, label }: { icon: Icon; label: string }) {
  return (
    <li className="inline-flex h-14 items-center gap-2.5 rounded-xl border-2 border-white bg-[#f3f2f7] px-5 font-display text-base font-semibold text-foundation-purple-900 shadow-[0_8px_24px_rgb(23_7_51/0.08)]">
      <Icon className="size-5 text-brand-950" />
      {label}
    </li>
  );
}

/** Pílula escura com o logo e o anel de luz em órbita (o centro do vídeo). */
function LogoPill({ big }: { big: boolean }) {
  return (
    <div
      className={`relative z-10 mx-auto w-max transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        big ? "scale-[1.9]" : "scale-100"
      }`}
    >
      <div aria-hidden="true" className="absolute inset-x-6 -bottom-8 h-14 rounded-full bg-brand-950/25 blur-2xl" />
      <div className="relative inline-flex items-center rounded-full bg-linear-to-b from-[#2d2733] to-[#0e0a13] py-4 pr-9 pl-6 shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_18px_40px_-12px_rgb(23_7_51/0.55)]">
        {/* Logótipo oficial (horizontal) */}
        <Image src={logoHorizontal} alt="Umoja Net" unoptimized className="h-11 w-auto" />
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 400 140"
        className="pointer-events-none absolute top-1/2 left-1/2 w-[340px] -translate-x-1/2 -translate-y-1/2 -rotate-12"
        fill="none"
      >
        <defs>
          <linearGradient id="orbita-brilho" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#b4a3ff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#d5cbff" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
          <filter id="orbita-glow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse cx="200" cy="70" rx="185" ry="48" stroke="#170733" strokeOpacity="0.3" strokeWidth="1.2" />
        <ellipse
          cx="200"
          cy="70"
          rx="185"
          ry="48"
          pathLength={100}
          stroke="url(#orbita-brilho)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="18 82"
          filter="url(#orbita-glow)"
          className="motion-safe:animate-orbit"
        />
        {[
          [70, 108, 1.6],
          [84, 116, 1.1],
          [98, 112, 1.4],
          [60, 120, 1],
          [112, 120, 0.9],
        ].map(([cx, cy, r], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="#170733"
            className="motion-safe:animate-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

/** Painel branco das ilustrações. */
function Panel({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-xl bg-white p-4 shadow-[0_12px_32px_rgb(23_7_51/0.12)] ${className}`}>{children}</div>;
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-50">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function BenefitCard({
  icon: Icon,
  title,
  titleId,
  text,
  children,
  className = "",
}: {
  icon: Icon;
  title: string;
  titleId: string;
  text: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      aria-labelledby={titleId}
      className={`benefit-card relative flex min-h-[420px] flex-col overflow-hidden rounded-3xl border-2 border-white bg-[#f3f2f7] shadow-[0_8px_30px_rgb(23_7_51/0.06)] ${className}`}
    >
      <div className="p-6 sm:p-7">
        <h3 id={titleId} className="flex items-center gap-2.5 type-h3 text-foundation-purple-900">
          <Icon className="size-5 text-brand-950" />
          {title}
        </h3>
        <p className="mt-2 max-w-[340px] type-body text-muted">{text}</p>
      </div>
      <div aria-hidden="true" className="relative mt-auto h-60 overflow-hidden px-6 sm:px-7">
        {children}
      </div>
    </article>
  );
}

/**
 * "Benefícios" ao estilo do vídeo de referência: título centrado, pílula com o logo e o anel de luz,
 * etiquetas dos lados ligadas por linhas, e uma árvore de linhas até 3 cartões com mini-interfaces.
 * Ao entrar no ecrã, a pílula começa grande e encolhe para o lugar; depois aparecem linhas, etiquetas e cartões.
 */
export function Benefits() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const line = `transition-opacity duration-700 ease-out ${inView ? "opacity-100" : "opacity-0"}`;

  return (
    <section aria-labelledby="beneficios-titulo" className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 xl:px-[76px]">
      <div ref={ref}>
        {/* Título */}
        <div className={`mx-auto max-w-3xl text-center ${reveal(inView, "delay-300")}`}>
          <h2
            id="beneficios-titulo"
            className="type-h2 text-foundation-blue-600"
          >
            Tudo o que espera de uma <span className="text-gradient-accent">boa internet</span>,{" "}
            <span className="text-gradient-accent">e mais.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl type-subtitle text-foundation-blue-200">
            Porque qualidade, velocidade e estabilidade fazem diferença no seu dia.
          </p>
        </div>

        {/* Pílula + etiquetas ligadas por linhas (desktop) */}
        <div className="relative mt-14 hidden grid-cols-[1fr_auto_1fr] items-center lg:grid">
          <div className="flex items-center justify-end">
            <ul className={`flex flex-col items-end gap-6 ${reveal(inView, "delay-[900ms]")}`}>
              {leftTags.map((t) => (
                <Tag key={t.label} {...t} />
              ))}
            </ul>
            <div aria-hidden="true" className={`flex items-center delay-700 ${line}`}>
              <div className="h-20 w-10 rounded-r-2xl border-y-2 border-r-2 border-brand-950" />
              <div className="h-0.5 w-16 bg-brand-950" />
            </div>
          </div>
          <div className="px-2">
            <LogoPill big={!inView} />
          </div>
          <div className="flex items-center">
            <div aria-hidden="true" className={`flex items-center delay-700 ${line}`}>
              <div className="h-0.5 w-16 bg-brand-950" />
              <div className="h-20 w-10 rounded-l-2xl border-y-2 border-l-2 border-brand-950" />
            </div>
            <ul className={`flex flex-col items-start gap-6 ${reveal(inView, "delay-[900ms]")}`}>
              {rightTags.map((t) => (
                <Tag key={t.label} {...t} />
              ))}
            </ul>
          </div>
        </div>

        {/* Pílula + etiquetas (telemóvel e tablet) */}
        <div className="mt-12 flex flex-col items-center gap-8 lg:hidden">
          <LogoPill big={false} />
          <ul className={`flex flex-wrap justify-center gap-3 ${reveal(inView, "delay-500")}`}>
            {[...leftTags, ...rightTags].map((t) => (
              <Tag key={t.label} {...t} />
            ))}
          </ul>
        </div>

        {/* Árvore de linhas da pílula até aos 3 cartões (desktop) */}
        <div aria-hidden="true" className={`hidden lg:block delay-1000 ${line}`}>
          <div className="mx-auto h-12 w-0.5 bg-brand-950" />
          <div className="relative mx-[16.66%] h-10 rounded-t-2xl border-x-2 border-t-2 border-brand-950">
            <div className="absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2 bg-brand-950" />
          </div>
        </div>

        {/* 3 cartões (escondidos no telemóvel) */}
        <div className="mt-10 grid gap-5 max-md:hidden lg:mt-0 lg:grid-cols-3">
          <BenefitCard
            className={reveal(inView, "delay-[1100ms]")}
            icon={Gauge}
            title="Velocidade Real"
            titleId="beneficio-velocidade"
            text="Planos que entregam exatamente a velocidade que você contrata."
          >
            <Panel className="absolute top-6 right-12 left-6 sm:left-7">
              <p className="text-xs font-semibold text-foundation-purple-900">{fastest.name}</p>
              <div className="mt-3 space-y-3 text-[11px] text-muted">
                <div>
                  <div className="mb-1 flex justify-between">
                    <span>Download</span>
                    <span className="font-semibold text-ink">{fastest.download} Mbps</span>
                  </div>
                  <Bar value={100} color="bg-brand-950" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between">
                    <span>Upload</span>
                    <span className="font-semibold text-ink">{fastest.upload} Mbps</span>
                  </div>
                  <Bar value={100} color="bg-accent-500" />
                </div>
              </div>
            </Panel>
            <Panel className="absolute right-6 bottom-6 w-[170px]">
              <p className="text-[11px] text-muted">Velocidade atual</p>
              <p className="mt-1 font-display text-4xl font-semibold text-foundation-purple-900">
                {fastest.download}
                <span className="ml-1 text-base font-medium text-muted">Mbps</span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-success">
                <Check className="size-3" /> Igual à contratada
              </p>
            </Panel>
          </BenefitCard>

          <BenefitCard
            className={reveal(inView, "delay-[1250ms]")}
            icon={Download}
            title="Download Ilimitado"
            titleId="beneficio-download"
            text="Assista, trabalhe, jogue e navegue sem limites de dados."
          >
            <Panel className="absolute top-6 right-6 left-6 sm:left-7">
              <p className="text-xs font-semibold text-foundation-purple-900">Utilização deste mês</p>
              <ul className="mt-3 space-y-2.5 text-[11px] text-muted">
                {(
                  [
                    ["Streaming HD", 85, "bg-brand-950"],
                    ["Videochamadas", 60, "bg-accent-500"],
                    ["Jogos online", 45, "bg-brand-950"],
                  ] as const
                ).map(([label, v, c]) => (
                  <li key={label}>
                    <div className="mb-1 flex justify-between">
                      <span>{label}</span>
                      <Check className="size-3 text-success" />
                    </div>
                    <Bar value={v} color={c} />
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel className="absolute bottom-6 left-1/2 w-[200px] -translate-x-1/2 text-center">
              <p className="text-[11px] text-muted">Dados disponíveis</p>
              <p className="font-display text-4xl leading-tight font-semibold text-brand-950">∞</p>
              <p className="text-[11px] font-medium text-foundation-purple-900">Sem limite de dados</p>
            </Panel>
          </BenefitCard>

          <BenefitCard
            className={reveal(inView, "delay-[1400ms]")}
            icon={Headphones}
            title="Suporte Atento"
            titleId="beneficio-suporte"
            text={
              <>
                Atendimento rápido, claro e disponível quando você mais precisa.{" "}
                <a
                  href={site.contactHref}
                  className="inline-flex items-center gap-1 font-semibold text-brand-950 hover:text-brand-950"
                >
                  Fale connosco <ArrowRight className="size-3.5" />
                </a>
              </>
            }
          >
            <Panel className="absolute top-6 right-6 left-6 space-y-2.5 text-[11px] sm:left-7">
              <div className="flex items-start gap-2">
                <Image src={logoMark} alt="" unoptimized className="size-6 shrink-0" />
                <p className="rounded-xl rounded-tl-sm bg-brand-50 px-3 py-2 text-foundation-purple-900">
                  Olá! Em que podemos ajudar?
                </p>
              </div>
              <p className="ml-auto w-max rounded-xl rounded-tr-sm bg-brand-950 px-3 py-2 text-white">
                A internet ficou lenta.
              </p>
              <div className="flex items-start gap-2">
                <Image src={logoMark} alt="" unoptimized className="size-6 shrink-0" />
                <p className="rounded-xl rounded-tl-sm bg-brand-50 px-3 py-2 text-foundation-purple-900">
                  Já estamos a verificar a sua ligação.
                </p>
              </div>
            </Panel>
            <Panel className="absolute right-6 bottom-6 flex items-center gap-2 py-3">
              <span className="grid size-6 place-items-center rounded-full bg-success text-white">
                <Check className="size-3.5" />
              </span>
              <span className="text-xs font-semibold text-foundation-purple-900">Pedido resolvido</span>
            </Panel>
          </BenefitCard>
        </div>
      </div>
    </section>
  );
}
