import Image from "next/image";
import logoMark from "../../public/img/homepage/home/logo.svg";
import logoHorizontal from "../../public/img/homepage/home/Logo Horizontal.svg";

/**
 * Emblema circular oficial (centro do menu em desktop). Decorativo: o link à volta tem o nome acessível.
 * Está sempre visível no topo (e pode ser o LCP), por isso carrega logo (`eager`).
 */
export function LogoMark({ className }: { className?: string }) {
  return <Image src={logoMark} alt="" unoptimized loading="eager" className={className} />;
}

/**
 * Logótipo horizontal branco (menu em telemóvel e rodapé — fundos escuros).
 * No menu do topo usar `loading="eager"`; no rodapé fica `lazy` (por defeito).
 */
export function Logo({ className, loading }: { className?: string; loading?: "eager" | "lazy" }) {
  return (
    <Image
      src={logoHorizontal}
      alt=""
      unoptimized
      loading={loading}
      className={className ?? "h-7 w-auto"}
    />
  );
}
