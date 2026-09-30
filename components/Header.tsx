"use client";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ATOS, LINKS, type AtoId } from "@/lib/conteudo";
import { ScrollTrigger, getLenis } from "@/lib/movimento";

const NAV: { id: AtoId; rotulo: string }[] = [
  { id: "camarim", rotulo: "O clube" },
  { id: "porta", rotulo: "Benefícios" },
  { id: "lineup", rotulo: "Eventos" },
  { id: "caminhos", rotulo: "Marcas" },
];

export default function Header() {
  const [aberto, setAberto] = useState(false);
  const [ato, setAto] = useState<AtoId>("inicio");
  const [recolhido, setRecolhido] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  /* Cabeçalho some ao descer e volta ao subir; o ato atual acompanha a rolagem */
  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setRecolhido(self.direction === 1 && self.scroll() > 160),
    });
    ATOS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) ScrollTrigger.create({ trigger: el, start: "top 50%", end: "bottom 50%", onToggle: (s) => s.isActive && setAto(id) });
    });
  });

  /* Menu de tela cheia: trava a rolagem, foca o primeiro link, fecha com Esc */
  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.toggle("menu-aberto", aberto);
    const lenis = getLenis();
    if (aberto) {
      lenis?.stop();
      menu.current?.querySelector("a")?.focus();
    } else {
      lenis?.start();
    }
  }, [aberto]);

  useEffect(() => {
    const fechar = () => setAberto(false);
    const tecla = (e: KeyboardEvent) => { if (e.key === "Escape") { setAberto(false); botao.current?.focus({ preventScroll: true }); } };
    window.addEventListener("da:fechar-menu", fechar);
    document.addEventListener("keydown", tecla);
    return () => { window.removeEventListener("da:fechar-menu", fechar); document.removeEventListener("keydown", tecla); };
  }, []);

  const atual = ATOS.find((a) => a.id === ato)!;

  return (
    <>
      <header className={`topo${recolhido && !aberto ? " recolhido" : ""}`}>
        <div className="wrap">
          <a className="marca" href="#inicio" aria-label="Diamond Angels, início">
            <img src="/logo-mark.webp" alt="" width={36} height={36} />
            <span>DIAMOND ANGELS</span>
          </a>
          <span className="ato-atual mono" aria-hidden="true"><b>{atual.num}</b><span>{atual.nome}</span></span>
          <nav className="menu" aria-label="Principal">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} aria-current={ato === n.id ? "true" : undefined}>{n.rotulo}</a>
            ))}
            <a className="btn" href={LINKS.agencia} target="_blank" rel="noopener" data-cursor="Abrir Instagram">Entre para o time</a>
          </nav>
          <button ref={botao} className="abre-menu" type="button" aria-expanded={aberto} aria-controls="menu-cheio" onClick={() => setAberto((v) => !v)}>
            <span className="mono">{aberto ? "Fechar" : "Menu"}</span><i aria-hidden="true" />
          </button>
        </div>
      </header>

      <div ref={menu} className="menu-cheio" id="menu-cheio" role="dialog" aria-modal="true" aria-label="Menu" inert={!aberto}>
        <p className="mono">Run of show · 6 atos</p>
        <ol>
          {ATOS.map((a) => (
            <li key={a.id}><a href={`#${a.id}`} aria-current={ato === a.id ? "true" : undefined}><b>{a.num}</b>{a.nome}</a></li>
          ))}
        </ol>
        <div className="menu-cta">
          <a className="btn" href={LINKS.agencia} target="_blank" rel="noopener">Entre para o time</a>
          <a className="btn vazado" href={LINKS.clube} target="_blank" rel="noopener">@diamondangels3</a>
        </div>
      </div>
    </>
  );
}
