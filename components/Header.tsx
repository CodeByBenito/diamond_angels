"use client";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { LINKS, NAV, type SecaoId } from "@/lib/conteudo";
import { ScrollTrigger, getLenis } from "@/lib/movimento";

export default function Header() {
  const [aberto, setAberto] = useState(false);
  const [atual, setAtual] = useState<SecaoId>("inicio");
  const [recolhido, setRecolhido] = useState(false);
  const [rolado, setRolado] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  /* Cabeçalho some ao descer e volta ao subir; a seção atual acompanha a rolagem */
  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        setRolado(y > 24);
        setRecolhido(self.direction === 1 && y > 240);
      },
    });
    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) ScrollTrigger.create({ trigger: el, start: "top 45%", end: "bottom 45%", onToggle: (s) => s.isActive && setAtual(id) });
    });
  });

  /* Menu de tela cheia: trava a rolagem, foca o primeiro link, fecha com Esc */
  useEffect(() => {
    document.documentElement.classList.toggle("menu-aberto", aberto);
    const lenis = getLenis();
    if (aberto) { lenis?.stop(); menu.current?.querySelector("a")?.focus(); }
    else lenis?.start();
  }, [aberto]);

  useEffect(() => {
    const fechar = () => setAberto(false);
    const tecla = (e: KeyboardEvent) => { if (e.key === "Escape") { setAberto(false); botao.current?.focus({ preventScroll: true }); } };
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

  const classes = ["topo", recolhido && !aberto && "recolhido", (rolado || aberto) && "rolado"].filter(Boolean).join(" ");

  return (
    <>
      <header className={classes}>
        <div className="wrap">
          <a className="marca" href="#inicio" aria-label="Diamond Angels, início">
            <img src="/logo-mark.webp" alt="" width={40} height={40} />
            <span><b>Diamond</b> Angels</span>
          </a>
          <nav className="menu" aria-label="Principal">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} aria-current={atual === n.id ? "true" : undefined}>{n.rotulo}</a>
            ))}
          </nav>
          <a className="btn btn-sm cta-topo" href="#marcas">Divulgar evento</a>
          <button ref={botao} className="abre-menu" type="button" aria-expanded={aberto} aria-controls="menu-cheio"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"} onClick={() => setAberto((v) => !v)}>
            <i aria-hidden="true" />
          </button>
        </div>
      </header>

      <div ref={menu} className="menu-cheio" id="menu-cheio" role="dialog" aria-modal="true" aria-label="Menu" inert={!aberto}>
        <ol>
          {NAV.map((n, i) => (
            <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
              <a href={`#${n.id}`} aria-current={atual === n.id ? "true" : undefined}>{n.rotulo}</a>
            </li>
          ))}
        </ol>
        <div className="menu-cta">
          <a className="btn" href="#marcas">Divulgar meu evento</a>
          <a className="btn vazado" href={LINKS.agencia} target="_blank" rel="noopener">Quero ser Angel</a>
        </div>
      </div>
    </>
  );
}
