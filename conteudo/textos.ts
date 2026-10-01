/** Textos do site. Tudo que é real e reaproveitado mora aqui. */

export type SecaoId = "porta" | "dentro" | "acesso" | "agenda" | "marcas" | "lista";

export const NAV: { id: SecaoId; rotulo: string }[] = [
  { id: "dentro", rotulo: "O clube" },
  { id: "acesso", rotulo: "O acesso" },
  { id: "agenda", rotulo: "Agenda" },
  { id: "marcas", rotulo: "Para marcas" },
];

export const PILARES = [
  { num: "I", titulo: "Events", texto: "Festas, encontros e ações com entrada facilitada e lista VIP para o time." },
  { num: "II", titulo: "Influence", texto: "O alcance do perfil abre portas com marcas e produtores da cidade." },
  { num: "III", titulo: "Experiences", texto: "Benefícios e vivências pensadas para quem faz parte, dentro e fora das festas." },
] as const;

export type IconeAcesso = "coroa" | "diamante" | "holofote" | "tacas";

/** O que se abre para quem está na lista (cena do pico). */
export const ACESSOS: { icone: IconeAcesso; titulo: string; texto: string }[] = [
  { icone: "coroa", titulo: "Acesso VIP", texto: "Entrada e lista nos eventos do clube e dos parceiros." },
  { icone: "diamante", titulo: "Benefícios exclusivos", texto: "Condições especiais em locais, marcas e serviços parceiros." },
  { icone: "holofote", titulo: "Divulgação", texto: "Seu perfil e sua imagem ganham visibilidade nas ações do clube." },
  { icone: "tacas", titulo: "Conexões", texto: "Convivência com outras mulheres, produtores e marcas da cidade." },
];

export const PASSOS_ENTRAR = [
  { titulo: "Seu nome na lista", texto: "Escreva seu nome e toque em confirmar." },
  { titulo: "A mensagem sai pronta", texto: "O WhatsApp da Diamond abre com o seu pedido já escrito." },
  { titulo: "A equipe responde", texto: "Você recebe as próximas etapas para entrar no time." },
] as const;

export const SERVICOS = [
  { titulo: "No perfil", texto: "Posts, stories e reels no @diamondangels3." },
  { titulo: "Nos eventos", texto: "Time de promotoria na porta, no salão e nas ações de rua." },
  { titulo: "Em parceria", texto: "Benefícios para o time em troca de visibilidade para a marca." },
] as const;

export const FLUXO = ["Formulário", "Proposta", "Ação", "Relatório"] as const;
