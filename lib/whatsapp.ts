/** WhatsApp oficial do clube. Troque aqui e o site inteiro acompanha. */
export const WHATSAPP = {
  numero: "5571996591036", // só dígitos: país + DDD + número
  exibicao: "+55 71 99659-1036",
} as const;

/** Link que abre a conversa já com a mensagem escrita. */
export const linkWhatsApp = (texto: string) =>
  `https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(texto)}`;

/** "2026-10-17" → "17/10/2026" */
export const dataBR = (iso: string) => {
  const [a, m, d] = iso.split("-");
  return a && m && d ? `${d}/${m}/${a}` : iso;
};
