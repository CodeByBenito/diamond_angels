"use client";
import { useState } from "react";
import Briefing from "../Briefing";
import { BENEFICIOS, LINKS, SERVICOS } from "@/lib/conteudo";

type Lado = "entrar" | "contratar" | null;

/** Ato 5 — duas portas: quem quer entrar no time e quem quer contratar o clube. */
export default function Caminhos() {
  const [escolhido, setEscolhido] = useState<Lado>(null);
  const beneficiosTime = BENEFICIOS.filter((b) => b.titulo !== "Benefícios exclusivos");

  return (
    <section className="ato bifurcacao" id="caminhos" data-bg="#0b0708" data-ink="#efe6d6">
      <div className="wrap">
        <div className="titulo">
          <h2 data-reveal="up">Duas portas.<br />Qual é a sua?</h2>
          <p>Para quem quer entrar no time e para quem quer levar a marca, a festa ou o lançamento até ele.</p>
        </div>
        <div className={`portas${escolhido ? " tem-escolha" : ""}`}>
          <div className={`lado entrar${escolhido === "entrar" ? " escolhida" : ""}`} onPointerDown={() => setEscolhido("entrar")} onFocus={() => setEscolhido("entrar")}>
            <span className="macaneta" aria-hidden="true" />
            <div><span className="mono">Porta 1 · Quero entrar</span><h3>Entre para o time</h3></div>
            <p className="txt">Chame a equipe no Instagram, conte um pouco sobre você e receba as próximas etapas.</p>
            <ul className="servicos">
              {beneficiosTime.map((b) => <li key={b.titulo}><b>{b.titulo}</b><span>{b.texto}</span></li>)}
            </ul>
            <div className="rodape">
              <a className="btn" href={LINKS.agencia} target="_blank" rel="noopener" data-cursor="Abrir Instagram">Falar com @bwagency7</a>
              <a className="btn vazado" href={LINKS.clube} target="_blank" rel="noopener">Seguir @diamondangels3</a>
            </div>
          </div>
          <div className={`lado contratar${escolhido === "contratar" ? " escolhida" : ""}`} onPointerDown={() => setEscolhido("contratar")} onFocus={() => setEscolhido("contratar")}>
            <span className="macaneta" aria-hidden="true" />
            <div><span className="mono">Porta 2 · Quero contratar</span><h3>Divulgação que gera oportunidades</h3></div>
            <p className="txt">Coloque sua marca, festa ou lançamento diante de 15,6 mil seguidoras em Salvador, com promotoria feita por quem já circula nos eventos da cidade.</p>
            <ul className="servicos">
              {SERVICOS.map((s) => <li key={s.titulo}><b>{s.titulo}</b><span>{s.texto}</span></li>)}
            </ul>
            <p className="fluxo mono"><b>Briefing</b> → Proposta → Ação → Relatório</p>
            <Briefing />
          </div>
        </div>
      </div>
    </section>
  );
}
