"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { site } from "@/lib/site";
import { ArrowRight, Rocket } from "@/components/icons";
import heroImage from "../../../public/img/home/home.png";
// bg1.png / bg2.png: PNG extraído de BG1.svg / BG2.svg (o next/image não otimiza SVG).
import bg1Image from "../../../public/img/home/bg1.png";
import bg2Image from "../../../public/img/home/bg2.png";

type Cta = { href: string; label: string; arrow?: boolean };

type Slide = {
  image: StaticImageData;
  alt: string;
  position: string;
  /** Sobreposição sobre a imagem (CSS background). */
  overlay: string;
  /**
   * stack: título, texto e 2 botões em coluna, centrados na vertical (slide 1).
   * split: título em baixo à esquerda; texto e 1 botão à direita (slides 2 e 3).
   */
  layout: "stack" | "split";
  title: ReactNode;
  text: ReactNode;
  cta: Cta;
  secondary?: Cta;
  /** Largura máxima do texto no layout split (do design). */
  textWidth?: string;
};

const slides: Slide[] = [
  {
    image: heroImage,
    alt: "Homem sorridente a usar o telemóvel ao entardecer, numa rua iluminada",
    position: "70% center",
    overlay:
      "linear-gradient(to right, rgb(23 7 51 / 0.9), rgb(23 7 51 / 0.55) 50%, transparent), linear-gradient(to top, rgb(23 7 51 / 0.7), transparent 18%)",
    layout: "stack",
    title: (
      <>
        Tenha uma <span className="text-gradient-accent">internet rápida</span>,
        estável e feita para o seu dia.
      </>
    ),
    text: (
      <>
        <strong className="font-semibold">Conecte a sua casa ou empresa</strong>{" "}
        com velocidades reais, instalação rápida e suporte sempre presente.
      </>
    ),
    cta: { href: site.hireHref, label: "Contratar Agora" },
    secondary: { href: "#planos", label: "Ver Planos", arrow: true },
  },
  {
    image: bg1Image,
    alt: "Família sorridente no sofá da sala, com uma criança a segurar pipocas",
    position: "center",
    // Degradê do BG1.svg: #04020D a 0.8 × 0.6.
    overlay: "linear-gradient(to bottom, transparent 54%, rgb(4 2 13 / 0.48) 63.6%)",
    layout: "split",
    title: (
      <>
        Um <span className="text-gradient-accent">único serviço.</span>
        <br />
        Mais comodidade para a sua casa.
      </>
    ),
    text: (
      <>
        <strong className="font-semibold">Internet estável e DSTV Stream</strong> integrados para
        facilitar o seu dia, com instalação rápida e suporte sempre disponível.
      </>
    ),
    cta: { href: site.hireHref, label: "Contratar Agora" },
    textWidth: "lg:max-w-[505px]",
  },
  {
    image: bg2Image,
    alt: "Mulher sorridente a usar o telemóvel ao pôr do sol",
    position: "center",
    // Degradê do BG2.svg: #04020D a 0.8 × 0.8.
    overlay: "linear-gradient(to bottom, transparent 45.3%, rgb(4 2 13 / 0.64) 64.4%)",
    layout: "split",
    title: (
      <>
        <span className="text-gradient-accent">Mais velocidade</span>
        <br />
        para tudo o que você faz online.
      </>
    ),
    text: (
      <>
        Desde tarefas simples até usos mais exigentes,{" "}
        <strong className="font-semibold">tenha uma internet que responde sem falhas.</strong>
      </>
    ),
    cta: { href: "#planos", label: "Conhecer Planos", arrow: true },
    textWidth: "lg:max-w-[421px]",
  },
];

/** Tempo de cada slide no ecrã. */
const INTERVAL = 5000;
/** Transição "push" (como no protótipo): ~0,7s, arranca rápido e trava no fim. */
const DURATION = 700;
const EASING = "cubic-bezier(0.33, 1, 0.68, 1)";

const titleClass =
  "font-display text-[40px] leading-[48px] font-semibold tracking-[-1.5px] sm:text-[48px] sm:leading-[57px] lg:text-[56px] lg:leading-[66px] lg:tracking-[-2px]";

function CtaLink({ cta, variant }: { cta: Cta; variant: "solid" | "outline" | "compact" }) {
  const base =
    "group inline-flex items-center justify-center gap-3 rounded-full text-center font-display text-base leading-6 font-semibold tracking-normal transition-all duration-200";
  const styles = {
    // Botão do slide 1 (design): 64px de altura, padding 20/36.
    solid:
      "bg-white px-9 py-5 text-foundation-blue-600 shadow-lg shadow-brand-950/30 hover:-translate-y-0.5 hover:bg-brand-50",
    outline: "border border-white/70 px-9 py-[19px] text-white hover:bg-white/10",
    // Botão dos slides 2 e 3 (design): 56px de altura.
    compact:
      "bg-white px-6 py-4 text-foundation-blue-600 shadow-lg shadow-brand-950/30 hover:-translate-y-0.5 hover:bg-brand-50",
  }[variant];
  return (
    <a href={cta.href} className={`${base} ${styles}`}>
      {cta.label}
      {cta.arrow && (
        <ArrowRight className="size-6 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </a>
  );
}

function SlideContent({ slide, heading }: { slide: Slide; heading: "h1" | "h2" }) {
  const Heading = heading;

  if (slide.layout === "stack") {
    return (
      /*
        Slide 1: bloco de 738px, gap 32px, centrado na vertical
        (no frame de 1440×900 dá o top de ~283px do design).
      */
      <div className="relative my-auto flex max-w-[738px] flex-col gap-6 sm:gap-8">
        <Heading className={titleClass}>{slide.title}</Heading>
        <p className="max-w-[635px] font-display text-lg leading-[26px] font-normal tracking-normal lg:text-[24px] lg:leading-[30px]">
          {slide.text}
        </p>
        <div className="flex flex-wrap gap-4">
          <CtaLink cta={slide.cta} variant="solid" />
          {slide.secondary && <CtaLink cta={slide.secondary} variant="outline" />}
        </div>

        {/*
          Cartão flutuante: 330×72, raio 16, padding 16/16/16/32, gap 10.
          No design: left 774px (698px a partir do bloco), 306px abaixo do topo do bloco.
          Visível a partir de xl (1280px).
        */}
        <div className="absolute top-[306px] left-[698px] hidden h-[72px] w-max items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 py-4 pr-4 pl-8 whitespace-nowrap backdrop-blur-md xl:flex">
          <Rocket className="size-[30px] shrink-0 text-foundation-purple-50" />
          <p className="font-display text-base leading-[22px] tracking-normal">
            <strong className="block font-bold">Umoja Net</strong>
            <span className="block font-normal">Internet rápida para o seu dia.</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    /*
      Slides 2 e 3: título em baixo à esquerda (~122px acima do fundo no frame de 812px)
      e coluna de texto + botão à direita, alinhada pelo topo do título.
    */
    <div className="mt-auto flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12 lg:pb-[clamp(72px,15svh,122px)]">
      <Heading className={`${titleClass} lg:max-w-[470px]`}>{slide.title}</Heading>
      <div className={`flex flex-col items-start gap-6 lg:pt-1.5 ${slide.textWidth ?? ""}`}>
        <p className="font-display text-lg leading-[26px] font-normal tracking-normal lg:text-[22px] lg:leading-[30px]">
          {slide.text}
        </p>
        <CtaLink cta={slide.cta} variant="compact" />
      </div>
    </div>
  );
}

export function Hero() {
  const n = slides.length;
  // Posição na faixa: 0..n. A posição n é uma cópia do 1.º slide, para o loop
  // continuar sempre da direita para a esquerda; no fim da transição salta para 0 sem animação.
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const active = pos % n;
  const track = [...slides, slides[0]];

  const goTo = (i: number) => {
    setAnimate(true);
    setPos(i);
  };

  useEffect(() => {
    if (paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      setAnimate(true);
      setPos((p) => p + 1);
    }, INTERVAL);
    return () => window.clearTimeout(id);
  }, [pos, paused, n]);

  // Chegou à cópia do 1.º slide: no fim da transição volta à posição 0 sem animação.
  // Usa um temporizador (e não transitionend) para funcionar mesmo com o separador em segundo plano.
  useEffect(() => {
    if (pos !== n) return;
    const id = window.setTimeout(() => {
      setAnimate(false);
      setPos(0);
    }, DURATION + 50);
    return () => window.clearTimeout(id);
  }, [pos, n]);

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Destaques"
      className="relative overflow-hidden bg-brand-950 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="flex will-change-transform"
        style={{
          transform: `translate3d(-${pos * 100}%, 0, 0)`,
          transition: animate ? `transform ${DURATION}ms ${EASING}` : "none",
        }}
      >
        {track.map((slide, i) => {
          const isClone = i === n;
          const isActive = i === pos;
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${(i % n) + 1} de ${n}`}
              aria-hidden={!isActive || isClone}
              inert={!isActive}
              className="relative isolate flex min-h-[max(560px,100svh)] w-full shrink-0 pt-24 pb-20 lg:pt-0 lg:pb-0"
            >
              <Image
                src={slide.image}
                alt={isActive && !isClone ? slide.alt : ""}
                fill
                sizes="100vw"
                preload={i === 0}
                placeholder="blur"
                className="-z-20 object-cover"
                style={{ objectPosition: slide.position }}
              />
              <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: slide.overlay }} />
              {/* Em ecrãs pequenos o texto ocupa metade da imagem: reforça o contraste (WCAG 4.5:1). */}
              {slide.layout === "split" && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-linear-to-t from-[#04020d]/90 via-[#04020d]/60 via-55% to-transparent lg:hidden"
                />
              )}

              {/* Frame do design (1440 de largura): margens de 76px. Acima de 1440px fica centrado. */}
              <div className="relative mx-auto flex w-full max-w-[1440px] flex-col px-5 sm:px-8 lg:px-12 xl:px-[76px]">
                <SlideContent slide={slide} heading={i === 0 ? "h1" : "h2"} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicadores */}
      {n > 1 && (
        <div className="absolute inset-x-0 bottom-[clamp(8px,3.5svh,32px)] flex justify-center gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir para o destaque ${i + 1}`}
              aria-current={i === active}
              className="group grid h-11 w-8 cursor-pointer place-items-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-7 bg-white" : "w-1.5 bg-white/50 group-hover:bg-white/80"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
