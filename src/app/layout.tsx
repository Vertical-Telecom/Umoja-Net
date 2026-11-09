import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Umoja Net — Internet rápida e estável em Angola",
    template: "%s | Umoja Net",
  },
  description:
    "Internet rápida, estável e feita para o seu dia. Planos Ukamba, Omunga e Muige, pacotes com DSTV Stream e instalação rápida em Luanda.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-AO" className={`${outfit.variable} ${dmSans.variable}`}>
      <body className="flex min-h-svh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-[60] rounded-full bg-white px-4 py-2 text-sm font-medium text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
