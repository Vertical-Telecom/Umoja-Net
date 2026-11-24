import Image from "next/image";
import { Phone } from "@/components/icons";
// mxx.webp: mão a segurar o telemóvel com o Multicaixa Express (cartão e validade fictícios), fundo transparente.
import expressImage from "../../../public/img/homepage/beneficios/mxx.webp";
import logoMark from "../../../public/img/homepage/home/logo.svg";

/** Contacto do post "Forma de pagamento por Express" (Instagram umoja_net). */
const PHONE = "+244 973 088 155";
const PHONE_HREF = "tel:+244973088155";
/** Entidade a usar em "Pagamentos por referência" (da imagem do post). */
const ENTITY = "11565";

const steps = [
  <>
    Abra a app{" "}
    <strong className="font-semibold text-foundation-purple-900">
      Multicaixa Express ou dirija-se a um ATM
    </strong>{" "}
    e entre em{" "}
    <strong className="font-semibold text-foundation-purple-900">
      Pagamentos
    </strong>
    .
  </>,
  <>
    Escolha{" "}
    <strong className="font-semibold text-foundation-purple-900">
      Pagamentos por referência
    </strong>
    .
  </>,
  <>
    Indique a entidade{" "}
    <strong className="font-semibold text-foundation-purple-900">
      {ENTITY} – Vertical Telecom
    </strong>
    , a sua referência e o valor, e toque em{" "}
    <strong className="font-semibold text-foundation-purple-900">
      Continuar
    </strong>
    .
  </>,
];

/** "Novidade": pagar a internet pelo Multicaixa Express (abaixo de Benefícios, no Início). */
export function ExpressNews() {
  return (
    <section
      aria-labelledby="novidade-titulo"
      className="relative isolate mx-auto overflow-hidden px-5 py-20 sm:px-8 sm:py-24 lg:px-12 xl:px-[76px]"
    >
      {/* Logo da Umoja meio transparente, por baixo da mão com o telemóvel:
          desktop — meio círculo colado à borda esquerda, a ocupar a metade esquerda da secção;
          telemóvel — quarto de círculo no canto inferior esquerdo (atrás da mão, longe do texto).
          O fundo da secção corta o logo sempre à mesma altura (70% em desktop, 50% em tablet), por isso a cor
          do logo nessa linha é fixa — #3c205e (desktop) / #371e58 (tablet) — e o Mural começa exatamente nela. */}
      <Image
        src={logoMark}
        alt=""
        aria-hidden="true"
        unoptimized
        className="pointer-events-none absolute bottom-0 left-0 -z-10 aspect-square max-w-none max-md:hidden -translate-x-1/2 opacity-90 max-lg:w-[150%] max-lg:translate-y-1/2 lg:w-full lg:translate-y-[30%]"
      />
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        {/* Imagem: mão a segurar o telemóvel com o ecrã de pagamento.
            Encostada ao fundo da secção (o braço "nasce" na mesma linha onde o logo é cortado).
            No telemóvel fica depois do texto, também encostada ao fundo. */}
        <div className="relative isolate order-last -mb-20 flex justify-center self-end max-md:hidden sm:-mb-24 lg:order-none">
          <Image
            src={expressImage}
            alt={`Mão a segurar um telemóvel com o ecrã "Pagamentos por referência" do Multicaixa Express: entidade ${ENTITY} – Vertical Telecom, referência e valor preenchidos`}
            sizes="(min-width: 1024px) 440px, 320px"
            placeholder="blur"
            className="h-auto w-[300px] drop-shadow-2xl sm:w-[380px] lg:w-[440px]"
          />
        </div>

        {/* Texto */}
        <div>
          <p className="font-display text-sm font-semibold text-brand-950">
            Novidade
          </p>
          <h2
            id="novidade-titulo"
            className="mt-3 max-w-[560px] type-h2 text-foundation-blue-600"
          >
            Sabia que já pode pagar a sua internet pelo{" "}
            <span className="text-gradient-accent">
              Multicaixa Express ou ATM
            </span>
            ?
          </h2>
          <p className="mt-5 max-w-[560px] type-body text-muted">
            Pague a sua subscrição Umoja Net de forma rápida, segura e sem se
            deslocar a um balcão. Basta seguir estes passos:
          </p>

          <ol className="mt-8 flex max-w-[560px] flex-col gap-4">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 font-display text-sm font-semibold text-brand-950">
                  {i + 1}
                </span>
                <p className="type-body text-muted">
                  {step}
                </p>
              </li>
            ))}
          </ol>

          {/* Ajuda com a referência: encostada à direita, com o contacto em botão destacado */}
          <div className="mt-10 flex max-w-[560px] flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-4">
            <p className="text-center text-sm text-muted sm:text-left">
              Não sabe a sua referência?
            </p>
            <a
              href={PHONE_HREF}
              className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-[60px] bg-brand-950 px-6 type-button text-white shadow-lg shadow-brand-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-900"
            >
              <Phone className="size-4" />
              Peça pelo {PHONE}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
