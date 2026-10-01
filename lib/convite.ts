import { LEGENDA_STORIES } from "@/conteudo/convite";
import { linkWhatsApp } from "./whatsapp";

/** O que a futura Angel responde no convite (fica só no aparelho até ela enviar pelo WhatsApp). */
export interface RespostasConvite {
  instagram: string;
  noites: string[];
  desejos: string[];
  maior: boolean;
}

export const RESPOSTAS_VAZIAS: RespostasConvite = { instagram: "", noites: [], desejos: [], maior: false };

/** Número do convite: sempre o mesmo para o mesmo nome (não é contagem de pessoas). */
export function numeroConvite(nome: string) {
  let h = 2166136261;
  for (const ch of nome.trim().toLocaleLowerCase("pt-BR")) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return String(1000 + ((h >>> 0) % 9000));
}

/** "anaclara" / "@anaclara" / "instagram.com/anaclara" → "@anaclara" */
export function arrobaInstagram(bruto: string) {
  const limpo = bruto
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, "")
    .replace(/[/?#].*$/, "")
    .replace(/^@+/, "")
    .replace(/[^\w.]/g, "");
  return limpo ? `@${limpo.slice(0, 30)}` : "";
}

export function mensagemConvite(nome: string, r: RespostasConvite) {
  const arroba = arrobaInstagram(r.instagram);
  return [
    "Olá, Diamond Angels! Montei meu convite pelo site e quero entrar para o time.",
    "",
    `*Nome:* ${nome}`,
    ...(arroba ? [`*Instagram:* ${arroba}`] : []),
    `*Minha noite:* ${r.noites.join(", ")}`,
    `*Quero viver:* ${r.desejos.join(", ")}`,
    `*Convite nº:* ${numeroConvite(nome)}`,
    "",
    "Tenho 18 anos ou mais. Quais são os próximos passos?",
  ].join("\n");
}

export const linkConvite = (nome: string, r: RespostasConvite) => linkWhatsApp(mensagemConvite(nome, r));

/* ------------------------------------------------------------------ Imagem para os stories (1080×1920) */

const W = 1080;
const H = 1920;

/** A família real da fonte que o next/font gerou (ex.: "'Pinyon Script', 'Pinyon Script Fallback'"). */
const familia = (variavel: string, reserva: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(variavel).trim() || reserva;

function carregarImagem(src: string) {
  return new Promise<HTMLImageElement>((ok, erro) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = erro;
    img.src = src;
  });
}

/** Texto com espaçamento entre letras desenhado letra a letra (o letterSpacing do canvas não existe em todo navegador). */
function textoEspacado(ctx: CanvasRenderingContext2D, txt: string, x: number, y: number, espaco: number) {
  const larguras = [...txt].map((c) => ctx.measureText(c).width);
  let cx = x - (larguras.reduce((a, b) => a + b, 0) + espaco * (txt.length - 1)) / 2;
  [...txt].forEach((c, i) => {
    ctx.fillText(c, cx + larguras[i] / 2, y);
    cx += larguras[i] + espaco;
  });
}

/** Diminui a fonte até o texto caber na largura. */
function caber(ctx: CanvasRenderingContext2D, txt: string, fonte: (px: number) => string, px: number, max: number) {
  let t = px;
  ctx.font = fonte(t);
  while (ctx.measureText(txt).width > max && t > 40) {
    t -= 4;
    ctx.font = fonte(t);
  }
}

export async function gerarImagemConvite(nome: string, r: RespostasConvite): Promise<Blob> {
  const fNome = familia("--f-nome", "cursive");
  const fTitulo = familia("--f-titulo", "serif");
  const fTexto = familia("--f-texto", "sans-serif");
  await Promise.all([
    document.fonts.load(`140px ${fNome}`),
    document.fonts.load(`60px ${fTitulo}`),
    document.fonts.load(`600 30px ${fTexto}`),
  ]).catch(() => {});
  const logo = await carregarImagem("/logo.webp").catch(() => null);

  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const ouro = ctx.createLinearGradient(0, 0, 0, H);
  ouro.addColorStop(0, "#f8e6b4");
  ouro.addColorStop(0.5, "#d6ad62");
  ouro.addColorStop(1, "#a87436");

  // fundo: camarote rubi com luzes desfocadas
  const fundo = ctx.createRadialGradient(W / 2, H * 0.32, 60, W / 2, H * 0.45, H * 0.75);
  fundo.addColorStop(0, "#6d1224");
  fundo.addColorStop(0.45, "#2a0710");
  fundo.addColorStop(1, "#0a0708");
  ctx.fillStyle = fundo;
  ctx.fillRect(0, 0, W, H);
  for (const [x, y, raio, cor] of [
    [180, 380, 260, "rgba(242,219,160,0.16)"],
    [900, 300, 220, "rgba(242,219,160,0.12)"],
    [820, 1500, 320, "rgba(196,58,85,0.28)"],
    [200, 1600, 300, "rgba(196,58,85,0.22)"],
  ] as const) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, raio);
    g.addColorStop(0, cor);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // moldura dupla dourada
  ctx.strokeStyle = ouro;
  ctx.lineWidth = 3;
  ctx.strokeRect(54, 54, W - 108, H - 108);
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(72, 72, W - 144, H - 144);
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  if (logo) {
    const lw = 380;
    ctx.drawImage(logo, (W - lw) / 2, 200, lw, (lw * logo.height) / logo.width);
  }

  ctx.fillStyle = "#d6ad62";
  ctx.font = `600 30px ${fTexto}`;
  textoEspacado(ctx, "CONVITE DIAMOND", W / 2, 690, 12);

  ctx.fillStyle = "#efe4d2";
  ctx.font = `400 58px ${fTitulo}`;
  ctx.fillText("Meu nome está na lista", W / 2, 790);

  // o nome, escrito à mão em ouro
  ctx.fillStyle = ouro;
  caber(ctx, nome, (px) => `400 ${px}px ${fNome}`, 170, W - 220);
  ctx.fillText(nome, W / 2, 1010);

  // carimbo
  ctx.save();
  ctx.translate(W / 2, 1140);
  ctx.rotate((-8 * Math.PI) / 180);
  ctx.strokeStyle = "#c43a55";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(-170, -52, 340, 92, 10);
  ctx.stroke();
  ctx.fillStyle = "#ec8a9c";
  ctx.font = `600 34px ${fTexto}`;
  textoEspacado(ctx, "✓ NA LISTA", 0, 8, 8);
  ctx.restore();

  ctx.fillStyle = "#b5a595";
  ctx.font = `600 28px ${fTexto}`;
  textoEspacado(ctx, `CONVITE Nº ${numeroConvite(nome)}`, W / 2, 1290, 8);

  if (r.noites.length) {
    ctx.fillStyle = "#efe4d2";
    caber(ctx, r.noites.join("  ·  "), (px) => `400 ${px}px ${fTitulo}`, 52, W - 240);
    ctx.fillText(r.noites.join("  ·  "), W / 2, 1420);
  }

  // rodapé: onde ela marca a Diamond
  ctx.strokeStyle = "rgba(214,173,98,0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 180, 1600);
  ctx.lineTo(W / 2 + 180, 1600);
  ctx.stroke();
  ctx.fillStyle = "#f2dba0";
  ctx.font = `400 64px ${fTitulo}`;
  ctx.fillText("@diamondangels3", W / 2, 1700);
  ctx.fillStyle = "#8a7b70";
  ctx.font = `500 28px ${fTexto}`;
  ctx.fillText(location.host.replace(/^www\./, ""), W / 2, 1765); // o endereço de onde ela está vendo o site

  return new Promise((ok, erro) => c.toBlob((b) => (b ? ok(b) : erro(new Error("sem imagem"))), "image/png"));
}

export type ResultadoCompartilhar = "compartilhado" | "baixado" | "cancelado";

/**
 * Abre o compartilhar do celular (Instagram, WhatsApp...) com a imagem do convite.
 * Sem suporte (computador), baixa a imagem. Chame direto do toque, com a imagem já gerada.
 */
export async function compartilharConvite(imagem: Blob): Promise<ResultadoCompartilhar> {
  const arquivo = new File([imagem], "convite-diamond.png", { type: "image/png" });
  // compartilhar nativo só em tela de toque (celular/tablet: abre Instagram, WhatsApp...);
  // no computador ele abriria a janela de compartilhar do sistema, e ali baixar a imagem é mais útil
  const toque = matchMedia("(pointer: coarse)").matches;
  if (toque && navigator.canShare?.({ files: [arquivo] })) {
    try {
      await navigator.share({ files: [arquivo], text: LEGENDA_STORIES });
      return "compartilhado";
    } catch (e) {
      if ((e as DOMException).name === "AbortError") return "cancelado";
    }
  }
  const url = URL.createObjectURL(imagem);
  const a = document.createElement("a");
  a.href = url;
  a.download = "convite-diamond.png";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return "baixado";
}
