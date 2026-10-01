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
  celular: "(max-width: 760px)",
} as const;

/** Curva padrão do site: desacelera longa e macia, sem "quique". */
export const EASE = "expo.out";

let lenisAtual: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenisAtual = l;
};
export const getLenis = () => lenisAtual;

/** Rola até um elemento com a rolagem suave (ou nativa, se o movimento estiver reduzido). */
export function rolarPara(alvo: Element | null) {
  if (!alvo) return;
  const l = lenisAtual;
  if (l) {
    l.start();
    l.scrollTo(alvo as HTMLElement, { offset: -72, duration: 1.6, easing: (t) => 1 - (1 - t) ** 4 });
  } else {
    alvo.scrollIntoView({ behavior: matchMedia(MQ.reduzido).matches ? "auto" : "smooth" });
  }
}

export { gsap, ScrollTrigger, SplitText };
