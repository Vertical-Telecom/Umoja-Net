/**
 * Planos e pacotes.
 * PENDENTE (cronograma, ponto 1): os 3 planos de Internet Simples aparecem
 * todos com 28.999 Kz no design — confirmar valores reais com o cliente.
 * PENDENTE (ponto 2): o conteúdo do separador Internet+TV não existe no design;
 * por agora usa os pacotes DSTV Stream.
 */

export type Plan = {
  id: string;
  name: string;
  tagline: string;
  download: number;
  upload?: number;
  price: string;
  idealFor: string[];
  featured?: boolean;
};

export const internetPlans: Plan[] = [
  {
    id: "ukamba",
    name: "Plano Ukamba",
    tagline: "Não importa a distância, estamos sempre ligados.",
    download: 6,
    upload: 4,
    price: "28.999 Kz",
    idealFor: [
      "Redes sociais",
      "Navegação leve",
      "Videochamadas básicas",
      "Uso diário individual",
    ],
  },
  {
    id: "omunga",
    name: "Plano Omunga",
    tagline: "A grandeza da nossa união leva-nos além.",
    download: 8,
    upload: 4,
    price: "28.999 Kz",
    featured: true,
    idealFor: [
      "Streaming leve",
      "Teletrabalho básico",
      "Navegação diária",
      "Uso diário coletivo",
    ],
  },
  {
    id: "muige",
    name: "Plano Muige",
    tagline: "O verdadeiro valor está nos laços que construímos.",
    download: 10,
    upload: 5,
    price: "28.999 Kz",
    idealFor: [
      "Casas com vários dispositivos",
      "Streaming HD",
      "Videochamadas constantes",
      "Estudos e trabalho remoto",
    ],
  },
];

export type TvPackage = {
  id: string;
  name: string;
  speed: number;
  price: string;
  featured?: boolean;
};

export const tvPackages: TvPackage[] = [
  { id: "tv-6", name: "Pacote Grande", speed: 6, price: "25.999 Kz" },
  { id: "tv-8", name: "Pacote Grande", speed: 8, price: "29.999 Kz", featured: true },
  { id: "tv-10", name: "Pacote Grande", speed: 10, price: "32.999 Kz" },
  { id: "tv-20", name: "Pacote Grande", speed: 20, price: "38.999 Kz" },
];

export const internetTvPlans: Plan[] = tvPackages.map((p) => ({
  id: p.id,
  name: `${p.name} ${p.speed} Mbps`,
  tagline: `Pacote Grande da DSTV Stream incluso num único plano de ${p.speed} Mbps.`,
  download: p.speed,
  price: p.price,
  featured: p.featured,
  idealFor: [
    "Internet ilimitada",
    "DSTV Stream incluído",
    "Filmes, séries e futebol",
    "Canais ao vivo",
  ],
}));
