/**
 * DIAMOND ICONS — o conjunto de ícones próprio da Diamond Angels.
 *
 * Regras do desenho (para criar ícones novos no mesmo padrão):
 *  - Grade de 24×24, área útil de 3 a 21 (margem de 3).
 *  - Traço de 1,5 com pontas e junções arredondadas, sem preenchimento.
 *  - Cantos em CHANFRO de 45° (o corte do diamante do logo) no lugar de cantos redondos.
 *  - Losango ◆ como detalhe de marca (no pino do mapa, no cadeado, na coroa).
 *  - Brilhos de 4 pontas são o único elemento preenchido (`fill="currentColor"`).
 *
 * Cada ícone tem um nome (chave), um rótulo em português (para leitores de tela e para o catálogo)
 * e o desenho. Os desenhos viram <symbol> num sprite único (SpriteIcones) e são usados por <Icone nome="..." />.
 */

const brilho = (x: number, y: number, r: number) =>
  `M${x} ${y - r}c${r * 0.18} ${r * 0.62} ${r * 0.38} ${r * 0.82} ${r} ${r}c${-r * 0.62} ${r * 0.18} ${-r * 0.82} ${r * 0.38} ${-r} ${r}c${-r * 0.18} ${-r * 0.62} ${-r * 0.38} ${-r * 0.82} ${-r} ${-r}c${r * 0.62} ${-r * 0.18} ${r * 0.82} ${-r * 0.38} ${r} ${-r}z`;

export const ICONES = {
  /* ------------------------------------------------ Acessos (o que se abre para quem está na lista) */
  coroa: {
    rotulo: "Acesso VIP",
    grupo: "Acessos",
    desenho: (
      <>
        <path d="M5.4 16.5 4 8.6l4.4 3.2L12 5.6l3.6 6.2L20 8.6l-1.4 7.9z" />
        <path d="M5.4 19.5h13.2" />
        <path d="m12 11.6 1.3 1.5-1.3 1.5-1.3-1.5z" />
      </>
    ),
  },
  diamante: {
    rotulo: "Benefícios exclusivos",
    grupo: "Acessos",
    desenho: (
      <>
        <path d="M7.2 4.5h9.6L20.5 9 12 20 3.5 9z" />
        <path d="M3.5 9h17" />
        <path d="M7.2 4.5 9.6 9 12 4.5 14.4 9l2.4-4.5M9.6 9 12 20l2.4-11" />
      </>
    ),
  },
  holofote: {
    rotulo: "Divulgação",
    grupo: "Acessos",
    desenho: (
      <>
        <path d="M9.6 3.5h4.8l1.3 3H8.3z" />
        <path d="M8.6 9 4.8 18.4M15.4 9l3.8 9.4" />
        <path d="M3.8 20.5h16.4" />
        <path d={brilho(12, 14.4, 2.6)} fill="currentColor" stroke="none" />
      </>
    ),
  },
  tacas: {
    rotulo: "Conexões",
    grupo: "Acessos",
    desenho: (
      <>
        <path d="M4.6 5.2h4.2l-.3 4.6a1.8 1.8 0 0 1-3.6 0z" />
        <path d="M6.7 11.6v6.6M4.8 18.8h3.8" />
        <path d="M15.2 5.2h4.2l-.3 4.6a1.8 1.8 0 0 1-3.6 0z" />
        <path d="M17.3 11.6v6.6M15.4 18.8h3.8" />
        <path d={brilho(12, 6.4, 2.2)} fill="currentColor" stroke="none" />
      </>
    ),
  },

  /* ------------------------------------------------ Evento */
  pin: {
    rotulo: "Local",
    grupo: "Evento",
    desenho: (
      <>
        <path d="M12 21s-6.5-5.7-6.5-10.9a6.5 6.5 0 0 1 13 0C18.5 15.3 12 21 12 21z" />
        <path d="m12 7.4 2.3 2.6-2.3 2.6L9.7 10z" />
      </>
    ),
  },
  relogio: {
    rotulo: "Horário",
    grupo: "Evento",
    desenho: (
      <>
        <path d="M9.2 3.9h5.6l4 2.4 2.2 4.1v3.2l-2.2 4.1-4 2.4H9.2l-4-2.4L3 13.6v-3.2l2.2-4.1z" />
        <path d="M12 7.6V12l2.9 1.9" />
      </>
    ),
  },
  calendario: {
    rotulo: "Data",
    grupo: "Evento",
    desenho: (
      <>
        <path d="M6.5 5h11L20 7.5v10.9L17.5 21h-11L4 18.4V7.5z" />
        <path d="M4 10h16M8.5 3v4M15.5 3v4" />
        <path d="m12 12.6 1.3 1.6-1.3 1.6-1.3-1.6z" />
      </>
    ),
  },
  lista: {
    rotulo: "Lista",
    grupo: "Evento",
    desenho: (
      <>
        <path d="M7 4.5h10l2 2v12.5l-2 2H7l-2-2V6.5z" />
        <path d="M9.5 3h5v3h-5z" />
        <path d="M8.5 10.5h7M8.5 14h7M8.5 17.5h4" />
      </>
    ),
  },
  cadeado: {
    rotulo: "Reservado",
    grupo: "Evento",
    desenho: (
      <>
        <path d="M7.2 10.5h9.6l1.7 1.7v6.6L16.8 20.5H7.2l-1.7-1.7v-6.6z" />
        <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
        <path d="m12 13.4 1.2 1.6-1.2 1.6-1.2-1.6z" />
      </>
    ),
  },
  caneta: {
    rotulo: "Escrever o nome",
    grupo: "Evento",
    desenho: (
      <>
        <path d="M12 3.5 16.6 9 14 16.5h-4L7.4 9z" />
        <path d="M12 3.5v7.6" />
        <circle cx="12" cy="12.4" r="1.2" />
        <path d="M10 16.5v2.5h4v-2.5M8.5 21h7" />
      </>
    ),
  },
  check: {
    rotulo: "Confirmado",
    grupo: "Evento",
    desenho: <path d="m5 12.6 4.4 4.4L19 7.4" />,
  },

  /* ------------------------------------------------ Contato */
  whatsapp: {
    rotulo: "WhatsApp",
    grupo: "Contato",
    desenho: (
      <>
        <path d="M4 20.2 5.3 16A8.4 8.4 0 1 1 8.4 19z" />
        <path d="M9.2 8.6c.1 2.8 3.2 5.9 6 6.1l1-1.3-1.9-1.1-.9.8c-1-.5-2-1.5-2.5-2.5l.8-.9-1.1-1.9z" />
      </>
    ),
  },
  instagram: {
    rotulo: "Instagram",
    grupo: "Contato",
    desenho: (
      <>
        <path d="M8 3.5h8L20.5 8v8L16 20.5H8L3.5 16V8z" />
        <circle cx="12" cy="12" r="3.7" />
        <path d={brilho(17, 7, 1.1)} fill="currentColor" stroke="none" />
      </>
    ),
  },

  /* ------------------------------------------------ Interface */
  seta: {
    rotulo: "Avançar",
    grupo: "Interface",
    desenho: <path d="M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5" />,
  },
  fechar: {
    rotulo: "Fechar",
    grupo: "Interface",
    desenho: <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />,
  },
  pausa: {
    rotulo: "Pausar",
    grupo: "Interface",
    desenho: <path d="M9 6v12M15 6v12" />,
  },
  play: {
    rotulo: "Retomar",
    grupo: "Interface",
    desenho: <path d="M8.5 5.6v12.8L18.8 12z" />,
  },
  brilho: {
    rotulo: "Brilho",
    grupo: "Interface",
    desenho: <path d={brilho(12, 12, 7.5)} fill="currentColor" stroke="none" />,
  },
} as const;

export type IconeNome = keyof typeof ICONES;
export const NOMES_ICONES = Object.keys(ICONES) as IconeNome[];
