"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import {
  ArrowLeft,
  ArrowUp,
  BadgeCheck,
  Download,
  Gamepad,
  Globe,
  MapPin,
  Network,
  Play,
  RotateCcw,
  Server,
  Stop,
  TvHd,
  Video,
  Wifi,
  Zap,
} from "@/components/icons";
import { Logo } from "@/components/logo";
import { initialState, PLAN, runSpeedTest, SERVER, summarize, type TestState } from "@/lib/speedtest/engine";
import { qualityScores } from "@/lib/speedtest/quality";
import verticalLogo from "../../../public/librespeed/vertical.png";
import { fmt, SegmentBar, SpeedChart, Stars } from "./charts";

/** Rede (ASN) da Umoja Net / Vertical Telecom, registada na AFRINIC (102.201.200.0/22). */
const UMOJA_ASN = "AS329782";
/** PENDENTE: confirmar a localização exata do servidor (por agora, centro de Luanda). */
const SERVER_PLACE = { name: "Luanda", lat: -8.8383, lng: 13.2344 };

type IspInfo = { ip: string; name: string; asn: string };
type RawIsp = { as_name?: string; asn?: string };
type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/* ---------- Peças de layout ---------- */

function Card({ title, accent, children, className = "" }: { title: string; accent?: string; children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-3xl border border-brand-950/10 bg-white p-3 shadow-[0_8px_30px_rgb(23_7_51/0.06)] sm:p-5 lg:p-6 short:lg:p-4 ${className}`}
    >
      <h2 className="mb-2 font-display text-sm font-semibold text-brand-950 sm:mb-4 sm:text-lg short:lg:mb-2">
        {title}
        {accent && <span className="text-accent-600"> {accent}</span>}
      </h2>
      {children}
    </section>
  );
}

function Label({ icon: Icon, children }: { icon: Icon; children: ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-xs font-medium sm:text-sm">
      <Icon className="size-4 shrink-0 text-brand-950" />
      <span className="text-brand-950/70">{children}</span>
    </p>
  );
}

/** Latência ou jitter: valor em repouso e, por baixo, durante o download (↓) e o upload (↑). */
function SideMetric({ icon, label, value, down, up, note }: { icon: Icon; label: string; value: number | null; down?: number | null; up?: number | null; note?: ReactNode }) {
  return (
    <div className="min-w-0">
      <Label icon={icon}>{label}</Label>
      <p className="mt-0.5 flex items-baseline gap-1 font-display font-semibold tabular-nums">
        <span className="text-xl leading-tight text-brand-950 sm:text-2xl">{fmt(value, 1)}</span>
        {!note && <span className="text-xs font-normal text-accent-600 sm:text-sm">ms</span>}
      </p>
      {note ? (
        <p className="text-[11px] leading-snug text-brand-950/60 sm:text-xs">{note}</p>
      ) : (
        <p className="flex flex-wrap gap-x-3 text-[11px] text-brand-950/60 tabular-nums sm:text-xs">
          <span title="Durante o download">↓ {fmt(down ?? null, 1)} ms</span>
          <span title="Durante o upload">↑ {fmt(up ?? null, 1)} ms</span>
        </p>
      )}
    </div>
  );
}

function BigSpeed({ icon, label, value, children }: { icon: Icon; label: string; value: number | null; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <Label icon={icon}>{label}</Label>
      <p className="mt-1 flex items-baseline gap-1.5 font-display font-semibold tabular-nums">
        <span className="text-4xl leading-[1.15] text-brand-950 sm:text-5xl lg:text-6xl short:lg:text-5xl">{fmt(value)}</span>
        <span className="text-sm font-normal text-accent-600 sm:text-lg">Mbps</span>
      </p>
      {/* Gráfico: altura acompanha a do ecrã; no telemóvel fica escondido para a página caber sem scroll. */}
      <div className="mt-3 h-[clamp(64px,14svh,140px)] max-md:hidden">{children}</div>
    </div>
  );
}

/* ---------- Página ---------- */

/** Teste de velocidade da Umoja Net: velocidades, latência com carga, qualidade e servidor, num só ecrã. */
export function SpeedTest() {
  const runRef = useRef<ReturnType<typeof runSpeedTest> | null>(null);
  const [state, setState] = useState<TestState>(initialState);
  const [isp, setIsp] = useState<IspInfo | null>(null);
  const [ispFailed, setIspFailed] = useState(false);

  const start = useCallback(() => {
    runRef.current?.abort();
    runRef.current = runSpeedTest(setState);
  }, []);
  const stop = () => runRef.current?.abort();

  // Começa sozinho ao abrir a página; ao sair, pára o teste.
  useEffect(() => {
    const id = window.setTimeout(start, 300);
    return () => {
      window.clearTimeout(id);
      runRef.current?.abort();
    };
  }, [start]);

  // Identifica a ligação do cliente (IP, operador e se é a rede Umoja).
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${SERVER}backend/getIP.php?isp=true&cors=true`, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => r.json())
      .then((d: { processedString?: string; rawIspInfo?: RawIsp | "" }) => {
        const raw = d.rawIspInfo && typeof d.rawIspInfo === "object" ? d.rawIspInfo : {};
        setIsp({ ip: (d.processedString ?? "").split(" - ")[0].trim(), name: raw.as_name ?? "", asn: raw.asn ?? "" });
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setIspFailed(true);
      });
    return () => ctrl.abort();
  }, []);

  const m = summarize(state);
  const quality = qualityScores(m);
  const running = state.status === "running";
  const isUmoja = isp?.asn === UMOJA_ASN;

  const points = (dir: "download" | "upload") =>
    state.transfers.filter((t) => t.direction === dir).map((t) => ({ t: t.t, mbps: t.bps / 1e6, label: t.label }));

  const status =
    state.status === "running"
      ? state.current?.kind === "latency"
        ? "A medir a latência"
        : state.current
          ? `A medir o ${state.current.kind} · ${state.current.label}`
          : "A preparar o teste…"
      : state.status === "done"
        ? "Teste concluído"
        : state.status === "aborted"
          ? "Teste interrompido"
          : state.status === "error"
            ? "Não foi possível concluir o teste. Tente de novo."
            : "A preparar o teste…";

  const operator = isUmoja
    ? `Umoja Net (${UMOJA_ASN})`
    : isp
      ? `${isp.name || "Desconhecido"}${isp.asn ? ` (${isp.asn})` : ""}`
      : ispFailed
        ? "Desconhecido"
        : "A identificar…";

  const bbox = [SERVER_PLACE.lng - 0.12, SERVER_PLACE.lat - 0.09, SERVER_PLACE.lng + 0.12, SERVER_PLACE.lat + 0.09].map((n) => n.toFixed(4)).join(",");

  return (
    <div className="flex min-h-svh flex-col bg-white text-brand-950">
      {/* Topo: logótipo e voltar ao site */}
      <div className="flex items-center justify-between gap-4 px-4 pt-3 sm:px-8 sm:pt-5 short:sm:pt-3">
        <span>
          <Logo variant="roxo" loading="eager" className="h-6 w-auto sm:h-7" />
          <span className="sr-only">Umoja Net</span>
        </span>
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-brand-950/15 px-4 text-sm font-medium text-brand-950 transition-colors duration-200 hover:bg-brand-950/5"
        >
          <ArrowLeft className="size-4 text-brand-950" />
          Voltar ao site
        </Link>
      </div>

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-center px-4 py-2 sm:px-8 sm:py-5 short:sm:py-2">
        <h1 className="sr-only">Teste de velocidade da Umoja Net</h1>
        <div aria-live="polite" className="sr-only">
          {state.status === "done"
            ? `Teste concluído. Download ${fmt(m.download)} megabits por segundo, upload ${fmt(m.upload)}, latência ${fmt(m.latency.idle, 0)} milissegundos.`
            : status}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:gap-5 short:sm:gap-3 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid min-w-0 gap-2 sm:gap-5 short:sm:gap-3">
            {/* Velocidades, latência, jitter e progresso */}
            <Card title="A sua velocidade de" accent="internet">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_170px] md:gap-6">
                <BigSpeed icon={Download} label="Download" value={m.download}>
                  <SpeedChart points={points("download")} p90={m.download} color="#170733" title="Velocidade de download ao longo do teste" />
                </BigSpeed>
                <BigSpeed icon={ArrowUp} label="Upload" value={m.upload}>
                  <SpeedChart points={points("upload")} p90={m.upload} color="#ff7a00" title="Velocidade de upload ao longo do teste" />
                </BigSpeed>
                <div className="col-span-2 grid grid-cols-3 gap-3 md:col-span-1 md:grid-cols-1 md:content-start md:gap-4">
                  <SideMetric icon={Zap} label="Latência" value={m.latency.idle} down={m.latency.download} up={m.latency.upload} />
                  <SideMetric icon={Wifi} label="Jitter" value={m.jitter.idle} down={m.jitter.download} up={m.jitter.upload} />
                  <SideMetric
                    icon={Network}
                    label="Perda de pacotes"
                    value={null}
                    note={
                      <>
                        Por medir<span className="max-sm:hidden"> (precisa de servidor TURN)</span>
                      </>
                    }
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 sm:mt-6 short:sm:mt-3">
                <button
                  type="button"
                  onClick={running ? stop : start}
                  aria-label={running ? "Parar o teste" : "Iniciar o teste"}
                  className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-brand-950 text-white transition-colors hover:bg-brand-900"
                >
                  {running ? <Stop className="size-4" /> : <Play className="size-4" />}
                </button>
                <button
                  type="button"
                  onClick={start}
                  aria-label="Repetir o teste"
                  className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-brand-950/15 transition-colors hover:bg-brand-950/5"
                >
                  <RotateCcw className="size-4 text-brand-950" />
                </button>
                <div className="min-w-0 flex-1">
                  <SegmentBar
                    segments={state.segments.map((s) => {
                      const p = PLAN[s.step];
                      return { status: s.status, title: p.kind === "latency" ? "Latência" : `${p.kind === "download" ? "Download" : "Upload"} ${p.label}` };
                    })}
                  >
                    <p className="truncate text-xs font-medium sm:text-sm">
                      <span className="text-brand-950">{status}</span>
                    </p>
                  </SegmentBar>
                </div>
              </div>
            </Card>

            {/* Qualidade por utilização */}
            <Card title="Qualidade da" accent="ligação">
              <ul className="grid grid-cols-3 gap-2 sm:gap-4">
                {(
                  [
                    [TvHd, "Streaming", quality?.streaming],
                    [Gamepad, "Jogos online", quality?.gaming],
                    [Video, "Videochamadas", quality?.calls],
                  ] as const
                ).map(([Icon, label, q]) => (
                  <li key={label} className="flex min-w-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <Icon className="size-8 shrink-0 text-brand-950 max-sm:hidden" strokeWidth={1.5} />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium sm:text-sm">
                        <span className="text-brand-950">{label}</span>
                      </p>
                      <Stars value={q?.stars ?? null} label={label} />
                      <p className="text-[11px] text-brand-950/60 sm:text-xs">{q ? q.label : "Por medir"}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Servidor e ligação do cliente (o mapa ocupa o espaço que sobra; no telemóvel fica escondido) */}
          <Card title="Servidor e" accent="ligação" className="flex min-w-0 flex-col">
            <div className="relative min-h-40 flex-1 overflow-hidden rounded-2xl bg-[#f3f2f7] max-md:hidden">
              <iframe
                title={`Mapa: servidor de teste em ${SERVER_PLACE.name}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${SERVER_PLACE.lat},${SERVER_PLACE.lng}`}
                className="absolute inset-0 size-full"
                loading="lazy"
              />
            </div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs sm:grid-cols-1 sm:gap-2.5 sm:text-sm md:mt-4 short:lg:gap-1.5">
              {(
                [
                  [Globe, "Ligado via", isp ? (isp.ip.includes(":") ? "IPv6" : "IPv4") : "–"],
                  [MapPin, "O seu IP", isp?.ip || (ispFailed ? "–" : "A identificar…")],
                  [Server, "Servidor", "luanda.verticaltelecom"],
                  [Network, "A sua rede", operator],
                ] as const
              ).map(([Icon, k, v]) => (
                <div key={k} className={`flex min-w-0 items-start gap-2 ${k === "Servidor" || k === "A sua rede" ? "max-sm:col-span-2" : ""}`}>
                  <Icon className="mt-0.5 size-4 shrink-0 text-brand-950" />
                  <dt className="shrink-0 text-brand-950/60">{k}:</dt>
                  <dd
                    className={`min-w-0 font-medium text-brand-950 ${k === "A sua rede" ? "break-words max-sm:truncate" : "truncate"}`}
                    title={v}
                  >
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            {isp && (
              <p className="mt-2 inline-flex items-center gap-1.5 self-start rounded-full border border-brand-950/10 bg-[#f3f2f7] px-3 py-1 text-xs text-brand-950 sm:mt-3">
                <BadgeCheck className={`size-4 shrink-0 ${isUmoja ? "text-success" : "text-brand-950/50"}`} />
                {isUmoja ? "Está ligado pela rede Umoja Net" : "Está ligado por outro operador"}
              </p>
            )}
          </Card>
        </div>
      </main>

      <div className="relative flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 bg-white px-5 py-1.5 text-xs before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-brand-950/10 sm:text-sm">
        <span className="text-brand-950/60">Powered by</span>
        <a
          href="https://www.verticaltelecom.ao"
          target="_blank"
          rel="noopener noreferrer"
          title="www.verticaltelecom.ao"
          className="rounded-md transition-opacity duration-200 hover:opacity-80"
        >
          <Image src={verticalLogo} alt="Vertical Telecom" loading="eager" sizes="96px" className="h-7 w-auto sm:h-9 short:sm:h-8" />
        </a>
      </div>
    </div>
  );
}
