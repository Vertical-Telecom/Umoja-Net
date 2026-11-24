import Image from "next/image";
import { Typewriter } from "./typewriter";
// logo-3d.webp: imagem extraída de aboutpage/Umoja Logo 3d 2.svg.
import logo3d from "../../../public/img/aboutpage/logo-3d.webp";

/** "Somos mais do que um provedor de internet": quem somos, com o emblema 3D. */
export function AboutIntro() {
  return (
    /*
      Frame do design (1440): texto a 76px da esquerda (715px de largura) e emblema de 438×438 a 900px.
    */
    <section
      aria-labelledby="quem-somos"
      className="mx-auto px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:pt-20.5 xl:px-19"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,715px)_minmax(0,438px)] lg:justify-between lg:gap-12 xl:gap-27.25">
        <div>
          <h2
            id="quem-somos"
            className="max-w-155.5 type-h2 text-foundation-blue-600"
          >
            Somos mais do que um provedor de internet.{" "}
            <span className="text-gradient-accent">
              Somos <Typewriter words={["conexão", "presença.", "unidade."]} />
            </span>
          </h2>
          <div className="mt-8 flex max-w-178.75 flex-col gap-7.5 type-body text-muted">
            <p>
              A Umoja Net surgiu com um propósito simples e profundo: <br className="hidden lg:block" />
              <strong className="font-semibold text-ink">
                aproximar pessoas através de uma tecnologia fiável, humana e feita para a realidade africana.
              </strong>
            </p>
            <p>
              Acreditamos que a{" "}
              <strong className="font-semibold text-ink">internet é uma ponte, não apenas para o mundo</strong>, mas
              também para o que temos mais perto: a nossa família, as nossas raízes e as nossas histórias.
            </p>
            <p>
              Trabalhamos com foco na experiência humana, porque{" "}
              <strong className="font-semibold text-ink">
                por trás de cada ligação existe um estudante, um empreendedor, uma mãe, uma família
              </strong>
              , uma comunidade inteira em movimento.
            </p>
          </div>
        </div>

        <Image
          src={logo3d}
          alt=""
          sizes="(min-width: 1024px) 438px, 70vw"
          className="mx-auto w-full max-w-75 motion-safe:animate-float lg:mx-0 lg:max-w-109.5"
        />
      </div>
    </section>
  );
}
