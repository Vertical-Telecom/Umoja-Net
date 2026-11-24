"use client";

import { useLayoutEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";

/** Degradê Umoja (#170733 → #ffc23d): só na barra de progresso do teste. */
const FROM = [0x17, 0x07, 0x33];
const TO = [0xff, 0xc2, 0x3d];
export const gradientAt = (t: number) => {
  const k = Math.max(0, Math.min(1, t));
  return `rgb(${FROM.map((c, i) => Math.round(c + (TO[i] - c) * k)).join(" ")})`;
};

/** Números em português (vírgula decimal): mais casas para valores pequenos. */
export function fmt(v: number | null | undefined, digits?: number) {
  if (v == null || !Number.isFinite(v)) return "–";
  const d = digits ?? (v < 10 ? 2 : v < 100 ? 1 : 0);
  return v.toLocaleString("pt-PT", { minimumFractionDigits: d, maximumFractionDigits: d });
}

/** Tamanho do elemento, atualizado quando muda (os gráficos são desenhados em píxeis reais). */
function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setSize({ width: Math.round(entry.contentRect.width), height: Math.round(entry.contentRect.height) }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size.width, size.height] as const;
}

/** Arredonda o máximo de uma escala para um número "redondo" (1, 2, 2,5, 5 × 10^n). */
export function niceMax(v: number) {
  if (!(v > 0)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}

/* ---------- Velocidade ao longo do teste (uma série por gráfico) ---------- */

export type SpeedPoint = { t: number; mbps: number; label: string };

/** Gráfico de uma série; `color` é uma cor da paleta (roxo Umoja no download, laranja no upload). */
export function SpeedChart({ points, p90, title, color }: { points: SpeedPoint[]; p90: number | null; title: string; color: string }) {
  const [ref, width, height] = useSize<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const H = height || 132;
  const left = 28; // espaço para a etiqueta do eixo, fora da zona dos pontos
  const top = 10;
  const bottom = 6;
  const plotH = H - top - bottom;

  const max = niceMax(Math.max(1, ...points.map((p) => p.mbps), p90 ?? 0) * 1.1);
  const t0 = points[0]?.t ?? 0;
  const span = Math.max(1, (points.at(-1)?.t ?? 1) - t0);
  const x = (t: number) => (points.length < 2 ? (left + width) / 2 : left + 6 + ((t - t0) / span) * (width - left - 12));
  const y = (v: number) => top + plotH - (v / max) * plotH;

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)},${y(p.mbps).toFixed(1)}`).join("");
  const area = points.length > 1 ? `${line}L${x(points.at(-1)!.t).toFixed(1)},${y(0)}L${x(t0).toFixed(1)},${y(0)}Z` : "";

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!points.length) return;
    const px = e.clientX - e.currentTarget.getBoundingClientRect().left;
    let best = 0;
    points.forEach((p, i) => {
      if (Math.abs(x(p.t) - px) < Math.abs(x(points[best].t) - px)) best = i;
    });
    setHover(best);
  };
  const h = hover != null ? points[hover] : null;

  return (
    <div ref={ref} className="relative size-full">
      {width > 0 && (
        <svg width={width} height={H} role="img" aria-label={title} onPointerMove={onMove} onPointerLeave={() => setHover(null)} className="block touch-none">
          {/* Grelha: base e metade da escala */}
          <line x1={left} x2={width} y1={y(0)} y2={y(0)} stroke="rgb(23 7 51 / 0.12)" />
          <line x1={left} x2={width} y1={y(max / 2)} y2={y(max / 2)} stroke="rgb(23 7 51 / 0.06)" />
          <text x="0" y={y(max / 2) + 3} className="fill-brand-950/45 text-[10px]">
            {fmt(max / 2, max / 2 < 10 ? 1 : 0)}
          </text>
          {area && <path d={area} fill={color} opacity="0.1" />}
          {p90 != null && points.length > 0 && (
            <g>
              <line x1={left} x2={width} y1={y(p90)} y2={y(p90)} stroke="rgb(23 7 51 / 0.35)" />
              <text x={width - 2} y={y(p90) - 4} textAnchor="end" className="fill-brand-950/60 text-[10px]">
                percentil 90
              </text>
            </g>
          )}
          {points.length > 1 && <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />}
          {points.map((p, i) => (
            <circle key={i} cx={x(p.t)} cy={y(p.mbps)} r={hover === i ? 5 : 4} fill="#fff" stroke={color} strokeWidth="2" />
          ))}
          {h && <line x1={x(h.t)} x2={x(h.t)} y1={top} y2={y(0)} stroke="rgb(23 7 51 / 0.25)" />}
          {!points.length && (
            <text x={width / 2} y={H / 2} textAnchor="middle" className="fill-brand-950/40 text-xs">
              A aguardar medições…
            </text>
          )}
        </svg>
      )}
      {h && (
        <div
          className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-brand-950 px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-lg"
          style={{ left: Math.min(Math.max(x(h.t), 60), width - 60) }}
        >
          {h.label} · <strong>{fmt(h.mbps)} Mbps</strong>
        </div>
      )}
    </div>
  );
}

/* ---------- Estrelas (0–5) ---------- */

const STAR = "M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95z";

export function Stars({ value, label }: { value: number | null; label: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={value == null ? `${label}: por medir` : `${label}: ${value} de 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="size-3.5 sm:size-5" aria-hidden="true">
          <path
            d={STAR}
            fill={value != null && i < value ? "#ffc23d" : "none"}
            stroke={value != null && i < value ? "#ff9f1c" : "rgb(23 7 51 / 0.25)"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

/* ---------- Barra de progresso por pedido ---------- */

export type BarSegment = { status: "pending" | "running" | "done" | "skipped" | "error"; title: string };

export function SegmentBar({ segments, children }: { segments: BarSegment[]; children?: ReactNode }) {
  const n = Math.max(1, segments.length - 1);
  return (
    <div>
      {children}
      <div className="mt-2 flex gap-[3px]" aria-hidden="true">
        {segments.map((s, i) => (
          <span
            key={i}
            title={s.title}
            className={`h-3 min-w-0 flex-1 -skew-x-[20deg] rounded-[3px] ${s.status === "running" ? "animate-pulse" : ""}`}
            style={{
              backgroundColor:
                s.status === "done" || s.status === "running"
                  ? gradientAt(i / n)
                  : s.status === "error"
                    ? "rgb(23 7 51 / 0.35)"
                    : "rgb(23 7 51 / 0.08)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
