import type { Summary } from "./engine";

/**
 * Qualidade da ligação para cada utilização, de 0 a 5 estrelas, a partir das medições.
 * Regras próprias, inspiradas na pontuação do Cloudflare (sem perda de pacotes, que não medimos).
 */
export type Quality = { stars: number; label: string };

const LABELS = ["Muito fraca", "Fraca", "Razoável", "Boa", "Muito boa", "Excelente"];
const clamp = (n: number) => Math.max(0, Math.min(5, Math.round(n)));
const scale = (v: number, steps: number[]) => steps.filter((s) => v >= s).length; // quantos limiares atinge (0–5)
const scaleLow = (v: number, steps: number[]) => steps.filter((s) => v <= s).length; // para latência: quanto menor, melhor

function result(stars: number): Quality {
  const s = clamp(stars);
  return { stars: s, label: LABELS[s] };
}

export function qualityScores(m: Summary): { streaming: Quality; gaming: Quality; calls: Quality } | null {
  const { download, upload } = m;
  const lat = m.latency.idle;
  const jit = m.jitter.idle ?? 0;
  if (download == null || upload == null || lat == null) return null;
  const loaded = Math.max(m.latency.download ?? lat, m.latency.upload ?? lat);

  // Streaming: sobretudo download (HD ~5 Mbps, 4K ~25 Mbps); latência alta com carga atrasa o arranque.
  const streaming = scale(download, [1, 3, 8, 15, 25]) - (loaded > 300 ? 1 : 0);

  // Jogos: latência e estabilidade (jitter) contam mais do que a velocidade.
  const gaming = scaleLow(lat, [150, 100, 60, 40, 20]) - (jit > 20 ? 1 : 0) - (jit > 50 ? 1 : 0) - (loaded > 200 ? 1 : 0);

  // Videochamadas: upload para enviar a imagem, latência e jitter baixos para a conversa fluir.
  const calls =
    Math.min(scale(upload, [0.3, 0.8, 1.5, 3, 5]), scale(download, [0.5, 1, 2, 4, 6])) -
    (lat > 150 ? 1 : 0) -
    (jit > 30 ? 1 : 0);

  return { streaming: result(streaming), gaming: result(gaming), calls: result(calls) };
}
