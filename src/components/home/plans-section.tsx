"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { internetPlans, internetTvPlans, type Plan } from "@/data/plans";
import { site } from "@/lib/site";
import { CarouselArrows, useScrollCarousel } from "@/components/carousel";
import { ArrowRight, Check } from "@/components/icons";

const tabs = [
  { id: "simples", label: "Internet Simples", plans: internetPlans },
  { id: "tv", label: "Internet+TV", plans: internetTvPlans },
] as const;

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article
      aria-labelledby={`plano-${plan.id}`}
      className={`flex w-[85%] shrink-0 snap-start flex-col rounded-3xl border bg-white p-6 transition-shadow duration-300 sm:w-[calc((100%-1.25rem)/2)] sm:p-7 lg:w-[calc((100%-2.5rem)/3)] ${
        plan.featured ? "border-brand-200 shadow-xl shadow-brand-500/10" : "border-line hover:shadow-lg hover:shadow-brand-500/5"
      }`}
    >
      <h3 id={`plano-${plan.id}`} className="text-lg font-semibold">
        {plan.name}
      </h3>
      <p className="mt-1 min-h-10 max-w-60 text-sm leading-snug text-muted">{plan.tagline}</p>

      <dl className="mt-6 border-b border-line pb-4">
        <div className="flex items-baseline gap-2">
          <dt className="sr-only">Download</dt>
          <dd className="text-5xl font-semibold tracking-tight">
            {plan.download} <span className="text-4xl">Mbps</span>
          </dd>
          <span aria-hidden="true" className="text-xs text-muted">Download</span>
        </div>
        {plan.upload && (
          <div className="mt-3 flex items-baseline gap-2 text-muted">
            <dt className="sr-only">Upload</dt>
            <dd className="text-3xl font-medium">{plan.upload} Mbps</dd>
            <span aria-hidden="true" className="text-xs">Upload</span>
          </div>
        )}
        {!plan.upload && (
          <div className="mt-3 text-muted">
            <dt className="sr-only">Dados</dt>
            <dd className="text-3xl font-medium">Ilimitado</dd>
          </div>
        )}
      </dl>

      <a
        href={site.hireHref}
        aria-label={`Contratar ${plan.name} por ${plan.price}`}
        className={`group mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-all duration-200 ${
          plan.featured
            ? "border-brand-600 bg-brand-600 text-white hover:bg-brand-700"
            : "border-line text-ink hover:border-brand-600 hover:bg-brand-600 hover:text-white"
        }`}
      >
        {plan.price}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </a>

      <p className="mt-8 text-sm font-medium">Ideal para</p>
      <ul className="mt-4 space-y-3">
        {plan.idealFor.map((item) => (
          <li key={item} className="flex items-center gap-3 text-sm text-muted">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
              <Check className="size-3" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function PlansSection() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { ref: trackRef, canPrev, canNext, prev, next, reset } = useScrollCarousel<HTMLDivElement>();

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    reset();
  }, [active, trackRef, reset]);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const tab = tabs[active];

  return (
    <section id="planos" aria-labelledby="planos-titulo" className="mx-auto max-w-6xl px-5 pt-24 pb-24 sm:px-8 sm:pt-28">
      <div className="text-center">
        <h2 id="planos-titulo" className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Escolha o <span className="text-brand-500">plano perfeito</span> para o seu dia.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Velocidades reais para diferentes necessidades da navegação básica ao streaming pesado.
        </p>

        <div role="tablist" aria-label="Tipo de plano" className="mt-8 inline-flex rounded-full border border-line bg-surface p-1">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={i === active}
              aria-controls={`painel-${t.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onTabKey}
              className={`min-h-10 cursor-pointer rounded-full px-5 text-sm transition-all duration-200 ${
                i === active ? "bg-white font-medium text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div id={`painel-${tab.id}`} role="tabpanel" aria-labelledby={`tab-${tab.id}`} className="mt-12">
        <div
          ref={trackRef}
          className="scrollbar-none relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pt-2 pb-6 sm:mx-0 sm:scroll-px-0 sm:px-0"
        >
          {tab.plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
        <CarouselArrows
          label="Navegar entre planos"
          canPrev={canPrev}
          canNext={canNext}
          onPrev={prev}
          onNext={next}
        />
      </div>
    </section>
  );
}
