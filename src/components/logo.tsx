import Image from "next/image";
import logoMark from "../../public/img/homepage/home/logo.svg";
import logoHorizontal from "../../public/img/homepage/home/Logo Horizontal.svg";
import logoHorizontalRoxo from "../../public/img/homepage/home/logo-horizontal-roxo.svg";

/**
 * Emblema circular oficial (centro do menu em desktop). Decorativo: o link à volta tem o nome acessível.
 * Está sempre visível no topo (e pode ser o LCP), por isso carrega logo (`eager`).
 */
export function LogoMark({ className }: { className?: string }) {
  return <Image src={logoMark} alt="" unoptimized loading="eager" className={className} />;
}

/**
 * Logótipo horizontal: branco por defeito (menu em telemóvel e rodapé — fundos escuros) ou roxo
 * `#170733` (`variant="roxo"`, para fundos claros). No menu do topo usar `loading="eager"`.
 */
export function Logo({
  className,
  loading,
  variant = "branco",
}: {
  className?: string;
  loading?: "eager" | "lazy";
  variant?: "branco" | "roxo";
}) {
  return (
    <Image
      src={variant === "roxo" ? logoHorizontalRoxo : logoHorizontal}
      alt=""
      unoptimized
      loading={loading}
      className={className ?? "h-7 w-auto"}
    />
  );
}
