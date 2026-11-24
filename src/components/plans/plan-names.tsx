import Image from "next/image";
import { PlanAccordion } from "./plan-accordion";
// dialetos.jpg: imagem extraída de planpage/Placeholder image.svg.
import dialetosImage from "../../../public/img/planpage/dialetos.jpg";

/**
 * "Por que os nossos planos têm nomes em dialetos africanos?" + acordeão com o significado de cada plano.
 */
export function PlanNames() {
  return (
    <section
      aria-labelledby="dialetos"
      className="mx-auto px-5 py-20 sm:px-8 sm:py-24 lg:px-12 xl:px-[76px]"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_576px] lg:gap-16">
        <div>
          <h2
            id="dialetos"
            className="max-w-[520px] type-h2 text-foundation-blue-600"
          >
            Por que os nossos planos têm nomes em{" "}
            <span className="text-gradient-accent">dialetos africanos?</span>
          </h2>
          <div className="mt-8 flex max-w-[600px] flex-col gap-[30px] type-body text-muted">
            <p>
              Na Umoja Net, acreditamos que a tecnologia deve caminhar lado a
              lado com a nossa identidade. Por isso, cada um dos nossos planos
              carrega um nome africano, cheio de significado e propósito.
            </p>
            <p>
              Não escolhemos esses nomes por acaso. Eles representam valores que
              fazem parte do dia a dia das nossas comunidades: Amizade, União,
              Família, Sabedoria e Prosperidade.
            </p>
          </div>
        </div>
        <Image
          src={dialetosImage}
          alt="Rosto de mulher africana de perfil, com pintura facial tradicional"
          sizes="(min-width: 1024px) 576px, 100vw"
          placeholder="blur"
          className="aspect-[576/340] w-full rounded-3xl object-cover"
          style={{ objectPosition: "80% center" }}
        />
      </div>

      <PlanAccordion />
    </section>
  );
}
