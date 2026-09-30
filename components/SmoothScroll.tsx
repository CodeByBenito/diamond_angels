"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, setLenis, rolarPara, MQ } from "@/lib/movimento";

/** Um relógio só: o ticker do GSAP move o Lenis, e o Lenis avisa o ScrollTrigger. */
export default function SmoothScroll() {
  useEffect(() => {
    // Links internos (#ato) passam sempre por aqui, com ou sem rolagem suave
    const aoClicar = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const alvo = document.querySelector(a.getAttribute("href")!);
      if (!alvo) return;
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("da:fechar-menu"));
      rolarPara(alvo);
    };
    document.addEventListener("click", aoClicar);

    if (matchMedia(MQ.reduzido).matches) return () => document.removeEventListener("click", aoClicar);

    const lenis = new Lenis({ autoRaf: false, lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.1 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      document.removeEventListener("click", aoClicar);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
