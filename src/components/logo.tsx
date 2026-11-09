import Image from "next/image";
import logoMark from "../../public/img/home/logo.svg";
import logoHorizontal from "../../public/img/home/Logo Horizontal.svg";

/** Emblema circular oficial (centro do menu em desktop). Decorativo: o link à volta tem o nome acessível. */
export function LogoMark({ className }: { className?: string }) {
  return <Image src={logoMark} alt="" unoptimized className={className} />;
}

/** Logótipo horizontal branco (menu em telemóvel e rodapé — fundos escuros). */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={logoHorizontal}
      alt=""
      unoptimized
      className={className ?? "h-7 w-auto"}
    />
  );
}
