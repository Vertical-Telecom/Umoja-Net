"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "./icons";

/** Carrossel horizontal com scroll-snap e setas (sem dependências). */
export function useScrollCarousel<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const frame = requestAnimationFrame(update);
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [update]);

  const scroll = useCallback((dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = first ? first.offsetWidth + gap : el.clientWidth;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return { ref, canPrev, canNext, prev: () => scroll(-1), next: () => scroll(1), reset: update };
}

export function CarouselArrows({
  canPrev,
  canNext,
  onPrev,
  onNext,
  tone = "light",
  label,
}: {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  tone?: "light" | "dark";
  label: string;
}) {
  const base =
    "grid size-11 cursor-pointer place-items-center rounded-full border transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40";
  const styles =
    tone === "light"
      ? "border-line bg-white text-ink hover:border-brand-300 hover:text-brand-600 enabled:shadow-md enabled:shadow-brand-500/10"
      : "border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-brand-700";

  return (
    <div className="flex justify-end gap-3" role="group" aria-label={label}>
      <button type="button" onClick={onPrev} disabled={!canPrev} className={`${base} ${styles}`} aria-label="Anterior">
        <ArrowLeft className="size-4" />
      </button>
      <button type="button" onClick={onNext} disabled={!canNext} className={`${base} ${styles}`} aria-label="Seguinte">
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
