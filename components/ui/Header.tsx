"use client";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { LINKS } from "@/conteudo/contato";
import { NAV, type SecaoId } from "@/conteudo/textos";
import { getLenis, ScrollTrigger } from "@/lib/movimento";
import { primeiroNome } from "@/lib/nome";
import { useLista } from "../lista/ListaProvider";
import s from "./Header.module.css";

export default function Header() {
  const { nome } = useLista();
  const [aberto, setAberto] = useState(false);
  const [atual, setAtual] = useState<SecaoId>("porta");
  const [recolhido, setRecolhido] = useState(false);
  const [rolado, setRolado] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  /* Some ao descer, volta ao subir; a seção atual acompanha a rolagem */
  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (st) => {
        const y = st.scroll();
        setRolado(y > 24);
        setRecolhido(st.direction === 1 && y > 240);
      },
    });
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el)
        ScrollTrigger.create({ trigger: el, start: "top 45%", end: "bottom 45%", onToggle: (st) => st.isActive && setAtual(id) });
    });
  });

  /* Menu de tela cheia: trava a rolagem, foca o primeiro link, fecha com Esc */
  useEffect(() => {
    document.documentElement.classList.toggle("menu-aberto", aberto);
    const lenis = getLenis();
    if (aberto) {
      lenis?.stop();
      menu.current?.querySelector("a")?.focus();
    } else lenis?.start();
  }, [aberto]);

  useEffect(() => {
    const fechar = () => setAberto(false);
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botao.current?.focus({ preventScroll: true });
      }
    };
    const largo = matchMedia("(min-width: 961px)");
    const aoAlargar = () => largo.matches && setAberto(false);
    window.addEventListener("da:fechar-menu", fechar);
    document.addEventListener("keydown", tecla);
    largo.addEventListener("change", aoAlargar);
    return () => {
      window.removeEventListener("da:fechar-menu", fechar);
      document.removeEventListener("keydown", tecla);
      largo.removeEventListener("change", aoAlargar);
    };
  }, []);

  const classes = [s.topo, recolhido && !aberto && s.recolhido, (rolado || aberto) && s.rolado].filter(Boolean).join(" ");
  const cta = nome ? `${primeiroNome(nome)}, confirmar` : "Entrar na lista";

  return (
    <>
      <header className={classes}>
        <div className={`wrap ${s.barra}`}>
          <a className={s.marca} href="#porta" aria-label="Diamond Angels, início">
            <img src="/logo-mark.webp" alt="" width={40} height={40} />
            <span>
              Diamond <b>Angels</b>
            </span>
          </a>
          <nav className={s.menu} aria-label="Principal">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} aria-current={atual === n.id ? "true" : undefined}>
                {n.rotulo}
              </a>
            ))}
          </nav>
          <a className={`btn btn-sm ${s.cta}`} href="#lista">
            {cta}
          </a>
          <button
            ref={botao}
            className={s.abreMenu}
            type="button"
            aria-expanded={aberto}
            aria-controls="menu-cheio"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
            onClick={() => setAberto((v) => !v)}
          >
            <i aria-hidden="true" />
          </button>
        </div>
      </header>

      <div ref={menu} className={s.menuCheio} id="menu-cheio" role="dialog" aria-modal="true" aria-label="Menu" inert={!aberto}>
        <ol>
          {NAV.map((n, i) => (
            <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
              <a href={`#${n.id}`} aria-current={atual === n.id ? "true" : undefined}>
                {n.rotulo}
              </a>
            </li>
          ))}
        </ol>
        <div className={s.menuCta}>
          <a className="btn" href="#lista">
            {cta}
          </a>
          <a className="btn vazado" href={LINKS.clube} target="_blank" rel="noopener">
            @diamondangels3
          </a>
        </div>
      </div>
    </>
  );
}
