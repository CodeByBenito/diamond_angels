import { WHATSAPP } from "@/conteudo/contato";
import type { Evento } from "@/conteudo/eventos";
import { dataBR } from "./datas";

/** Link que abre a conversa com a Diamond já com a mensagem escrita. */
export const linkWhatsApp = (texto: string) => `https://wa.me/${WHATSAPP.numero}?text=${encodeURIComponent(texto)}`;

const apresentacao = (nome: string) => (nome ? ` Meu nome é ${nome}.` : "");

export const mensagemEntrar = (nome: string) =>
  `Olá, Diamond Angels!${apresentacao(nome)} Coloquei meu nome na lista pelo site e quero entrar para o time. Quais são os próximos passos?`;

export const mensagemQueroIr = (e: Evento, nome: string) =>
  `Olá, Diamond Angels!${apresentacao(nome)} Quero ir ao evento *${e.nome}* (${dataBR(e.data)}, ${e.hora}, ${e.local}). Como faço para entrar na lista?`;
