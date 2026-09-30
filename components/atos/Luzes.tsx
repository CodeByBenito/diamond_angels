"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, MQ } from "@/lib/movimento";
import { LINKS } from "@/lib/conteudo";

const LUZES = Array.from({ length: 9 }, (_, i) => 8 - i);

/** Ato 1 — as luzes da passarela acendem uma a uma e revelam a logo. */
export default function Luzes() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.movimento, () => {
      const split = SplitText.create(".luzes h1", { type: "words,lines", mask: "lines", aria: "auto" });
      gsap.from(split.words, { yPercent: 115, duration: 1.1, ease: "power4.out", stagger: 0.07, delay: 0.9 });
      gsap.from([".luzes .sub", ".luzes .acoes"], { autoAlpha: 0, y: 18, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 1.5 });
      // a logo "respira" com a rolagem enquanto o hero sai de cena
      gsap.to(".logo-palco", { yPercent: -12, scale: 0.94, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
      return () => split.revert();
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} className="ato luzes" data-bg="#0b0708" data-ink="#efe6d6">
      <div className="rotulos mono"><span>Salvador · Bahia</span><span>Events + VIP + Experiences</span></div>
      <div className="passarela" aria-hidden="true">
        {["e", "d"].map((lado) => (
          <div key={lado} className={`fila ${lado}`}>
            {LUZES.map((n) => <i key={n} style={{ "--n": n } as React.CSSProperties} />)}
          </div>
        ))}
      </div>
      <div className="conteudo">
        <img className="logo-palco" src="/logo.webp" alt="Diamond Angels" width={900} height={746} fetchPriority="high" decoding="async" />
        <h1>O clube feminino de Salvador.</h1>
        <p className="sub">Eventos, lista VIP e benefícios exclusivos para as mulheres do time. Divulgação que gera oportunidades para você e para as marcas que estão com a gente.</p>
        <div className="acoes">
          <a className="btn" href={LINKS.agencia} target="_blank" rel="noopener" data-cursor="Abrir Instagram">Entre para o time</a>
          <a className="btn vazado" href="#lineup">Próximos eventos</a>
        </div>
      </div>
    </section>
  );
}
