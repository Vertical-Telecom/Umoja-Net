import Link from "next/link";
import { Gauge } from "@/components/icons";

/** Botão flutuante para o teste de velocidade (/speedtest). Só existe nas páginas do site ((site)/layout.tsx). */
export function SpeedtestFab() {
  return (
    <Link
      href="/speedtest"
      className="group fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center gap-2 rounded-[60px] bg-brand-950 text-white shadow-lg shadow-brand-950/30 ring-4 ring-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-900 sm:right-6 sm:bottom-6 sm:h-14 sm:w-auto sm:px-6"
    >
      <Gauge className="size-6 shrink-0 transition-transform duration-300 group-hover:rotate-12" />
      <span className="type-button max-sm:sr-only">Teste de velocidade</span>
    </Link>
  );
}
