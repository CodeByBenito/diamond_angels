/**
 * AGENDA — edite esta lista com os eventos reais.
 *
 * data:       AAAA-MM-DD (eventos com data passada somem sozinhos do site)
 * realizacao: "diamond" (evento do clube) ou "parceria" (a Diamond está presente com um parceiro)
 * acesso:     "vip" (lista VIP do clube) ou "aberto" (aberto ao público)
 * endereco:   o texto que vai para o mapa (Google Maps). Quanto mais completo, mais preciso.
 * atracoes:   o line-up, na ordem do flyer (aparece no detalhe do evento e vai para o Google)
 * foto:       coloque a imagem em public/eventos/, rode `npm run imagens` e aponte para o .webp,
 *             ex.: "/eventos/noite-diamond.webp" (flyer vertical 9:16 fica perfeito; sem foto, o site gera um cartaz)
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
  atracoes?: string[];
  foto?: string;
  instagram?: string;
}

export const EVENTOS: Evento[] = [
  {
    id: "aquele-pagode-2026-10-01",
    nome: "Aquele Pagode",
    data: "2026-10-01",
    hora: "19h",
    local: "Sotero Beach Bar",
    endereco: "Avenida Octávio Mangabeira, 0018, Orla de Piatã, Salvador - BA",
    realizacao: "parceria",
    acesso: "vip",
    descricao: "Quinta de pagode na orla de Piatã, no Sotero Beach Bar, com a Diamond Angels presente e lista VIP para o time.",
    atracoes: ["Nei D'Resenha", "Swing do Grandão", "Cachorro Louco", "DJ Laan"],
    destaques: ["Lista VIP Diamond", "Petiscos dobrados até as 22h", "Amstel 600 ml dobrada até as 22h"],
    foto: "/eventos/aquele-pagode.webp",
  },
  {
    id: "meu-samba-2026-10-02",
    nome: "Meu Samba",
    data: "2026-10-02",
    hora: "18h",
    local: "Sotero Beach Bar",
    endereco: "Avenida Octávio Mangabeira, 0018, Orla de Piatã, Salvador - BA",
    realizacao: "parceria",
    acesso: "vip",
    descricao: "Sexta de samba na orla de Piatã, no Sotero Beach Bar, com a Diamond Angels presente e lista VIP para o time.",
    atracoes: ["Noelson do Cavaco", "Pagode do RT", "DJ Laan"],
    destaques: ["Lista VIP Diamond", "Petiscos dobrados até as 22h", "Amstel 600 ml dobrada até as 22h"],
    foto: "/eventos/meu-samba.webp",
  },
  {
    id: "baile-do-fz-2026-10-02",
    nome: "Baile do FZ",
    data: "2026-10-02",
    hora: "22h",
    local: "Space Lounge Bar",
    endereco: "Rua João Gomes, 95, Rio Vermelho, Salvador - BA",
    realizacao: "parceria",
    acesso: "vip",
    descricao: "Sexta de baile no Space Lounge Bar, no Rio Vermelho, com a Diamond Angels presente e lista VIP para o time.",
    atracoes: ["Oh Maridão", "DJ da Putaria", "DJ Amós", "Cachorro Louco", "Tinho Oh Drama", "Mano RT"],
    destaques: ["Lista VIP Diamond"],
    foto: "/eventos/baile-do-fz.webp",
  },
  {
    id: "o-primeiro-baile-2026-10-03",
    nome: "O Primeiro Baile",
    data: "2026-10-03",
    hora: "21h",
    local: "Dell Rio Lounge Bar",
    endereco: "Avenida Aliomar Baleeiro, 4418, Sete de Abril, Salvador - BA",
    realizacao: "parceria",
    acesso: "vip",
    descricao:
      "A inauguração do Dell Rio Lounge Bar, com a Diamond Angels presente e lista VIP para o time. Ingressos à venda na Ingra.",
    atracoes: [
      "Boladin 211",
      "Jaya Luuck",
      "Tinho Oh Drama",
      "Dejota na Voz",
      "Papo de Cria",
      "Alves 071",
      "After com DJ Sidof",
      "DJ Amós",
    ],
    destaques: ["Lista VIP Diamond", "Inauguração do Dell Rio Lounge Bar"],
    foto: "/eventos/o-primeiro-baile.webp",
  },
  {
    id: "baile-do-rh-2026-10-03",
    nome: "Baile do RH",
    data: "2026-10-03",
    hora: "22h",
    local: "Arena Beach Stella Maris",
    endereco: "Arena Beach, Stella Maris, Salvador - BA",
    realizacao: "parceria",
    acesso: "vip",
    descricao: "Baile do RH na Arena Beach Stella Maris, com a Diamond Angels presente e lista VIP para o time.",
    destaques: ["Lista VIP Diamond"],
  },
  {
    id: "encontro-dos-amigos-2026-10-04",
    nome: "Encontro dos Amigos",
    data: "2026-10-04",
    hora: "18h",
    local: "Sotero Beach Bar",
    endereco: "Avenida Octávio Mangabeira, 0018, Orla de Piatã, Salvador - BA",
    realizacao: "parceria",
    acesso: "vip",
    descricao: "Domingo na orla de Piatã, no Sotero Beach Bar, com a Diamond Angels presente e lista VIP para o time.",
    atracoes: ["O Maggo", "Major Gui", "Mano RT", "Gabo", "DJ Amós", "Jairinho"],
    destaques: ["Lista VIP Diamond"],
    foto: "/eventos/encontro-dos-amigos.webp",
  },
];

/**
 * Enquanto esta flag for true, a página avisa que os eventos são exemplos
 * e eles NÃO são enviados ao Google como eventos (dados estruturados).
 */
export const EVENTOS_SAO_EXEMPLO = false;
