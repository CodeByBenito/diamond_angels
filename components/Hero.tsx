"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, MQ, EASE } from "@/lib/movimento";
import { LINKS } from "@/lib/conteudo";
import ProximoEvento from "./ProximoEvento";

/* Brilhos fixos (posição em %, tamanho em px, atraso em s): determinísticos, sem diferença entre servidor e navegador */
const BRILHOS = [
  [12, 22, 3, 0.2], [22, 68, 2, 1.6], [31, 14, 2, 2.4], [8, 48, 3, 3.1], [44, 8, 2, 0.9], [58, 12, 3, 2.1],
  [70, 24, 2, 0.4], [84, 16, 3, 1.2], [91, 44, 2, 2.8], [78, 64, 3, 1.9], [88, 78, 2, 0.6], [16, 84, 2, 2.2],
] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.movimento, () => {
      const split = SplitText.create(".hero h1", { type: "lines", mask: "lines", aria: "auto" });
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.from(".hero .aura", { autoAlpha: 0, scale: 0.8, duration: 2.4 }, 0)
        .from(".hero .logo-hero", { autoAlpha: 0, scale: 0.94, filter: "blur(14px)", duration: 2 }, 0.15)
        .from(".hero .sobre", { autoAlpha: 0, y: 12, duration: 1.2 }, 0.6)
        .from(split.lines, { yPercent: 105, duration: 1.5, stagger: 0.1 }, 0.7)
        .from([".hero .sub", ".hero .acoes", ".hero .proximo"], { autoAlpha: 0, y: 20, duration: 1.3, stagger: 0.12 }, 1.05);

      // ao sair de cena, a logo sobe devagar e a aura esmaece
      gsap.to(".hero .logo-hero", { yPercent: -10, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 1 } });
      gsap.to(".hero .aura", { autoAlpha: 0.2, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 1 } });
      return () => split.revert();
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} className="hero" id="inicio">
      <div className="aura" aria-hidden="true" />
      <div className="brilhos" aria-hidden="true">
        {BRILHOS.map(([x, y, t, d], i) => (
          <i key={i} style={{ left: `${x}%`, top: `${y}%`, width: t, height: t, animationDelay: `${d}s` }} />
        ))}
      </div>
      <div className="wrap conteudo">
        <img className="logo-hero" src="/logo.webp" alt="Diamond Angels" width={900} height={746} fetchPriority="high" decoding="async" />
        <p className="sobre rotulo">Salvador · Bahia</p>
        <h1>O clube feminino <em>de Salvador</em></h1>
        <p className="sub">Eventos, lista VIP e benefícios exclusivos para as mulheres do time. Divulgação que gera oportunidades para você e para as marcas que estão com a gente.</p>
        <div className="acoes">
          <a className="btn" href="#eventos">Ver eventos</a>
          <a className="btn vazado" href={LINKS.agencia} target="_blank" rel="noopener">Quero ser Angel</a>
        </div>
        <ProximoEvento />
      </div>
      <a className="rolar" href="#clube" aria-label="Rolar para O clube"><span /></a>
    </section>
  );
}
