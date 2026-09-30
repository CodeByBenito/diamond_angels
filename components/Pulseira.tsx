"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import PulseiraVisual from "./PulseiraVisual";
import { gsap, lim, suave, MQ } from "@/lib/movimento";

/**
 * Movimento-assinatura: a pulseira VIP.
 * Ganha um carimbo a cada look do camarim ([data-carimbo]) e, no fim da página,
 * voa até o botão #pulseira-cta e se transforma nele.
 */
export default function Pulseira() {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const fixa = ref.current!;
    const cta = document.getElementById("pulseira-cta")!;
    const selos = fixa.querySelectorAll<HTMLElement>(".selo");
    const reduzido = matchMedia(MQ.reduzido).matches;
    const raiz = document.documentElement;

    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        const s = selos[Number((e.target as HTMLElement).dataset.carimbo) - 1];
        gsap.delayedCall(reduzido ? 0 : 0.38, () => {
          s.classList.add("ok");
          if (reduzido) return;
          gsap.fromTo(s, { scale: 1.9, rotate: 0 }, { scale: 1.08, rotate: -14, duration: 0.6, ease: "back.out(3)" });
          gsap.fromTo(fixa, { y: 0 }, { y: -6, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.out" });
        });
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-carimbo]").forEach((el) => obs.observe(el));

    // Voo: lê tudo primeiro, escreve depois (sem forçar layout duas vezes)
    let sujo = true;
    const marcar = () => { sujo = true; };
    const quadro = () => {
      if (!sujo) return;
      sujo = false;
      const alvo = cta.getBoundingClientRect();
      const vh = innerHeight;
      let t = lim((vh * 0.96 - alvo.bottom) / (vh * 0.3), 0, 1);
      if (scrollY + vh >= raiz.scrollHeight - 4 && alvo.top < vh) t = 1;
      const w = fixa.offsetWidth, h = fixa.offsetHeight, m = innerWidth <= 640 ? 12 : 20;
      const k = suave(t), esc = alvo.width / w, chegou = t >= 1;
      fixa.style.transform = t > 0 && !reduzido
        ? `translate3d(${((alvo.left - m) * k).toFixed(1)}px,${((alvo.top - (vh - m - h)) * k).toFixed(1)}px,0) scale(${(1 + (esc - 1) * k).toFixed(3)})`
        : "";
      fixa.classList.toggle("sumiu", reduzido ? t > 0 : chegou);
      cta.classList.toggle("on", chegou || reduzido);
    };
    addEventListener("scroll", marcar, { passive: true });
    addEventListener("resize", marcar);
    gsap.ticker.add(quadro);

    // Some enquanto a pessoa digita (teclado do celular)
    const foco = (e: FocusEvent) => { if ((e.target as HTMLElement).matches("input, select, textarea")) fixa.classList.add("digitando"); };
    const semFoco = () => fixa.classList.remove("digitando");
    document.addEventListener("focusin", foco);
    document.addEventListener("focusout", semFoco);

    return () => {
      obs.disconnect();
      removeEventListener("scroll", marcar);
      removeEventListener("resize", marcar);
      gsap.ticker.remove(quadro);
      document.removeEventListener("focusin", foco);
      document.removeEventListener("focusout", semFoco);
    };
  });

  return (
    <a ref={ref} className="pulseira" id="pulseira-fixa" href="#chamada" aria-label="Sua pulseira de acesso. Ir para Entre para o time">
      <PulseiraVisual linha1="Diamond Angels" linha2="Access" />
    </a>
  );
}
