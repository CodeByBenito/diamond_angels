"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** Consultas de mídia usadas em todo o site. */
export const MQ = {
  movimento: "(prefers-reduced-motion: no-preference)",
  reduzido: "(prefers-reduced-motion: reduce)",
  mouse: "(pointer: fine)",
  celular: "(max-width: 700px)",
} as const;

let lenisAtual: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { lenisAtual = l; };
export const getLenis = () => lenisAtual;

/** Rola até um elemento com a rolagem suave (ou nativa, se o movimento estiver reduzido). */
export function rolarPara(alvo: Element | null) {
  if (!alvo) return;
  const l = lenisAtual;
  if (l) { l.start(); document.documentElement.classList.remove("menu-aberto"); }
  if (l) l.scrollTo(alvo as HTMLElement, { offset: (alvo as HTMLElement).id === "porta" ? 0 : -64, duration: 1.4 });
  else alvo.scrollIntoView({ behavior: matchMedia(MQ.reduzido).matches ? "auto" : "smooth" });
}

export const lim = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
export const suave = (t: number) => t * t * (3 - 2 * t);

export { gsap, ScrollTrigger, SplitText };
