"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, site, socialLinks } from "@/lib/site";
import { socialIcons } from "./icons";
import { Logo } from "./logo";

/** Faixa "Fale connosco" + rodapé com redes sociais. Os links seguem o estilo do menu do topo. */
export function SiteFooter() {
  const pathname = usePathname();
  const isActive = (href: string) => !href.includes("#") && href === pathname;

  return (
    <footer className="bg-brand-950 text-white">
      <div className="mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-[76px] pt-16 sm:pt-20">
        <section
          id="contacto"
          aria-labelledby="cta-titulo"
          className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl bg-white px-6 py-12 text-center shadow-2xl shadow-brand-500/20 sm:py-14"
        >
          <h2
            id="cta-titulo"
            className="max-w-[406px] font-display text-[26px] leading-[30px] font-semibold tracking-normal text-foundation-purple-900 sm:text-[28px] sm:leading-[28px]"
          >
            Quer saber mais sobre o <br className="hidden sm:block" />
            nosso trabalho?
          </h2>
          <a
            href={site.contactHref}
            className="inline-flex h-14 cursor-pointer items-center justify-center rounded-[60px] bg-brand-500 px-6 py-4 font-display text-base leading-6 font-semibold text-white transition-colors duration-200 hover:bg-brand-600"
          >
            Fale connosco
          </a>
        </section>

        <div className="mt-14 flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <Link href="/" className="rounded-full" aria-label="Umoja Net — Início">
            <Logo />
          </Link>
          <nav aria-label="Rodapé">
            <ul className="flex flex-wrap justify-center gap-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`inline-block rounded-full px-6 py-[13px] text-center font-nav text-lg leading-[18px] font-normal tracking-normal transition-colors duration-200 ${
                      isActive(l.href) ? "bg-white text-ink" : "text-white hover:bg-white/10"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex gap-2">
            {socialLinks.map((s) => {
              const Icon = socialIcons[s.icon];
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="grid size-11 place-items-center rounded-full bg-white text-brand-950 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-brand-100"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-10 border-t border-white/10 py-8 text-center font-display text-base leading-[18px] font-normal text-foundation-blue-100 sm:text-lg">
          {site.copyright}
        </p>
      </div>
    </footer>
  );
}
