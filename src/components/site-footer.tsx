import Link from "next/link";
import { navLinks, site, socialLinks } from "@/lib/site";
import { socialIcons } from "./icons";
import { Logo } from "./logo";

/** Faixa "Fale connosco" + rodapé com redes sociais. */
export function SiteFooter() {
  return (
    <footer className="bg-brand-950 text-white">
      <div className="mx-auto max-w-6xl px-5 pt-16 sm:px-8 sm:pt-20">
        <section
          id="contacto"
          aria-labelledby="cta-titulo"
          className="mx-auto max-w-4xl rounded-3xl bg-white px-6 py-12 text-center text-ink shadow-2xl shadow-brand-500/20 sm:py-14"
        >
          <h2 id="cta-titulo" className="mx-auto max-w-sm text-2xl font-semibold text-balance sm:text-3xl">
            Quer saber mais sobre o nosso trabalho?
          </h2>
          <a
            href={site.contactHref}
            className="mt-6 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-brand-600 px-7 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-700"
          >
            Fale connosco
          </a>
        </section>

        <div className="mt-14 flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <Link href="/" className="rounded-full" aria-label="Umoja Net — Início">
            <Logo />
          </Link>
          <nav aria-label="Rodapé">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/80">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-2 transition-colors hover:text-white">
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

        <p className="mt-10 border-t border-white/10 py-8 text-center text-xs text-white/60">
          {site.copyright}
        </p>
      </div>
    </footer>
  );
}
