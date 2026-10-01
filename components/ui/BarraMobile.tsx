"use client";
import { useEffect, useState } from "react";
import { primeiroNome } from "@/lib/nome";
import Icone from "../icones/Icone";
import { useLista } from "../lista/ListaProvider";
import s from "./BarraMobile.module.css";

/**
 * Barra fixa do celular: a chamada para virar Angel sempre a um toque, mais o atalho da agenda.
 * Some na porta (a lista já está lá), no convite, no rodapé e enquanto ela digita (não cobre o teclado).
 */
export default function BarraMobile() {
  const { nome, pronto } = useLista();
  const [esconder, setEsconder] = useState(true);
  const [digitando, setDigitando] = useState(false);

  useEffect(() => {
    const alvos = ["porta", "lista"].map((id) => document.getElementById(id)).filter(Boolean) as Element[];
    const rodape = document.querySelector("footer");
    if (rodape) alvos.push(rodape);
    const vistos = new Set<Element>();
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting) vistos.add(e.target);
          else vistos.delete(e.target);
        }
        setEsconder(vistos.size > 0);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    for (const a of alvos) io.observe(a);

    const foco = (e: FocusEvent) => setDigitando((e.target as HTMLElement).matches("input, textarea, select"));
    const semFoco = () => setDigitando(false);
    document.addEventListener("focusin", foco);
    document.addEventListener("focusout", semFoco);
    return () => {
      io.disconnect();
      document.removeEventListener("focusin", foco);
      document.removeEventListener("focusout", semFoco);
    };
  }, []);

  const oculto = esconder || digitando;
  return (
    <nav className={`${s.barra}${oculto ? ` ${s.oculta}` : ""}`} aria-label="Atalhos" inert={oculto}>
      <a className={s.agenda} href="#agenda" aria-label="Ver a agenda">
        <Icone nome="calendario" />
        <span>Agenda</span>
      </a>
      <a className={`btn ${s.cta}`} href="#lista">
        <Icone nome="brilho" />
        {pronto && nome ? `${primeiroNome(nome)}, seu convite` : "Quero ser Angel"}
      </a>
    </nav>
  );
}
