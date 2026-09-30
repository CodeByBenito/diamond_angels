"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, MQ } from "@/lib/movimento";
import { EVENTOS, EVENTOS_SAO_EXEMPLO, MESES, type TipoEvento } from "@/lib/eventos";
import { LINKS } from "@/lib/conteudo";

type Filtro = "todos" | TipoEvento;
const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "vip", rotulo: "VIP" },
  { id: "aberto", rotulo: "Abertos" },
];

/** Ato 4 — a agenda como o roteiro de um desfile. O fundo da página vira marfim. */
export default function Lineup() {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [hoje, setHoje] = useState<string | null>(null); // definido no navegador, não no build
  const corpo = useRef<HTMLTableSectionElement>(null);
  const primeira = useRef(true);

  useEffect(() => { setHoje(new Date().toLocaleDateString("sv-SE")); }, []);

  const futuros = useMemo(
    () => EVENTOS.filter((e) => !hoje || e.data >= hoje).sort((a, b) => a.data.localeCompare(b.data)),
    [hoje],
  );
  const lista = futuros.filter((e) => filtro === "todos" || e.tipo === filtro);
  const contagem = (f: Filtro) => futuros.filter((e) => f === "todos" || e.tipo === f).length;

  useEffect(() => {
    if (primeira.current) { primeira.current = false; return; }
    if (matchMedia(MQ.reduzido).matches || !corpo.current) return;
    gsap.from(corpo.current.children, { y: 14, autoAlpha: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" });
  }, [filtro]);

  return (
    <section className="ato lineup" id="lineup" data-bg="#efe6d6" data-ink="#1c0d10">
      <div className="wrap">
        <div className="cab">
          <div><span className="mono alto">Run of show · Diamond Angels</span><h2 data-reveal="up">Agenda da noite</h2></div>
          <p className="lead">Confirme presença pelo Instagram. Cada evento tem regras de entrada próprias e a lista VIP é organizada pelo clube.</p>
        </div>
        <div className="filtros" role="group" aria-label="Filtrar eventos">
          {FILTROS.map((f) => (
            <button key={f.id} className="filtro" type="button" aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>
              {f.rotulo}<small>{contagem(f.id)}</small>
            </button>
          ))}
        </div>
        <div className="roteiro">
          <table>
            <thead><tr><th>Data</th><th>Evento</th><th>Hora</th><th>Local</th><th>Acesso</th><th><span className="sr">Presença</span></th></tr></thead>
            <tbody ref={corpo} aria-live="polite">
              {lista.length === 0 && (
                <tr><td colSpan={6}>Nenhum evento nesta categoria por enquanto. Siga o Instagram para saber das próximas datas.</td></tr>
              )}
              {lista.map((e) => {
                const [, m, d] = e.data.split("-");
                const vip = e.tipo === "vip";
                return (
                  <tr key={e.data + e.nome}>
                    <td className="data">{d}<small>{MESES[Number(m) - 1]}</small></td>
                    <td className="nome">{e.nome}</td>
                    <td className="hora">{e.hora}</td>
                    <td className="local">{e.local}</td>
                    <td><span className={`acesso${vip ? " vip" : ""}`}>{vip ? "Lista VIP" : "Aberto ao público"}</span></td>
                    <td><a className="ir" href={LINKS.clube} target="_blank" rel="noopener" data-cursor="Confirmar no Instagram">Quero ir →</a></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {EVENTOS_SAO_EXEMPLO && <p className="nota">Datas, nomes e locais são exemplos. Para trocar, edite lib/eventos.ts.</p>}
      </div>
    </section>
  );
}
