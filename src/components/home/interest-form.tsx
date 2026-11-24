"use client";

import { useState, type ComponentType, type FormEvent, type ReactNode, type SVGProps } from "react";
import { internetPlans, tvPackages } from "@/data/plans";
import { luandaMunicipios } from "@/data/luanda-map";
import { Check, Locate, MapIcon, MapPin, Spinner, Target, User, Whatsapp } from "@/components/icons";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * PENDENTE: ainda não há sistema (CRM/e-mail) para receber os pedidos.
 * Por agora o formulário abre o WhatsApp da Umoja Net com a mensagem já preenchida.
 */
const WHATSAPP = "244973088155";

/** As 21 províncias de Angola (divisão de 2024). */
const provinces = [
  "Bengo",
  "Benguela",
  "Bié",
  "Cabinda",
  "Cuando",
  "Cubango",
  "Cuanza Norte",
  "Cuanza Sul",
  "Cunene",
  "Huambo",
  "Huíla",
  "Icolo e Bengo",
  "Luanda",
  "Lunda Norte",
  "Lunda Sul",
  "Malanje",
  "Moxico",
  "Moxico Leste",
  "Namibe",
  "Uíge",
  "Zaire",
];

const services = ["Internet Simples", "Internet + TV"];

const field =
  "w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink placeholder:text-muted/60 transition-colors focus:border-brand-950 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-brand-950 disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted";
const input = `${field} h-12`;

function Group({ icon: Icon, title, children }: { icon: Icon; title: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="flex w-full items-center gap-2 border-b border-line pb-3 font-display text-base font-semibold text-brand-950">
        <Icon className="size-4" />
        {title}
      </legend>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  htmlFor,
  required,
  hint,
  wide,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-foundation-purple-900">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-accent-600">
            *
          </span>
        )}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

type Coords = { lat: number; lng: number };

/** Vista inicial do mapa: cidade de Luanda (oeste, sul, este, norte). */
const LUANDA_BBOX = "13.120,-8.950,13.360,-8.770";

/**
 * "Tem interesse?": formulário de pedido de adesão (Contacto · Interesse · Localização · Geolocalização),
 * ao estilo do formulário "Adicionar interesse" enviado.
 */
export function InterestForm() {
  const [service, setService] = useState("");
  const [province, setProvince] = useState("Luanda");
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setGeoError("O seu navegador não permite partilhar a localização.");
      return;
    }
    setLocating(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setGeoError("Não foi possível obter a localização. Verifique a permissão do navegador.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    if (!get("nome")) return setError("Indique o seu nome completo.");
    if (!get("telefone") && !get("email")) return setError("Indique um telefone ou um e-mail para o podermos contactar.");
    setError("");

    const lines = [
      "Olá, Umoja Net! Tenho interesse nos vossos serviços.",
      "",
      `Nome: ${get("nome")}`,
      get("telefone") && `Telefone: ${get("telefone")}`,
      get("email") && `E-mail: ${get("email")}`,
      get("contacto") && `Melhor altura para contacto: ${get("contacto").replace("T", " ")}`,
      get("servico") && `Serviço: ${get("servico")}`,
      get("plano") && `Plano de internet: ${get("plano")}`,
      get("tv") && `Plano TV: ${get("tv")}`,
      `Localização: ${[get("endereco"), get("zona"), get("municipio"), get("provincia")].filter(Boolean).join(", ")}`,
      get("referencia") && `Referência: ${get("referencia")}`,
      coords && `Mapa: https://maps.google.com/?q=${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`,
    ].filter(Boolean);

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    setSent(true);
  };

  // Antes de partilhar a localização o mapa mostra Luanda; depois aproxima e marca a casa do cliente.
  const mapSrc = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${[coords.lng - 0.006, coords.lat - 0.004, coords.lng + 0.006, coords.lat + 0.004]
        .map((n) => n.toFixed(6))
        .join(",")}&layer=mapnik&marker=${coords.lat},${coords.lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=${LUANDA_BBOX}&layer=mapnik`;

  return (
    <section
      id="interesse"
      aria-labelledby="interesse-titulo"
      className="mx-auto w-full px-5 py-20 sm:px-8 sm:py-24 lg:px-12 xl:px-[76px]"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-display text-sm font-semibold text-brand-950">Adira já</p>
        <h2
          id="interesse-titulo"
          className="mt-3 type-h2 text-foundation-blue-600"
        >
          Tem interesse? <span className="text-gradient-accent">Nós ligamos</span> para si.
        </h2>
        <p className="mx-auto mt-4 max-w-xl type-subtitle text-foundation-blue-200">
          Deixe os seus dados e a sua localização. A nossa equipa verifica a cobertura e entra em contacto consigo.
        </p>
      </div>

      <form
        noValidate
        onSubmit={onSubmit}
        className="mt-12 rounded-3xl border-2 border-white bg-[#f3f2f7] p-6 shadow-[0_8px_30px_rgb(23_7_51/0.06)] sm:p-10"
      >
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
          {/* Contacto */}
          <Group icon={User} title="Contacto">
            <Field label="Nome completo" htmlFor="f-nome" required wide>
              <input id="f-nome" name="nome" autoComplete="name" required className={input} />
            </Field>
            <Field label="Telefone" htmlFor="f-telefone">
              <input
                id="f-telefone"
                name="telefone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+244 9XX XXX XXX"
                className={input}
              />
            </Field>
            <Field label="E-mail" htmlFor="f-email">
              <input id="f-email" name="email" type="email" autoComplete="email" className={input} />
            </Field>
            <Field label="Melhor altura para o contactarmos" htmlFor="f-contacto" hint="Opcional" wide>
              <input id="f-contacto" name="contacto" type="datetime-local" className={input} />
            </Field>
          </Group>

          {/* Interesse */}
          <Group icon={Target} title="Interesse">
            <Field label="Serviço" htmlFor="f-servico" wide>
              <select
                id="f-servico"
                name="servico"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className={input}
              >
                <option value="">Escolha um serviço (opcional)</option>
                {services.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Plano de Internet" htmlFor="f-plano" wide>
              <select id="f-plano" name="plano" className={input} disabled={service === "Internet + TV"}>
                <option value="">Plano de internet (opcional)</option>
                {internetPlans.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} · {p.download} Mbps
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Plano TV" htmlFor="f-tv" wide>
              <select id="f-tv" name="tv" className={input} disabled={service === "Internet Simples"}>
                <option value="">Plano TV (opcional)</option>
                {tvPackages.map((p) => (
                  <option key={p.id} value={`${p.name} ${p.speed} Mbps`}>
                    {p.name} · {p.speed} Mbps · {p.price}
                  </option>
                ))}
              </select>
            </Field>
          </Group>

          {/* Localização */}
          <Group icon={MapPin} title="Localização">
            <Field label="Endereço" htmlFor="f-endereco" wide>
              <input
                id="f-endereco"
                name="endereco"
                autoComplete="street-address"
                placeholder="Rua, casa ou edifício"
                className={input}
              />
            </Field>
            <Field label="Província" htmlFor="f-provincia">
              <select
                id="f-provincia"
                name="provincia"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className={input}
              >
                {provinces.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Município" htmlFor="f-municipio">
              {province === "Luanda" ? (
                <select id="f-municipio" name="municipio" className={input}>
                  <option value="">Escolha o município</option>
                  {luandaMunicipios.map((m) => (
                    <option key={m.name}>{m.name}</option>
                  ))}
                </select>
              ) : (
                <input id="f-municipio" name="municipio" placeholder="Município" className={input} />
              )}
            </Field>
            <Field label="Zona / Bairro" htmlFor="f-zona" wide>
              <input id="f-zona" name="zona" placeholder="Ex.: Kilamba, Zango, Talatona…" className={input} />
            </Field>
            <Field label="Referência" htmlFor="f-referencia" hint="Pontos de referência para facilitar a localização" wide>
              <textarea
                id="f-referencia"
                name="referencia"
                rows={3}
                placeholder="Ex.: Próximo ao mercado municipal, portão azul, 2.º andar…"
                className={`${field} resize-y py-3`}
              />
            </Field>
          </Group>

          {/* Geolocalização */}
          <Group icon={MapIcon} title="Geolocalização">
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-medium text-foundation-purple-900">A sua localização (opcional)</p>
              <div className="relative h-[300px] overflow-hidden rounded-2xl border border-line bg-[#f3f2f7]">
                <iframe
                  title={coords ? "Mapa com a sua localização" : "Mapa de Luanda"}
                  src={mapSrc}
                  className="absolute inset-0 size-full"
                  loading="lazy"
                />
                {!coords && (
                  // No topo, à direita do zoom: em baixo fica a atribuição do OpenStreetMap (obrigatória).
                  <p className="pointer-events-none absolute top-3 right-3 flex max-w-[calc(100%-4.25rem)] items-center gap-2 rounded-2xl bg-white/95 py-1.5 pr-4 pl-2 text-xs text-foundation-purple-900 shadow-md sm:text-sm">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-950">
                      <MapPin className="size-3.5" />
                    </span>
                    Partilhe a sua localização para marcarmos a sua casa no mapa.
                  </p>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted" aria-live="polite">
                  {coords
                    ? `Localização obtida: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                    : geoError || "Só usamos a localização para este pedido."}
                </p>
                <button
                  type="button"
                  onClick={locate}
                  disabled={locating}
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-brand-950 bg-white px-5 font-display text-sm font-semibold text-brand-950 transition-colors hover:bg-brand-50 disabled:cursor-wait"
                >
                  {locating ? <Spinner className="size-4 animate-spin" /> : <Locate className="size-4" />}
                  {coords ? "Atualizar localização" : "Usar a minha localização"}
                </button>
              </div>
            </div>
          </Group>
        </div>

        {/* Envio */}
        <div className="mt-10 flex flex-col items-stretch gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted" role={error ? "alert" : undefined}>
            {error ? (
              <span className="font-medium text-accent-600">{error}</span>
            ) : sent ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-success">
                <Check className="size-4" /> Obrigado! Termine o envio no WhatsApp e entraremos em contacto.
              </span>
            ) : (
              <>
                Campos com <span className="text-accent-600">*</span> são obrigatórios.
              </>
            )}
          </p>
          <button
            type="submit"
            className="group inline-flex h-14 cursor-pointer items-center justify-center gap-2.5 rounded-[60px] bg-brand-950 px-8 type-button text-white shadow-lg shadow-brand-950/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-900"
          >
            <Whatsapp className="size-5" />
            Enviar pedido
          </button>
        </div>
      </form>
    </section>
  );
}
