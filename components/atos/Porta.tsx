"use client";
import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ScrollTrigger, MQ } from "@/lib/movimento";
import { BENEFICIOS, LINKS } from "@/lib/conteudo";

/**
 * Ato 3 — o pico. A cena fica presa enquanto a pessoa rola:
 * a cortina abre, a passarela acende e os benefícios desfilam da profundidade.
 * Sem movimento, vira uma lista simples (a classe .ativa só entra com animação).
 */
export default function Porta() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const sec = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(MQ.movimento, () => {
      sec.classList.add("ativa");
      const looks = gsap.utils.toArray<HTMLElement>(".look", sec);
      const splits = looks.map((l) => SplitText.create(l.querySelector("h3"), { type: "words,chars", aria: "auto" }));

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: sec, start: "top top", end: "bottom bottom", scrub: 0.7, invalidateOnRefresh: true },
      });
      tl.to(".cortina.e", { xPercent: -101, scaleX: 0.62, ease: "power2.inOut", duration: 0.3 }, 0.05)
        .to(".cortina.d", { xPercent: 101, scaleX: 0.62, ease: "power2.inOut", duration: 0.3 }, 0.05)
        .fromTo(sec, { "--luz": 0 }, { "--luz": 1, duration: 0.3 }, 0.05);

      looks.forEach((l, i) => {
        const em = 0.26 + i * 0.16;
        tl.fromTo(l, { autoAlpha: 0, scale: 0.6, y: 70 }, { autoAlpha: 1, scale: 1, y: 0, ease: "power3.out", duration: 0.07 }, em)
          .from(splits[i].chars, { yPercent: 70, autoAlpha: 0, rotate: 6, stagger: 0.003, ease: "power3.out", duration: 0.05 }, em);
        if (i < looks.length - 1) tl.to(l, { autoAlpha: 0, scale: 1.1, y: -50, ease: "power2.in", duration: 0.04 }, em + 0.12);
      });
      tl.fromTo(".porta .final", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.9).to({}, { duration: 0.05 });

      ScrollTrigger.refresh();
      return () => { sec.classList.remove("ativa"); splits.forEach((s) => s.revert()); };
    });
    return () => mm.revert();
  }, { scope: ref });

  /* Vídeo opcional (public/videos/passarela.mp4): só carrega perto da cena e pausa fora dela */
  useEffect(() => {
    const sec = ref.current!;
    let video: HTMLVideoElement | null = null;
    const reduzido = matchMedia(MQ.reduzido).matches;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !video) {
        video = document.createElement("video");
        Object.assign(video, { muted: true, loop: true, playsInline: true, preload: "auto" });
        video.setAttribute("playsinline", "");
        video.addEventListener("loadeddata", () => { video!.classList.add("ok"); if (!reduzido) video!.play().catch(() => {}); });
        video.addEventListener("error", () => { video?.remove(); });
        video.src = "/videos/passarela.mp4";
        sec.querySelector(".palco")!.prepend(video);
      } else if (video?.classList.contains("ok")) {
        if (e.isIntersecting && !reduzido) video.play().catch(() => {}); else video.pause();
      }
    }, { rootMargin: "100% 0px" });
    obs.observe(sec);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="porta" id="porta" data-bg="#0b0708" data-ink="#efe6d6" aria-label="Benefícios de quem faz parte">
      <div className="palco">
        <div className="cone" aria-hidden="true" />
        <div className="chao" aria-hidden="true" />
        <div className="desfile">
          {BENEFICIOS.map((b) => (
            <div key={b.titulo} className="look">
              <span className="mono">Na passarela</span>
              <h3>{b.titulo}</h3>
              <p>{b.texto}</p>
            </div>
          ))}
        </div>
        <div className="final"><a className="btn" href={LINKS.agencia} target="_blank" rel="noopener" data-cursor="Abrir Instagram">Quero entrar</a></div>
        <div className="cortina e" aria-hidden="true"><span className="mono">Backstage</span><h2>Fazer parte</h2></div>
        <div className="cortina d" aria-hidden="true"><span className="mono">Passarela</span><h2>abre portas.</h2></div>
      </div>
    </section>
  );
}
