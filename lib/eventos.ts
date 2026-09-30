/**
 * AGENDA — edite esta lista com os eventos reais.
 *
 * data:       AAAA-MM-DD (eventos com data passada somem sozinhos do site)
 * realizacao: "diamond" (evento do clube) ou "parceria" (a Diamond está presente com um parceiro)
 * acesso:     "vip" (lista VIP do clube) ou "aberto" (aberto ao público)
 * endereco:   o texto que vai para o mapa (Google Maps). Quanto mais completo, mais preciso.
 * foto:       coloque a imagem em public/eventos/ e escreva o caminho, ex.: "/eventos/noite-diamond.jpg"
 *             (formato vertical 4:5 fica melhor; sem foto, o site gera um cartaz automaticamente)
 */
export type Realizacao = "diamond" | "parceria";
export type Acesso = "vip" | "aberto";

export interface Evento {
  id: string;
  nome: string;
  data: string;
  hora: string;
  local: string;
  endereco: string;
  realizacao: Realizacao;
  parceiro?: string;
  acesso: Acesso;
  descricao: string;
  destaques?: string[];
  foto?: string;
  instagram?: string;
}

export const EVENTOS: Evento[] = [
  {
    id: "noite-diamond",
    nome: "Noite Diamond",
    data: "2026-10-17",
    hora: "22h",
    local: "Local a confirmar",
    endereco: "Barra, Salvador - BA",
    realizacao: "diamond",
    acesso: "vip",
    descricao: "A noite oficial do clube: as Angels reunidas, lista VIP e as marcas parceiras da temporada.",
    destaques: ["Lista VIP para o time", "Ativações das marcas parceiras"],
  },
  {
    id: "halloween-angels",
    nome: "Halloween Angels",
    data: "2026-10-31",
    hora: "23h",
    local: "Local a confirmar",
    endereco: "Rio Vermelho, Salvador - BA",
    realizacao: "parceria",
    parceiro: "Produtora parceira",
    acesso: "aberto",
    descricao: "Festa de Halloween com presença das Angels e condições especiais para quem faz parte do clube.",
    destaques: ["Aberto ao público", "Condição especial para o time"],
  },
  {
    id: "brunch-das-angels",
    nome: "Brunch das Angels",
    data: "2026-11-14",
    hora: "12h",
    local: "Local a confirmar",
    endereco: "Pituba, Salvador - BA",
    realizacao: "diamond",
    acesso: "vip",
    descricao: "Um encontro diurno para conexões entre as integrantes, produtores e marcas da cidade.",
    destaques: ["Somente lista", "Conexões com marcas"],
  },
  {
    id: "festa-de-fim-de-ano",
    nome: "Festa de Fim de Ano",
    data: "2026-12-05",
    hora: "22h",
    local: "Local a confirmar",
    endereco: "Salvador - BA",
    realizacao: "parceria",
    parceiro: "Produtora parceira",
    acesso: "aberto",
    descricao: "O encerramento da temporada com a Diamond Angels presente e benefícios para o time.",
  },
];

/** Enquanto esta flag for true, a página avisa que os eventos são exemplos. */
export const EVENTOS_SAO_EXEMPLO = true;

export const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"] as const;
const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const;

/** "2026-10-17" → { dia: "17", mes: "OUT", semana: "Sábado" } */
export function partesData(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  return { dia: String(d).padStart(2, "0"), mes: MESES[m - 1], semana: DIAS[new Date(a, m - 1, d).getDay()] };
}

export const linkMapa = (endereco: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
export const embedMapa = (endereco: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(endereco)}&output=embed`;
