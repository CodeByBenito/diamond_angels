"use client";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap, MQ } from "@/lib/movimento";
import s from "./Corda.module.css";
import { useLista } from "./ListaProvider";

/**
 * A corda de veludo entre dois pilares dourados. Balança devagar; quando a visitante
 * entra na lista, o gancho da direita se solta e a corda cai, abrindo a passagem.
 */
const ALTURA = 150;
const TOPO = 34; // altura do gancho no pilar

export default function Corda() {
  const { nome, pronto } = useLista();
  const caixa = useRef<HTMLDivElement>(null);
  const corda = useRef<SVGPathElement>(null);
  const brilho = useRef<SVGPathElement>(null);
  const aberta = pronto && !!nome;
  const estado = useRef({ largura: 1000, bx: 1, by: TOPO, cx: 0.5, cy: TOPO + 78, balanco: 0 });

  function desenhar() {
    const e = estado.current;
    const w = e.largura;
    const ax = 16;
    const bx = ax + (w - 32) * e.bx;
    const cx = ax + (w - 32) * e.cx;
    const d = `M ${ax} ${TOPO} Q ${cx.toFixed(1)} ${(e.cy + e.balanco).toFixed(1)} ${bx.toFixed(1)} ${e.by.toFixed(1)}`;
    corda.current?.setAttribute("d", d);
    brilho.current?.setAttribute("d", d);
  }

  /* Medida e balanço contínuo */
  useGSAP(() => {
    const el = caixa.current!;
    const ro = new ResizeObserver(([r]) => {
      estado.current.largura = r.contentRect.width;
      desenhar();
    });
    ro.observe(el);
    const mm = gsap.matchMedia();
    mm.add(MQ.movimento, () => {
      gsap.to(estado.current, { balanco: 7, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, onUpdate: desenhar });
    });
    return () => {
      ro.disconnect();
      mm.revert();
    };
  });

  /* Solta ou prende o gancho da direita */
  useGSAP(
    () => {
      const e = estado.current;
      const reduzido = matchMedia(MQ.reduzido).matches;
      const alvo = aberta
        ? { bx: 0.985, by: ALTURA - 14, cx: 0.9, cy: ALTURA + 30 }
        : { bx: 1, by: TOPO, cx: 0.5, cy: TOPO + 78 };
      if (reduzido) {
        Object.assign(e, alvo);
        desenhar();
        return;
      }
      gsap.to(e, {
        ...alvo,
        duration: aberta ? 1.4 : 1,
        delay: aberta ? 1.2 : 0,
        ease: aberta ? "elastic.out(1, 0.45)" : "power3.inOut",
        onUpdate: desenhar,
      });
    },
    { dependencies: [aberta] },
  );

  return (
    <div ref={caixa} className={`${s.corda}${aberta ? ` ${s.aberta}` : ""}`} aria-hidden="true">
      <span className={`${s.pilar} ${s.esq}`} />
      <span className={`${s.pilar} ${s.dir}`} />
      <svg className={s.svg} height={ALTURA + 40}>
        <defs>
          <linearGradient id="veludo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c43a55" />
            <stop offset="0.5" stopColor="#8e1a2f" />
            <stop offset="1" stopColor="#3d0a16" />
          </linearGradient>
        </defs>
        <path ref={corda} className={s.veludo} d={`M 16 ${TOPO} Q 500 ${TOPO + 78} 984 ${TOPO}`} />
        <path ref={brilho} className={s.brilho} d={`M 16 ${TOPO} Q 500 ${TOPO + 78} 984 ${TOPO}`} />
      </svg>
    </div>
  );
}
