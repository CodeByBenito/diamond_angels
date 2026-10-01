"use client";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";
import { VIDEO_CAMAROTE } from "@/conteudo/midia";
import { ACESSOS } from "@/conteudo/textos";
import { gsap, MQ, ScrollTrigger } from "@/lib/movimento";
import { primeiroNome } from "@/lib/nome";
import Icone from "../icones/Icone";
import { useLista } from "../lista/ListaProvider";
import s from "./Acesso.module.css";

/* Diamante desenhado no mesmo corte do logo (unidades do viewBox -100…100) */
const CONTORNO = "M-60,-72 L60,-72 L100,-16 L0,100 L-100,-16 Z";
const FACETAS = "M-100,-16 L100,-16 M-60,-72 L-35,-16 L0,-72 L35,-16 L60,-72 M-35,-16 L0,100 L35,-16";

/**
 * Cena 3 — O acesso (o pico). A cena fica presa enquanto a pessoa rola:
 * o diamante cresce até ela passar por dentro dele e cair no camarote aceso.
 * Sem movimento, vira uma leitura simples (a classe .ativa só entra com animação).
 */
export default function Acesso() {
  const ref = useRef<HTMLElement>(null);
  const { nome, pronto } = useLista();
  const titulo = pronto && nome ? `${primeiroNome(nome)}, isso é seu.` : "Isso é o que se abre para você.";

  useGSAP(
    () => {
      const sec = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(MQ.movimento, () => {
        sec.classList.add(s.ativa);
        const zoom = { k: 1 };
        const aplicar = () => sec.style.setProperty("--k", zoom.k.toFixed(3));
        const kMax = () => Math.hypot(innerWidth, innerHeight) / 55; // o diamante cobre a tela inteira

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: sec, start: "top top", end: "bottom bottom", scrub: 0.8, invalidateOnRefresh: true },
        });
        // Ritmo: o diamante começa a crescer logo (power2.in, sem trecho morto no início) e o camarote
        // já aparece enquanto ele ainda se desfaz, sem tela vazia entre as duas partes. No fim, uma pausa para ler.
        tl.fromTo(`.${s.fora}`, { autoAlpha: 1, y: 0, scale: 1 }, { autoAlpha: 0, y: -40, scale: 0.96, duration: 0.16 }, 0.02)
          .fromTo(zoom, { k: 1 }, { k: kMax, duration: 0.36, ease: "power2.in", onUpdate: aplicar }, 0.04)
          .fromTo(`.${s.diamante}`, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.08 }, 0.3)
          .fromTo(`.${s.luzes}`, { scale: 1.25 }, { scale: 1, duration: 0.5 }, 0.16);
        // uma animação por elemento: com "stagger" numa cena presa, só o primeiro nasceria escondido
        gsap.utils.toArray<HTMLElement>(`.${s.cabDentro} > *`, sec).forEach((el, i) => {
          tl.fromTo(el, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.34 + i * 0.03);
        });
        gsap.utils.toArray<HTMLElement>(`.${s.item}`, sec).forEach((el, i) => {
          const em = 0.44 + i * 0.07;
          tl.fromTo(
            el,
            { autoAlpha: 0, y: 50, scale: 0.94 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.08, ease: "power2.out" },
            em,
          );
          // o traço do ícone se desenha logo depois do cartão aparecer
          const icone = el.querySelector("svg");
          if (icone)
            tl.fromTo(icone, { strokeDashoffset: 80 }, { strokeDashoffset: 0, duration: 0.07, ease: "power1.inOut" }, em + 0.03);
        });
        tl.to({}, { duration: 0.16 });
        aplicar();
        ScrollTrigger.refresh();
        return () => {
          sec.classList.remove(s.ativa);
          sec.style.removeProperty("--k");
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  /* Vídeo opcional do camarote (conteudo/midia.ts): só carrega perto da cena e pausa fora dela */
  useEffect(() => {
    const sec = ref.current!;
    const src = VIDEO_CAMAROTE;
    if (!src) return;
    const reduzido = matchMedia(MQ.reduzido).matches;
    let video: HTMLVideoElement | null = null;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !video) {
          const v = document.createElement("video");
          video = v;
          Object.assign(v, { muted: true, loop: true, playsInline: true, preload: "auto" });
          v.setAttribute("playsinline", "");
          v.className = s.video;
          v.addEventListener("loadeddata", () => {
            v.classList.add(s.videoOk);
            if (!reduzido) v.play().catch(() => {});
          });
          v.addEventListener("error", () => v.remove());
          v.src = src;
          sec.querySelector(`.${s.dentro}`)?.prepend(v);
        } else if (video?.classList.contains(s.videoOk)) {
          if (e.isIntersecting && !reduzido) video.play().catch(() => {});
          else video.pause();
        }
      },
      { rootMargin: "100% 0px" },
    );
    obs.observe(sec);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className={s.acesso} id="acesso" data-bg="#0a0708" aria-labelledby="acesso-titulo">
      <div className={s.palco}>
        <div className={s.fora}>
          <p className="rotulo">O acesso</p>
          <h2 id="acesso-titulo">
            Com a Diamond, <em>a porta se abre.</em>
          </h2>
        </div>

        <svg className={s.diamante} viewBox="-104 -104 208 208" aria-hidden="true">
          <path d={FACETAS} className={s.faceta} />
          <path d={CONTORNO} className={s.contorno} />
        </svg>

        <div className={s.dentro}>
          <div className={s.luzes} aria-hidden="true" />
          <div className={`wrap ${s.conteudo}`}>
            <div className={s.cabDentro}>
              <p className="rotulo">Do outro lado da corda</p>
              <div>
                <h3 aria-live="polite">{titulo}</h3>
              </div>
            </div>
            <ul className={s.itens}>
              {ACESSOS.map((a) => (
                <li key={a.titulo} className={s.item}>
                  <span className={s.selo}>
                    <Icone nome={a.icone} />
                  </span>
                  <h4>{a.titulo}</h4>
                  <p>{a.texto}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
