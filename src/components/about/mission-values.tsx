import type { ComponentType, ReactNode, SVGProps } from "react";
import { Eye, Gem, Heart } from "@/components/icons";

/** Missão, visão e valores. */
const values = [
  { title: "Humanidade", text: "Atendemos pessoas, não números. O respeito está sempre em primeiro lugar." },
  { title: "Transparência", text: "Comunicação clara, direta e sincera em todas as etapas." },
  { title: "Inovação com propósito", text: "Tecnologia é importante, mas só faz sentido quando melhora vidas." },
  { title: "Cultura e Identidade", text: "Temos orgulho das nossas raízes e levamos esse orgulho para o nosso serviço." },
];

function Card({
  icon: Icon,
  title,
  titleId,
  children,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  titleId: string;
  children: ReactNode;
}) {
  return (
    <article aria-labelledby={titleId} className="rounded-3xl border border-line bg-white p-6 sm:p-8">
      <span className="grid size-11 place-items-center rounded-xl border border-brand-100 bg-brand-50 text-brand-950">
        <Icon className="size-5" />
      </span>
      <h3 id={titleId} className="mt-6 type-h3 text-foundation-blue-600">
        {title}
      </h3>
      {children}
    </article>
  );
}

export function MissionValues() {
  return (
    <section aria-label="Missão, visão e valores" className="mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-[76px] py-20 sm:py-28">
      <div className="grid gap-6 md:grid-cols-2">
        <Card icon={Gem} title="A nossa missão" titleId="missao">
          <p className="mt-3 type-body text-muted">
            Levar internet fiável, acessível e humana a pessoas, famílias e negócios, criando ligações que impulsionam o
            estudo, o trabalho, o entretenimento e a inclusão digital em Angola.
          </p>
        </Card>
        <Card icon={Eye} title="A nossa visão" titleId="visao">
          <p className="mt-3 type-body text-muted">
            Tornar-nos a provedora de internet mais humana e culturalmente consciente de Angola, reconhecida pela
            proximidade com as pessoas e pela qualidade dos nossos serviços.
          </p>
        </Card>
      </div>

      <div className="mt-6">
        <Card icon={Heart} title="Os valores que guiam o nosso trabalho" titleId="valores">
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <li key={v.title} className="rounded-2xl bg-surface p-6">
                <p className="font-display font-semibold text-foundation-blue-600">{v.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
