"use client";

import { useEffect, useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import { Cast, Gauge, TvHd, Users, Wallet, Wifi } from "@/components/icons";

type Feature = { icon: ComponentType<SVGProps<SVGSVGElement>>; text: ReactNode };

/** Os 2 grupos de destaques do hero, como no protótipo (alternam a cada ~4 s). */
const groups: Feature[][] = [
  [
    {
      icon: Wifi,
      text: (
        <>
          <strong className="font-semibold">Planos de internet ilimitados</strong>{" "}
          <span className="text-white/80">para assistir sem limites.</span>
        </>
      ),
    },
    {
      icon: Users,
      text: (
        <>
          <span className="text-white/80">Diversão para si e</span>{" "}
          <strong className="font-semibold">para a sua família inteira.</strong>
        </>
      ),
    },
    {
      icon: TvHd,
      text: (
        <>
          <strong className="font-semibold">O melhor da internet e TV</strong>{" "}
          <span className="text-white/80">com combos práticos e económicos.</span>
        </>
      ),
    },
  ],
  [
    {
      icon: Wallet,
      text: (
        <>
          <strong className="font-semibold">Planos que se encaixam</strong>{" "}
          <span className="text-white/80">bem com o seu bolso.</span>
        </>
      ),
    },
    {
      icon: Cast,
      text: (
        <>
          <strong className="font-semibold">Filmes, séries e canais</strong>{" "}
          <span className="text-white/80">pra toda a família com a DSTV Stream.</span>
        </>
      ),
    },
    {
      icon: Gauge,
      text: (
        <>
          <strong className="font-semibold">Navegue sem travar</strong>{" "}
          <span className="text-white/80">a qualquer hora do dia.</span>
        </>
      ),
    },
  ],
];

/** Tempo de cada grupo parado no ecrã. */
const HOLD = 4000;
/** Deslize para a esquerda com desfoque de movimento (~1,2 s no protótipo). */
const DURATION = 1100;
const EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

function Group({ items }: { items: Feature[] }) {
  return (
    <ul className="grid w-full shrink-0 gap-3 px-1 text-left sm:grid-cols-3 sm:gap-6">
      {items.map(({ icon: Icon, text }, i) => (
        <li key={i} className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/90 text-brand-950">
            <Icon className="size-5" />
          </span>
          <p className="text-sm leading-snug">{text}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * Destaques do hero da página Planos: os grupos deslizam sempre para a esquerda.
 * A posição n é uma cópia do 1.º grupo; no fim do deslize volta a 0 sem animação (como o hero do Início).
 */
export function FeatureTicker() {
  const n = groups.length;
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [moving, setMoving] = useState(false);
  const [paused, setPaused] = useState(false);
  const track = [...groups, groups[0]];

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      setAnimate(true);
      setMoving(true);
      setPos((p) => p + 1);
    }, HOLD);
    return () => window.clearTimeout(id);
  }, [pos, paused]);

  useEffect(() => {
    if (!moving) return;
    const id = window.setTimeout(() => {
      setMoving(false);
      if (pos === n) {
        setAnimate(false);
        setPos(0);
      }
    }, DURATION);
    return () => window.clearTimeout(id);
  }, [moving, pos, n]);

  return (
    <div
      className="mt-10 w-full max-w-[1040px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Leitores de ecrã: todos os destaques de uma vez, sem movimento */}
      <ul className="sr-only">
        {groups.flat().map((f, i) => (
          <li key={i}>{f.text}</li>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="flex"
        style={{
          transform: `translate3d(-${pos * 100}%, 0, 0)`,
          transition: animate ? `transform ${DURATION}ms ${EASING}, filter ${DURATION / 2}ms ease` : "none",
          filter: moving ? "blur(5px)" : "blur(0)",
        }}
      >
        {track.map((items, i) => (
          <Group key={i} items={items} />
        ))}
      </div>
    </div>
  );
}
