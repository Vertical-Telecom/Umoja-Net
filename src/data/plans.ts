/**
 * Planos e pacotes.
 * PENDENTE (cronograma, ponto 1): confirmar preços e velocidades dos 5 planos de Internet Simples
 * O separador Internet+TV mostra os pacotes DSTV Stream (tvPackages).
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
    download: 8,
    upload: 4,
    price: "19.999 Kz",
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
    download: 10,
    upload: 5,
    price: "22.999 Kz",
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
    download: 20,
    upload: 10,
    price: "28.999 Kz",
    idealFor: [
      "Casas com vários dispositivos",
      "Streaming HD",
      "Videochamadas constantes",
      "Estudos e trabalho remoto",
    ],
  },
  /*
   * PENDENTE: os 2 planos seguintes são marcadores de lugar (são 5 planos no total).
   * Falta o cliente enviar o nome africano, a frase, as velocidades e o preço de cada um.
   * Pelo texto da página Planos, devem corresponder aos valores "Sabedoria" e "Prosperidade".
   */
  {
    id: "nzai",
    name: "Plano N'zai",
    tagline: "Força e resiliência para enfrentar os desafios do dia a dia.",
    download: 30,
    upload: 15,
    price: "Consultar preço",
    idealFor: [
      "Famílias numerosas",
      "Streaming em 4K",
      "Jogos online",
      "Pequenos escritórios",
    ],
  },
  {
    id: "nvuama",
    name: "Plano N'vuama",
    tagline: "Velocidade e estabilidade para impulsionar o seu sucesso.",
    download: 50,
    upload: 20,
    price: "Consultar preço",
    idealFor: [
      "Muitos dispositivos ao mesmo tempo",
      "Downloads pesados",
      "Transmissões ao vivo",
      "Empresas e negócios",
    ],
  },
];

export type TvPackage = {
  id: string;
  name: string;
  /** Download em Mbps. */
  speed: number;
  /** Upload em Mbps. Se faltar, usa o upload do plano de Internet Simples com a mesma velocidade. */
  upload?: number;
  price: string;
  featured?: boolean;
};

export const tvPackages: TvPackage[] = [
  { id: "ukumba", name: "Pacote DSTV Grande +", speed: 8, price: "33.000.00 Kz" },
  { id: "umunga", name: "Pacote DSTV Bué", speed: 10, price: "41.800.00 Kz", featured: true },
  { id: "muige", name: "Pacote DSTV Bué", speed: 20, price: "50.999.00 Kz" },
];
