"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, site, socialLinks } from "@/lib/site";
import { socialIcons } from "./icons";
import { Logo } from "./logo";

/** Rodapé com logo, links e redes sociais. Os links seguem o estilo do menu do topo. */
export function SiteFooter() {
  const pathname = usePathname();
  const isActive = (href: string) => !href.includes("#") && href === pathname;

  return (
    <footer className="bg-brand-950 text-white">
      <div className="mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-[76px] pt-16 sm:pt-20">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
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
