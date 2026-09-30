"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, MQ } from "@/lib/movimento";

/** Anel dourado que segue o mouse, com rótulo ([data-cursor]) e botões magnéticos. Só com mouse. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const rotulo = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(`${MQ.mouse} and ${MQ.movimento}`, () => {
      const cur = ref.current!, rot = rotulo.current!;
      const raiz = document.documentElement;
      raiz.classList.add("tem-cursor");
      const cx = gsap.quickTo(cur, "x", { duration: 0.35, ease: "power3" });
      const cy = gsap.quickTo(cur, "y", { duration: 0.35, ease: "power3" });
      const mover = (e: PointerEvent) => { cx(e.clientX); cy(e.clientY); };
      const sobre = (e: PointerEvent) => {
        const alvo = (e.target as HTMLElement).closest("a, button, .lado, .etiqueta, input, select, textarea");
        const r = alvo?.closest<HTMLElement>("[data-cursor]");
        rot.textContent = r?.dataset.cursor ?? "";
        cur.classList.toggle("sobre", !!alvo);
        cur.classList.toggle("rotulo", !!r?.dataset.cursor);
        cur.classList.toggle("texto", !!alvo?.matches("input, select, textarea"));
      };
      const sai = () => cur.classList.add("fora");
      const entra = () => cur.classList.remove("fora");
      addEventListener("pointermove", mover, { passive: true });
      document.addEventListener("pointerover", sobre);
      document.documentElement.addEventListener("pointerleave", sai);
      document.documentElement.addEventListener("pointerenter", entra);

      const limpar: (() => void)[] = [];
      document.querySelectorAll<HTMLElement>(".btn, #pulseira-cta").forEach((b) => {
        const bx = gsap.quickTo(b, "x", { duration: 0.4, ease: "power3" });
        const by = gsap.quickTo(b, "y", { duration: 0.4, ease: "power3" });
        const m = (e: PointerEvent) => {
          const r = b.getBoundingClientRect();
          bx((e.clientX - r.left - r.width / 2) * 0.22);
          by((e.clientY - r.top - r.height / 2) * 0.3);
        };
        const l = () => { bx(0); by(0); };
        b.addEventListener("pointermove", m);
        b.addEventListener("pointerleave", l);
        limpar.push(() => { b.removeEventListener("pointermove", m); b.removeEventListener("pointerleave", l); });
      });

      return () => {
        raiz.classList.remove("tem-cursor");
        removeEventListener("pointermove", mover);
        document.removeEventListener("pointerover", sobre);
        document.documentElement.removeEventListener("pointerleave", sai);
        document.documentElement.removeEventListener("pointerenter", entra);
        limpar.forEach((f) => f());
      };
    });
    return () => mm.revert();
  });

  return <div ref={ref} className="cursor" aria-hidden="true"><span ref={rotulo} /></div>;
}
