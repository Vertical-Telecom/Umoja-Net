/**
 * Motor do teste de velocidade da Umoja Net (no estilo do teste do Cloudflare), a medir contra o servidor
 * LibreSpeed da Vertical Telecom. Corre no navegador:
 *   1. latência em repouso (pedidos vazios seguidos);
 *   2. downloads de 1, 10 e 25 MB e uploads de 100 kB, 1 MB e 10 MB, com latência medida em paralelo;
 *   3. resultados por pedido, para os gráficos e para as estatísticas (percentil 90, medianas, jitter).
 * A perda de pacotes não é medida: o navegador não envia UDP sem um servidor TURN (ver PENDENTE em baixo).
 */

export const SERVER = (process.env.NEXT_PUBLIC_SPEEDTEST_SERVER || "https://speedtest.verticaltelecom.ao/").replace(/\/?$/, "/");
export const SERVER_HOST = new URL(SERVER).host;

const MiB = 1024 * 1024;
const kB = 1000;

/** Um pedido que demore mais do que isto impede passar para o tamanho seguinte (como no Cloudflare). */
const FINISH_REQUEST_MS = 1000;
/** Tempo máximo por direção, para o teste não se arrastar em ligações lentas. */
const DIRECTION_BUDGET_MS = 25_000;
/** Pausa entre medições de latência durante as transferências (~100 amostras por fase). */
const PROBE_GAP_MS = 80;

export type Direction = "download" | "upload";
export type LatencyPhase = "idle" | Direction;

export type Step = { kind: "latency"; count: number } | { kind: Direction; bytes: number; count: number; label: string };

/** Plano do teste. PENDENTE: o upload de 10 MB só passa depois de subirem o client_max_body_size do nginx (hoje 1 MB). */
export const PLAN: Step[] = [
  { kind: "latency", count: 20 },
  { kind: "download", bytes: 1 * MiB, count: 8, label: "1 MB" },
  { kind: "download", bytes: 10 * MiB, count: 4, label: "10 MB" },
  { kind: "download", bytes: 25 * MiB, count: 3, label: "25 MB" },
  { kind: "upload", bytes: 100 * kB, count: 8, label: "100 kB" },
  { kind: "upload", bytes: 1 * MiB, count: 6, label: "1 MB" },
  { kind: "upload", bytes: 10 * MiB, count: 4, label: "10 MB" },
];

export type SegmentStatus = "pending" | "running" | "done" | "skipped" | "error";
export type Segment = { step: number; kind: Step["kind"]; status: SegmentStatus };

export type Transfer = { direction: Direction; step: number; label: string; bytes: number; bps: number; durationMs: number; t: number };
export type LatencySample = { phase: LatencyPhase; ms: number; t: number };

export type TestStatus = "idle" | "running" | "done" | "aborted" | "error";

export type TestState = {
  status: TestStatus;
  /** O que está a ser medido agora (ex.: "Download · 10 MB"). */
  current: { kind: Step["kind"]; label?: string } | null;
  segments: Segment[];
  transfers: Transfer[];
  latency: LatencySample[];
  /** Passos saltados e porquê (ligação lenta, limite do servidor). */
  skipped: { step: number; reason: "lento" | "limite" | "tempo" }[];
  error?: string;
};

export const initialState = (): TestState => ({
  status: "idle",
  current: null,
  segments: PLAN.flatMap((s, step) => Array.from({ length: s.count }, () => ({ step, kind: s.kind, status: "pending" as const }))),
  transfers: [],
  latency: [],
  skipped: [],
});

const rand = () => Math.random().toString(36).slice(2);
const emptyUrl = () => `${SERVER}backend/empty.php?cors=true&r=${rand()}`;
const garbageUrl = (bytes: number) => `${SERVER}backend/garbage.php?cors=true&ckSize=${Math.round(bytes / MiB)}&r=${rand()}`;
const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const id = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        resolve();
      },
      { once: true },
    );
  });

/** Tempo de ida e volta de um pedido vazio (até chegarem os cabeçalhos da resposta). */
async function ping(signal: AbortSignal) {
  const t0 = performance.now();
  const res = await fetch(emptyUrl(), { cache: "no-store", signal });
  const ms = performance.now() - t0;
  await res.arrayBuffer();
  return ms;
}

/** Download: mede o tempo de transferência depois do primeiro byte (sem a latência do pedido). */
async function download(bytes: number, signal: AbortSignal) {
  const t0 = performance.now();
  const res = await fetch(garbageUrl(bytes), { cache: "no-store", signal });
  if (!res.ok || !res.body) throw new Error(`download ${res.status}`);
  const reader = res.body.getReader();
  let first = 0;
  let firstBytes = 0;
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!first) {
      first = performance.now();
      firstBytes = value.byteLength;
    }
    total += value.byteLength;
  }
  const end = performance.now();
  const useTransfer = end - first > 20 && total > firstBytes;
  const ms = useTransfer ? end - first : end - t0;
  const bits = (useTransfer ? total - firstBytes : total) * 8;
  return { bytes: total, durationMs: end - t0, bps: bits / (ms / 1000) };
}

/** Bloco aleatório reutilizado nos uploads (não comprimível). */
let randomChunk: Uint8Array<ArrayBuffer> | null = null;
function payload(bytes: number) {
  if (!randomChunk) {
    randomChunk = new Uint8Array(65536);
    crypto.getRandomValues(randomChunk);
  }
  const parts: BlobPart[] = [];
  for (let left = bytes; left > 0; left -= randomChunk.length) parts.push(left >= randomChunk.length ? randomChunk : randomChunk.slice(0, left));
  // "text/plain" evita o pedido de autorização (preflight) do CORS em cada upload.
  return new Blob(parts, { type: "text/plain" });
}

/** Upload: tempo total do POST menos a latência em repouso (o servidor só confirma no fim). */
async function upload(bytes: number, rttMs: number, signal: AbortSignal) {
  const body = payload(bytes);
  const t0 = performance.now();
  const res = await fetch(emptyUrl(), { method: "POST", body, cache: "no-store", signal });
  await res.arrayBuffer();
  if (!res.ok) throw new Error(`upload ${res.status}`);
  const total = performance.now() - t0;
  const ms = Math.max(total - rttMs, total * 0.5);
  return { bytes, durationMs: total, bps: (bytes * 8) / (ms / 1000) };
}

/** Corre o teste completo. `onUpdate` recebe um novo estado (imutável) a cada medição. */
export function runSpeedTest(onUpdate: (state: TestState) => void) {
  const ctrl = new AbortController();
  const { signal } = ctrl;
  const t0 = performance.now();
  let state: TestState = { ...initialState(), status: "running" };
  const set = (patch: Partial<TestState>) => {
    state = { ...state, ...patch };
    onUpdate(state);
  };
  const setSegment = (index: number, status: SegmentStatus) =>
    set({ segments: state.segments.map((s, i) => (i === index ? { ...s, status } : s)) });
  const skipStep = (step: number, reason: TestState["skipped"][number]["reason"]) =>
    set({
      segments: state.segments.map((s) => (s.step === step && s.status === "pending" ? { ...s, status: "skipped" } : s)),
      skipped: [...state.skipped, { step, reason }],
    });
  const addLatency = (phase: LatencyPhase, ms: number) =>
    set({ latency: [...state.latency, { phase, ms, t: performance.now() - t0 }] });

  /** Medições de latência em paralelo com uma transferência. Devolve a função que as pára. */
  const startProbes = (phase: Direction) => {
    let stop = false;
    const loop = (async () => {
      while (!stop && !signal.aborted) {
        try {
          const ms = await ping(signal);
          if (!stop) addLatency(phase, ms);
        } catch {
          /* uma sonda falhada não interrompe o teste */
        }
        await sleep(PROBE_GAP_MS, signal);
      }
    })();
    return async () => {
      stop = true;
      await loop;
    };
  };

  const done = (async () => {
    onUpdate(state);
    try {
      // Aquecimento: abre a ligação (TLS) antes de medir.
      await ping(signal);
      await ping(signal);

      let segIndex = 0;
      const lastMedianMs: Partial<Record<Direction, number>> = {};
      const directionStart: Partial<Record<Direction, number>> = {};
      const blocked: Partial<Record<Direction, boolean>> = {};
      let idleRtt = 50;

      for (let step = 0; step < PLAN.length; step++) {
        const s = PLAN[step];
        if (signal.aborted) break;

        if (s.kind === "latency") {
          set({ current: { kind: "latency" } });
          for (let i = 0; i < s.count && !signal.aborted; i++, segIndex++) {
            setSegment(segIndex, "running");
            addLatency("idle", await ping(signal));
            setSegment(segIndex, "done");
          }
          const idle = state.latency.filter((l) => l.phase === "idle").map((l) => l.ms);
          idleRtt = median(idle) ?? idleRtt;
          continue;
        }

        const dir = s.kind;
        directionStart[dir] ??= performance.now();
        const slow = (lastMedianMs[dir] ?? 0) > FINISH_REQUEST_MS;
        const outOfTime = performance.now() - directionStart[dir] > DIRECTION_BUDGET_MS;
        if (blocked[dir] || slow || outOfTime) {
          skipStep(step, blocked[dir] ? "limite" : slow ? "lento" : "tempo");
          segIndex += s.count;
          continue;
        }

        set({ current: { kind: dir, label: s.label } });
        const stopProbes = startProbes(dir);
        const durations: number[] = [];
        try {
          for (let i = 0; i < s.count && !signal.aborted; i++, segIndex++) {
            setSegment(segIndex, "running");
            try {
              const r = dir === "download" ? await download(s.bytes, signal) : await upload(s.bytes, idleRtt, signal);
              durations.push(r.durationMs);
              set({ transfers: [...state.transfers, { direction: dir, step, label: s.label, ...r, t: performance.now() - t0 }] });
              setSegment(segIndex, "done");
            } catch (e) {
              if (signal.aborted) throw e;
              setSegment(segIndex, "error");
              // Uploads acima de 1 MB recusados pelo nginx (413, sem CORS): não vale a pena tentar maiores.
              if (dir === "upload" && s.bytes > MiB) {
                blocked.upload = true;
                skipStep(step, "limite");
                segIndex += s.count - i;
                break;
              }
            }
            if (performance.now() - directionStart[dir] > DIRECTION_BUDGET_MS && i >= 2) {
              skipStep(step, "tempo");
              segIndex += s.count - i;
              break;
            }
          }
        } finally {
          await stopProbes();
        }
        lastMedianMs[dir] = median(durations) ?? lastMedianMs[dir];
      }

      set({ status: signal.aborted ? "aborted" : "done", current: null });
    } catch (e) {
      set(signal.aborted ? { status: "aborted", current: null } : { status: "error", current: null, error: String(e) });
    }
    return state;
  })();

  return { abort: () => ctrl.abort(), done };
}

/* ---------- Estatísticas ---------- */

export function percentile(values: number[], p: number): number | null {
  if (!values.length) return null;
  const v = [...values].sort((a, b) => a - b);
  const i = (v.length - 1) * p;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return v[lo] + (v[hi] - v[lo]) * (i - lo);
}

export const median = (values: number[]) => percentile(values, 0.5);

/** Jitter: média das diferenças entre medições de latência seguidas. */
export function jitter(values: number[]): number | null {
  if (values.length < 2) return null;
  let sum = 0;
  for (let i = 1; i < values.length; i++) sum += Math.abs(values[i] - values[i - 1]);
  return sum / (values.length - 1);
}

export type Summary = {
  /** Velocidades finais em Mbps: percentil 90 dos pedidos (como o Cloudflare). */
  download: number | null;
  upload: number | null;
  latency: { idle: number | null; download: number | null; upload: number | null };
  jitter: { idle: number | null; download: number | null; upload: number | null };
};

export function summarize(state: TestState): Summary {
  const mbps = (dir: Direction) => {
    const v = state.transfers.filter((t) => t.direction === dir && t.durationMs >= 10).map((t) => t.bps / 1e6);
    return percentile(v, 0.9);
  };
  const lat = (phase: LatencyPhase) => state.latency.filter((l) => l.phase === phase).map((l) => l.ms);
  return {
    download: mbps("download"),
    upload: mbps("upload"),
    latency: { idle: median(lat("idle")), download: median(lat("download")), upload: median(lat("upload")) },
    jitter: { idle: jitter(lat("idle")), download: jitter(lat("download")), upload: jitter(lat("upload")) },
  };
}
