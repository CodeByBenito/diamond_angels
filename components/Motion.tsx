"use client";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, MQ } from "@/lib/movimento";

/**
 * Efeitos compartilhados por todos os atos:
 *  - [data-reveal="up|left|right"] entra ao aparecer na tela (opcional: data-delay em segundos)
 *  - [data-bg][data-ink] o fundo e a tinta da página viajam quando a seção domina a tela
 * Sem JavaScript ou com movimento reduzido, tudo já está visível.
 */
export default function Motion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.movimento, () => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const tipo = el.dataset.reveal;
        gsap.from(el, {
          autoAlpha: 0,
          y: tipo === "up" ? 40 : 0,
          x: tipo === "left" ? -56 : tipo === "right" ? 56 : 0,
          duration: 1,
          ease: "power3.out",
          delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    });

    const raiz = document.documentElement;
    const reduzido = matchMedia(MQ.reduzido).matches;
    gsap.utils.toArray<HTMLElement>("[data-bg]").forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (!self.isActive) return;
          gsap.to(raiz, { "--bg": sec.dataset.bg, "--ink": sec.dataset.ink, duration: reduzido ? 0 : 0.7, ease: "power1.out", overwrite: true });
        },
      });
    });

    const recalc = () => ScrollTrigger.refresh();
    window.addEventListener("load", recalc);
    document.fonts?.ready.then(recalc);
    return () => { window.removeEventListener("load", recalc); mm.revert(); };
  });
  return null;
}
