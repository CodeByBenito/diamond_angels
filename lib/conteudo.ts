/** Links e textos compartilhados. Tudo que é real e reaproveitado mora aqui. */
export const LINKS = {
  agencia: "https://instagram.com/bwagency7",
  clube: "https://instagram.com/diamondangels3",
  fundadora: "https://instagram.com/bruwolker",
} as const;

export type AtoId = "inicio" | "camarim" | "porta" | "lineup" | "caminhos" | "chamada";

/** A ordem do desfile. A numeração é real: é a ordem em que a página conta a história. */
export const ATOS: { id: AtoId; num: string; nome: string }[] = [
  { id: "inicio", num: "01", nome: "Luzes" },
  { id: "camarim", num: "02", nome: "Camarim" },
  { id: "porta", num: "03", nome: "A porta" },
  { id: "lineup", num: "04", nome: "Line-up" },
  { id: "caminhos", num: "05", nome: "Duas portas" },
  { id: "chamada", num: "06", nome: "Última chamada" },
];

export const LOOKS = [
  { num: "01", titulo: "Events", texto: "Festas, encontros e ações com entrada facilitada e lista VIP para o time." },
  { num: "02", titulo: "Influence", texto: "O alcance do perfil abre portas com marcas e produtores da cidade." },
  { num: "03", titulo: "Experiences", texto: "Benefícios e vivências pensadas para quem faz parte, dentro e fora das festas." },
] as const;

export const BENEFICIOS = [
  { titulo: "Acesso VIP", texto: "Entrada e lista nos eventos do clube e dos parceiros." },
  { titulo: "Benefícios exclusivos", texto: "Condições especiais em locais, marcas e serviços parceiros." },
  { titulo: "Divulgação", texto: "Seu perfil e sua imagem ganham visibilidade nas ações do clube." },
  { titulo: "Conexões", texto: "Convivência com outras mulheres, produtores e marcas da cidade." },
] as const;

export const SERVICOS = [
  { titulo: "No perfil", texto: "Posts, stories e reels no @diamondangels3." },
  { titulo: "Nos eventos", texto: "Time de promotoria na porta, no salão e nas ações de rua." },
  { titulo: "Em parceria", texto: "Benefícios para o time em troca de visibilidade para a marca." },
] as const;
