/** Links e textos compartilhados. Tudo que é real e reaproveitado mora aqui. */
export const LINKS = {
  agencia: "https://instagram.com/bwagency7",
  clube: "https://instagram.com/diamondangels3",
  fundadora: "https://instagram.com/bruwolker",
} as const;

export type SecaoId = "inicio" | "clube" | "beneficios" | "eventos" | "marcas";

export const NAV: { id: SecaoId; rotulo: string }[] = [
  { id: "clube", rotulo: "O clube" },
  { id: "beneficios", rotulo: "Benefícios" },
  { id: "eventos", rotulo: "Eventos" },
  { id: "marcas", rotulo: "Para marcas" },
];

export const PILARES = [
  { num: "I", titulo: "Events", texto: "Festas, encontros e ações com entrada facilitada e lista VIP para o time." },
  { num: "II", titulo: "Influence", texto: "O alcance do perfil abre portas com marcas e produtores da cidade." },
  { num: "III", titulo: "Experiences", texto: "Benefícios e vivências pensadas para quem faz parte, dentro e fora das festas." },
] as const;

export type IconeId = "coroa" | "diamante" | "megafone" | "conexao";

export const BENEFICIOS: { icone: IconeId; titulo: string; texto: string }[] = [
  { icone: "coroa", titulo: "Acesso VIP", texto: "Entrada e lista nos eventos do clube e dos parceiros." },
  { icone: "diamante", titulo: "Benefícios exclusivos", texto: "Condições especiais em locais, marcas e serviços parceiros." },
  { icone: "megafone", titulo: "Divulgação", texto: "Seu perfil e sua imagem ganham visibilidade nas ações do clube." },
  { icone: "conexao", titulo: "Conexões", texto: "Convivência com outras mulheres, produtores e marcas da cidade." },
];

export const PASSOS_ENTRAR = [
  { titulo: "Chame a equipe", texto: "Mande uma mensagem para @bwagency7 no Instagram." },
  { titulo: "Conte sobre você", texto: "Um pouco de quem você é e dos eventos que curte." },
  { titulo: "Receba as próximas etapas", texto: "A equipe retorna com o passo a passo para entrar no time." },
] as const;

export const SERVICOS = [
  { titulo: "No perfil", texto: "Posts, stories e reels no @diamondangels3 para 15,6 mil seguidoras." },
  { titulo: "Nos eventos", texto: "Time de promotoria na porta, no salão e nas ações de rua." },
  { titulo: "Em parceria", texto: "Benefícios para o time em troca de visibilidade para a marca." },
] as const;

export const FLUXO = ["Formulário", "Proposta", "Ação", "Relatório"] as const;
