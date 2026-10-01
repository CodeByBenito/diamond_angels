"use client";
import { useGSAP } from "@gsap/react";
import { EASE, gsap, MQ, ScrollTrigger, SplitText } from "@/lib/movimento";

/**
 * Movimentos compartilhados, suaves e de uma vez só (não repetem ao voltar):
 *  - [data-reveal]      sobe e aparece (opcional: data-delay em segundos)
 *  - [data-stagger]     os filhos diretos entram em sequência
 *  - [data-split]       título entra linha a linha, por trás de uma máscara
 *  - [data-parallax]    desloca levemente com a rolagem (valor = intensidade, ex.: 0.15)
 *  - [data-bg="#hex"]   o fundo da página viaja para essa cor quando a seção domina a tela
 * Sem JavaScript ou com movimento reduzido, tudo já está visível.
 */
export default function Revelar() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.movimento, () => {
      const inicio = "top 86%";

      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          aria: "auto",
          autoSplit: true,
          onSplit: (s) =>
            gsap.from(s.lines, {
              yPercent: 105,
              duration: 1.4,
              ease: EASE,
              stagger: 0.09,
              scrollTrigger: { trigger: el, start: inicio, once: true },
            }),
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 28,
          duration: 1.3,
          ease: EASE,
          delay: Number(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: inicio, once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((grupo) => {
        gsap.from(grupo.children, {
          autoAlpha: 0,
          y: 32,
          duration: 1.3,
          ease: EASE,
          stagger: 0.1,
          scrollTrigger: { trigger: grupo, start: inicio, once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const k = Number(el.dataset.parallax || 0.15);
        gsap.fromTo(
          el,
          { yPercent: -k * 50 },
          {
            yPercent: k * 50,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 1 },
          },
        );
      });
    });

    // Fundo que viaja (também no movimento reduzido, só que instantâneo)
    const raiz = document.documentElement;
    const reduzido = matchMedia(MQ.reduzido).matches;
    gsap.utils.toArray<HTMLElement>("[data-bg]").forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (s) => {
          if (s.isActive)
            gsap.to(raiz, { "--bg": sec.dataset.bg, duration: reduzido ? 0 : 0.9, ease: "power1.out", overwrite: true });
        },
      });
    });

    const recalc = () => ScrollTrigger.refresh();
    window.addEventListener("load", recalc);
    document.fonts?.ready.then(recalc);
    return () => {
      window.removeEventListener("load", recalc);
      mm.revert();
    };
  });
  return null;
}
