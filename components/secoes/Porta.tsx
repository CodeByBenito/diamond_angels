"use client";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { EASE, gsap, MQ, SplitText } from "@/lib/movimento";
import Corda from "../lista/Corda";
import Lista from "../lista/Lista";
import ProximoEvento from "../ui/ProximoEvento";
import s from "./Porta.module.css";

/** Cena 1 — Na porta. O título de um lado, a lista do outro, a corda de veludo atravessando a entrada. */
export default function Porta() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.movimento, () => {
        gsap
          .timeline({ defaults: { ease: EASE } })
          .from(`.${s.luz}`, { autoAlpha: 0, scale: 0.7, duration: 2.6 }, 0)
          .from(`.${s.logo}`, { autoAlpha: 0, y: 16, filter: "blur(10px)", duration: 1.8 }, 0.2)
          .from([`.${s.sub}`, `.${s.acoes}`], { autoAlpha: 0, y: 18, duration: 1.3, stagger: 0.12 }, 0.9)
          .from(`.${s.ladoLista}`, { autoAlpha: 0, y: 40, rotate: 1.5, duration: 1.8 }, 0.7);
        // o título é dividido de novo quando a fonte carrega ou a largura muda (sem cortar palavras)
        const split = SplitText.create("h1", {
          type: "lines",
          mask: "lines",
          aria: "auto",
          autoSplit: true,
          onSplit: (sp) => gsap.from(sp.lines, { yPercent: 110, duration: 1.5, stagger: 0.1, ease: EASE, delay: 0.45 }),
        });

        // ao sair de cena, a lista sobe um pouco mais devagar que o texto (profundidade)
        gsap.to(`.${s.ladoLista}`, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 1 },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={s.porta} id="porta" data-bg="#0a0708" aria-labelledby="porta-titulo">
      <div className={s.luz} aria-hidden="true" />
      <div className={`wrap ${s.grade}`}>
        <div className={s.texto}>
          <img
            className={s.logo}
            src="/logo.webp"
            alt="Diamond Angels"
            width={900}
            height={746}
            fetchPriority="high"
            decoding="async"
          />
          <p className="rotulo">Salvador · Bahia</p>
          <h1 id="porta-titulo">
            O clube feminino <em>de Salvador.</em>
          </h1>
          <p className={s.sub}>
            Eventos, lista VIP e benefícios exclusivos para as mulheres do time. Divulgação que gera oportunidades para você e
            para as marcas que estão com a gente.
          </p>
          <div className={s.acoes}>
            <ProximoEvento />
          </div>
        </div>
        <div className={s.ladoLista}>
          <Lista />
          <div className={s.corda}>
            <Corda />
          </div>
        </div>
      </div>
    </section>
  );
}
