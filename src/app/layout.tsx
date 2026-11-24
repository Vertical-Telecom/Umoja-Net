import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
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
      <head>
        {/* Preload da fonte usada nos títulos acima do scroll — evita FOUT no hero. */}
        <link rel="preload" href="/fonts/Campton-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      {/* O menu e o rodapé estão em (site)/layout.tsx; a página /speedtest fica sem eles. */}
      <body className="flex min-h-svh flex-col">{children}</body>
    </html>
  );
}
