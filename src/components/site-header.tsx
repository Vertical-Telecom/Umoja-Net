"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/site";
import { Logo, LogoMark } from "./logo";
import { Close, Menu } from "./icons";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Depois do hero, o menu sobe para o topo para não tapar os títulos em ecrãs baixos.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => !href.includes("#") && href === pathname;
  const left = navLinks.slice(0, 2);
  const right = navLinks.slice(2);

  const linkClass = (href: string) =>
    `rounded-full px-6 py-2 text-center font-nav text-lg leading-[18px] font-normal tracking-normal transition-colors duration-200 ${
      isActive(href)
        ? "bg-white text-ink"
        : "text-white/85 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <header
      className={`fixed inset-x-0 z-50 px-4 transition-[top] duration-300 ease-out ${
        scrolled ? "top-4" : "top-4 md:top-[clamp(20px,7.8svh,70px)]"
      }`}
    >
      {/* Desktop */}
      <nav
        aria-label="Principal"
        className="mx-auto hidden w-fit items-center gap-6 rounded-full border border-white/15 bg-brand-950/45 px-8 py-4 shadow-lg shadow-brand-950/20 backdrop-blur-md md:flex"
      >
        {left.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={linkClass(l.href)}
            aria-current={isActive(l.href) ? "page" : undefined}
          >
            {l.label}
          </Link>
        ))}
        <Link href="/" aria-label="Umoja Net — Início" className="relative mx-3 h-9 w-22 shrink-0 rounded-full">
          <LogoMark className="absolute top-1/2 left-0 block max-w-none -translate-y-1/2 drop-shadow-[0_4px_16px_rgba(117,86,255,0.55)]" />
        </Link>
        {right.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={linkClass(l.href)}
            aria-current={isActive(l.href) ? "page" : undefined}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Telemóvel */}
      <div className="md:hidden">
        <div className="flex items-center justify-between rounded-full border border-white/15 bg-brand-950/60 py-1.5 pr-1.5 pl-2 backdrop-blur-md">
          <Link href="/" aria-label="Umoja Net — Início" className="flex min-h-11 items-center rounded-full px-2">
            <Logo className="h-8 w-auto" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="grid size-11 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            {open ? <Close className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        <nav
          id="menu-movel"
          aria-label="Principal"
          hidden={!open}
          className="mt-2 rounded-3xl border border-white/15 bg-brand-950/90 p-2 backdrop-blur-md"
        >
          <ul className="flex flex-col">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`block rounded-2xl px-4 py-[13px] font-nav text-lg leading-[18px] font-normal ${
                    isActive(l.href) ? "bg-white text-ink" : "text-white hover:bg-white/10"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
