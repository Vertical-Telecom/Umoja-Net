import { LUANDA_SIZE, luandaMunicipios } from "@/data/luanda-map";

/**
 * "Nossa rede em expansão": mapa de Luanda (tirado do dashboard do Centro de Operações)
 * com os bairros onde a Umoja Net já está e para onde vai a seguir.
 * No mapa, os municípios com bairros ativos ficam preenchidos e os previstos ficam tracejados.
 * PENDENTE (cronograma, ponto 3): secção da Home ou página própria.
 * PENDENTE: as posições [x, y] dos bairros são aproximadas (coordenadas do mapa original); confirmar com o cliente.
 */
type Area = {
  name: string;
  active: boolean;
  /** Município (do mapa) onde fica o bairro. */
  municipio: string;
  x: number;
  y: number;
  labelLeft?: boolean;
};

const areas: Area[] = [
  { name: "Angonap", active: true, municipio: "Viana", x: 925, y: 470 },
  { name: "Zango", active: true, municipio: "Viana", x: 1010, y: 585 },
  { name: "Cazenga", active: true, municipio: "Cazenga", x: 800, y: 245 },
  { name: "Luanda Sul", active: true, municipio: "Talatona", x: 530, y: 470 },
  { name: "Cacuaco", active: false, municipio: "Cacuaco", x: 930, y: 110 },
  { name: "Talatona", active: false, municipio: "Talatona", x: 480, y: 545 },
  {
    name: "Kapalanca",
    active: false,
    municipio: "Viana",
    x: 845,
    y: 450,
    labelLeft: true,
  },
  { name: "Viana-Vila", active: false, municipio: "Viana", x: 900, y: 395 },
  { name: "Kilamba", active: false, municipio: "Kilamba", x: 720, y: 690 },
  { name: "Benfica", active: false, municipio: "Belas", x: 430, y: 650 },
  { name: "Fubú", active: false, municipio: "Belas", x: 545, y: 700 },
  { name: "Ramiros", active: false, municipio: "Belas", x: 330, y: 860 },
];

const activeAreas = areas.filter((a) => a.active);
const plannedAreas = areas.filter((a) => !a.active);

type Status = "ativo" | "previsto" | "fora";
/** Um município com pelo menos um bairro ativo conta como "onde estamos". */
const municipioStatus = (name: string): Status => {
  const inMun = areas.filter((a) => a.municipio === name);
  if (inMun.some((a) => a.active)) return "ativo";
  return inMun.length ? "previsto" : "fora";
};

const fillByStatus: Record<Status, string> = {
  ativo: "fill-brand-500/30",
  previsto: "fill-[url(#rede-previsto)]",
  fora: "fill-white",
};

function Pin({ area }: { area: Area }) {
  const { x, y, active, name, labelLeft } = area;
  return (
    <g transform={`translate(${x} ${y})`}>
      {active && (
        <circle
          r="18"
          className="fill-brand-500/40 motion-safe:animate-ping"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      )}
      <circle
        r="15"
        className={
          active ? "fill-brand-600 stroke-white" : "fill-white stroke-brand-600"
        }
        strokeWidth={active ? 5 : 4}
        strokeDasharray={active ? undefined : "6 5"}
      />
      {active && <circle r="5" className="fill-white" />}
      <text
        x={labelLeft ? -26 : 26}
        y="1"
        dominantBaseline="middle"
        textAnchor={labelLeft ? "end" : "start"}
        // Tamanho em unidades do mapa: no telemóvel o mapa fica pequeno, por isso a letra sobe.
        className={`font-sans text-[40px] font-medium sm:text-[32px] lg:text-[26px] ${
          active ? "fill-ink" : "fill-muted"
        }`}
        paintOrder="stroke"
        stroke="#ffffff"
        strokeWidth={9}
        strokeLinejoin="round"
      >
        {name}
      </text>
    </g>
  );
}

export function Network() {
  return (
    <section
      id="rede"
      aria-labelledby="rede-titulo"
      className="relative z-10 -mt-12 rounded-t-[3rem] bg-white px-5 pt-20 pb-24 sm:px-8 sm:pt-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2
          id="rede-titulo"
          className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
        >
          Nossa rede em expansão:
          <br />
          Veja <span className="text-brand-500">onde estamos</span> e{" "}
          <span className="text-brand-500">onde estaremos</span>
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
          Onde já atuamos, onde estamos a crescer e quais regiões vamos alcançar
          nos próximos passos.
        </p>
      </div>

      <svg
        viewBox={`0 0 ${LUANDA_SIZE.width} ${LUANDA_SIZE.height}`}
        role="img"
        aria-label={`Mapa de Luanda com a cobertura da Umoja Net: já disponível em ${activeAreas
          .map((a) => a.name)
          .join(
            ", ",
          )}; brevemente em ${plannedAreas.map((a) => a.name).join(", ")}.`}
        className="mx-auto mt-12 block h-auto w-full max-w-[620px]"
      >
        <defs>
          {/* Tracejado diagonal dos municípios "onde estaremos" */}
          <pattern
            id="rede-previsto"
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="16" height="16" className="fill-brand-50" />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="16"
              className="stroke-brand-300"
              strokeWidth="5"
            />
          </pattern>
        </defs>
        <g aria-hidden="true">
          {luandaMunicipios.map((m) => (
            <path
              key={m.name}
              d={m.d}
              className={`stroke-brand-600 ${fillByStatus[municipioStatus(m.name)]}`}
              strokeWidth={2.5}
              strokeLinejoin="round"
            >
              <title>{m.name}</title>
            </path>
          ))}
          {luandaMunicipios.map((m) => {
            const [x, y, angle, size] = m.label;
            return (
              <text
                key={m.name}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={angle ? `rotate(${angle} ${x} ${y})` : undefined}
                className="pointer-events-none fill-brand-900/35 font-mono uppercase"
                style={{
                  fontSize: Math.max(size * 0.55, 11),
                  letterSpacing: 1,
                }}
              >
                {m.name}
              </text>
            );
          })}
          {areas.map((area) => (
            <Pin key={area.name} area={area} />
          ))}
        </g>
      </svg>

      {/* Legenda */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-4 rounded border-2 border-brand-600 bg-brand-500/30"
          />
          Onde estamos
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-4 rounded border-2 border-brand-600 bg-[repeating-linear-gradient(45deg,var(--color-brand-300)_0_2px,var(--color-brand-50)_2px_5px)]"
          />
          Onde estaremos
        </span>
      </div>
    </section>
  );
}
