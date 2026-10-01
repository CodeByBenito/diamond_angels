"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type Lenis from "lenis";
import { CHAVE_MOVIMENTO, CLASSE_SEM_MOVIMENTO } from "./preferencias";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Preferência de movimento do PRÓPRIO site (botão "Reduzir movimento" no rodapé), guardada no aparelho.
 * Não seguimos o "Efeitos de animação" do sistema: muitos Windows vêm com ele desligado e o site ficava parado.
 * O script no <head> (app/layout.tsx + lib/preferencias.ts) aplica a classe antes da primeira pintura, sem piscar.
 */
export const movimentoReduzido = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains(CLASSE_SEM_MOVIMENTO);

export function definirMovimentoReduzido(reduzir: boolean) {
  try {
    if (reduzir) localStorage.setItem(CHAVE_MOVIMENTO, "reduzido");
    else localStorage.removeItem(CHAVE_MOVIMENTO);
  } catch {
    /* armazenamento bloqueado: vale só para esta visita */
  }
  // recarrega para cada cena montar do jeito certo (cena presa, rolagem suave, esteira)
  location.reload();
}

/**
 * Consultas usadas com gsap.matchMedia() e matchMedia(). "all" sempre casa e "not all" nunca casa,
 * então movimento/reduzido seguem a preferência do site e não a do sistema.
 */
export const MQ = {
  get movimento() {
    return movimentoReduzido() ? "not all" : "all";
  },
  get reduzido() {
    return movimentoReduzido() ? "all" : "not all";
  },
  celular: "(max-width: 760px)",
};

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
