"use client";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText, MQ, EASE } from "@/lib/movimento";

/**
 * Movimentos compartilhados, todos suaves e de uma vez só (não repetem ao voltar):
 *  - [data-reveal]     sobe 28px e aparece (opcional: data-delay em segundos)
 *  - [data-stagger]    os filhos diretos entram em sequência
 *  - [data-split]      título entra linha a linha, por trás de uma máscara
 *  - [data-parallax]   desloca levemente com a rolagem (valor = intensidade, ex.: 0.15)
 * Sem JavaScript ou com movimento reduzido, tudo já está visível.
 */
export default function Motion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.movimento, () => {
      const inicio = "top 86%";

      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        SplitText.create(el, { type: "lines", mask: "lines", aria: "auto", autoSplit: true,
          onSplit: (s) => gsap.from(s.lines, {
            yPercent: 105, duration: 1.4, ease: EASE, stagger: 0.09,
            scrollTrigger: { trigger: el, start: inicio, once: true },
          }),
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0, y: 28, duration: 1.3, ease: EASE, delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: inicio, once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((grupo) => {
        gsap.from(grupo.children, {
          autoAlpha: 0, y: 32, duration: 1.3, ease: EASE, stagger: 0.1,
          scrollTrigger: { trigger: grupo, start: inicio, once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const k = Number(el.dataset.parallax || 0.15);
        gsap.fromTo(el, { yPercent: -k * 50 }, {
          yPercent: k * 50, ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      });
    });

    const recalc = () => ScrollTrigger.refresh();
    window.addEventListener("load", recalc);
    document.fonts?.ready.then(recalc);
    return () => { window.removeEventListener("load", recalc); mm.revert(); };
  });
  return null;
}
