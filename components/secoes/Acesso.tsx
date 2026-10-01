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
import type { Diamante3D } from "./acesso/diamante3d";

/* Diamante desenhado no mesmo corte do logo (unidades do viewBox -100…100) */
const CONTORNO = "M-60,-72 L60,-72 L100,-16 L0,100 L-100,-16 Z";
const FACETAS = "M-100,-16 L100,-16 M-60,-72 L-35,-16 L0,-72 L35,-16 L60,-72 M-35,-16 L0,100 L35,-16";

/** Testa o WebGL num canvas descartável, antes de baixar o Three.js. */
function suportaWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Cena 3 — O acesso (o pico). A cena fica presa enquanto a pessoa rola:
 * um diamante 3D gira, a câmera mergulha nele e, do outro lado, o camarote acende com os quatro acessos.
 *
 * Leve de propósito: a rolagem só mexe em transform e opacidade (nada de recorte ou tamanho por quadro),
 * o Three.js só é baixado perto da cena e o WebGL só desenha enquanto ela está na tela.
 * Sem WebGL, o mesmo movimento acontece com o diamante em SVG. Sem movimento, vira uma leitura simples.
 */
export default function Acesso() {
  const ref = useRef<HTMLElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const { nome, pronto } = useLista();
  const titulo = pronto && nome ? `${primeiroNome(nome)}, isso é seu.` : "Isso é o que se abre para você.";

  useGSAP(
    () => {
      const sec = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(MQ.movimento, () => {
        sec.classList.add(s.ativa);
        let progresso = 0;
        let diamante: Diamante3D | null = null;
        let cancelado = false;
        let naTela = false;
        let emTransicao = false;
        // desenha só com a cena na tela e enquanto a pedra ainda aparece (depois, ela já sumiu)
        const atualizarDesenho = () => diamante?.ativo(naTela && progresso < 0.48);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3, // o Lenis já suaviza a roda; aqui só um toque, para não ficar "atrasado"
            invalidateOnRefresh: true,
            onUpdate: (st) => {
              progresso = st.progress;
              // camadas próprias na GPU só durante a travessia (fora dela, nada fica promovido à toa)
              const atravessando = progresso > 0.26 && progresso < 0.82;
              if (atravessando !== emTransicao) {
                emTransicao = atravessando;
                sec.classList.toggle(s.transicao, atravessando);
              }
              diamante?.definirProgresso(progresso);
              atualizarDesenho();
            },
          },
        });
        // 0 → 0.14 o título sai · 0.02 → 0.48 a câmera mergulha (no 3D) · 0.36 → 0.52 o camarote acende
        tl.fromTo(`.${s.fora}`, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -48, duration: 0.14, ease: "power1.in" }, 0)
          .fromTo(
            `.${s.diamante}`,
            { xPercent: -50, yPercent: -50, scale: 1, rotate: 0 },
            { scale: 16, rotate: 12, duration: 0.46, ease: "power2.in" },
            0.02,
          )
          .fromTo(`.${s.joia}`, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.12 }, 0.36)
          .fromTo(
            `.${s.dentro}`,
            { autoAlpha: 0, scale: 1.06 },
            { autoAlpha: 1, scale: 1, duration: 0.16, ease: "power2.out" },
            0.36,
          )
          .fromTo(`.${s.luzes}`, { scale: 1.2 }, { scale: 1, duration: 0.5 }, 0.36);
        // uma animação por elemento: com "stagger" numa cena presa, só o primeiro nasceria escondido
        gsap.utils.toArray<HTMLElement>(`.${s.cabDentro} > *`, sec).forEach((el, i) => {
          tl.fromTo(el, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.43 + i * 0.03);
        });
        gsap.utils.toArray<HTMLElement>(`.${s.item}`, sec).forEach((el, i) => {
          const em = 0.5 + i * 0.06;
          tl.fromTo(el, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, em);
          // o traço do ícone se desenha logo depois do cartão aparecer
          const icone = el.querySelector("svg");
          if (icone)
            tl.fromTo(icone, { strokeDashoffset: 80 }, { strokeDashoffset: 0, duration: 0.07, ease: "power1.inOut" }, em + 0.03);
        });
        tl.to({}, { duration: 0.14 }); // pausa no fim para ler os cartões

        /* Diamante 3D: baixa o Three.js quando a cena está a ~2 telas de distância e só desenha com ela visível */
        const visivel = new IntersectionObserver(
          ([e]) => {
            if (e.isIntersecting && !diamante && tela.current) {
              visivel.disconnect();
              if (!suportaWebGL()) return; // sem WebGL: fica o diamante em SVG (e o Three.js nem é baixado)
              import("./acesso/diamante3d").then(({ criarDiamante }) => {
                if (cancelado || !tela.current) return;
                const semWebgl = () => {
                  sec.classList.remove(s.tem3d);
                  diamante?.destruir();
                  diamante = null;
                };
                diamante = criarDiamante(tela.current, semWebgl);
                if (!diamante) return;
                diamante.definirProgresso(progresso);
                sec.classList.add(s.tem3d);
                desenhar.observe(sec);
              });
            }
          },
          { rootMargin: "200% 0px" }, // prepara com ~2 telas de antecedência: o WebGL inicia antes de a pessoa chegar
        );
        const desenhar = new IntersectionObserver(([e]) => {
          naTela = e.isIntersecting;
          atualizarDesenho();
        });
        visivel.observe(sec);

        ScrollTrigger.refresh();
        return () => {
          cancelado = true;
          visivel.disconnect();
          desenhar.disconnect();
          diamante?.destruir();
          sec.classList.remove(s.ativa, s.tem3d, s.transicao);
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

        <div className={s.joia} aria-hidden="true">
          <canvas ref={tela} className={s.tela} />
          <svg className={s.diamante} viewBox="-104 -104 208 208">
            <path d={FACETAS} className={s.faceta} />
            <path d={CONTORNO} className={s.contorno} />
          </svg>
        </div>

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
