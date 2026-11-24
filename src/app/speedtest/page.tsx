import type { Metadata } from "next";
import { SpeedTest } from "@/components/speedtest/speed-test";

export const metadata: Metadata = {
  title: "Teste de velocidade",
  description:
    "Meça o download, o upload e o ping da sua internet em poucos segundos com o teste de velocidade da Umoja Net.",
};

/** Página única, sem menu nem rodapé (fica fora do grupo (site)). */
export default function SpeedtestPage() {
  return <SpeedTest />;
}
