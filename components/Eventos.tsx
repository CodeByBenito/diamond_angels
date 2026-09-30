"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Cartaz from "./Cartaz";
import Icone from "./Icone";
import { gsap, getLenis, MQ, EASE } from "@/lib/movimento";
import { EVENTOS, EVENTOS_SAO_EXEMPLO, embedMapa, linkMapa, partesData, type Evento, type Realizacao } from "@/lib/eventos";
import { dataBR, linkWhatsApp } from "@/lib/whatsapp";

type Filtro = "todos" | Realizacao;
const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "diamond", rotulo: "Diamond" },
  { id: "parceria", rotulo: "Parcerias" },
];

const selo = (e: Evento) => (e.realizacao === "diamond" ? "Realização Diamond" : `Parceria${e.parceiro ? ` · ${e.parceiro}` : ""}`);
const acesso = (e: Evento) => (e.acesso === "vip" ? "Lista VIP" : "Aberto ao público");
const bairro = (e: Evento) => e.endereco.split(",")[0];

const mensagemQueroIr = (e: Evento) =>
  `Olá, Diamond Angels! Quero ir ao evento *${e.nome}* (${dataBR(e.data)}, ${e.hora}, ${e.local}). Como faço para entrar na lista?`;

function Foto({ e }: { e: Evento }) {
  return e.foto
    ? <img src={e.foto} alt={`Foto do evento ${e.nome}`} loading="lazy" decoding="async" />
    : <Cartaz id={e.id} />;
}

export default function Eventos() {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [hoje, setHoje] = useState<string | null>(null); // definido no navegador, não no build
  const [aberto, setAberto] = useState<Evento | null>(null);
  const grade = useRef<HTMLUListElement>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const origem = useRef<HTMLElement | null>(null);
  const primeira = useRef(true);

  useEffect(() => { setHoje(new Date().toLocaleDateString("sv-SE")); }, []);

  const futuros = useMemo(
    () => EVENTOS.filter((e) => !hoje || e.data >= hoje).sort((a, b) => a.data.localeCompare(b.data)),
    [hoje],
  );
  const lista = futuros.filter((e) => filtro === "todos" || e.realizacao === filtro);
  const contagem = (f: Filtro) => futuros.filter((e) => f === "todos" || e.realizacao === f).length;

  /* Troca de filtro: os cartões entram de novo, em sequência */
  useEffect(() => {
    if (primeira.current) { primeira.current = false; return; }
    if (matchMedia(MQ.reduzido).matches || !grade.current) return;
    gsap.fromTo(grade.current.children, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, ease: EASE, stagger: 0.07, overwrite: true });
    grade.current.scrollTo?.({ left: 0 });
  }, [filtro]);

  /* Detalhe do evento: <dialog> nativo (foco preso, Esc fecha), rolagem da página parada */
  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (aberto) {
      if (!d.open) d.showModal();
      getLenis()?.stop();
    } else if (d.open) {
      d.close();
    }
  }, [aberto]);

  const abrir = (e: Evento, el: HTMLElement) => { origem.current = el; setAberto(e); };
  const aoFechar = () => {
    setAberto(null);
    getLenis()?.start();
    origem.current?.focus({ preventScroll: true });
  };

  return (
    <section className="secao eventos" id="eventos">
      <div className="wrap">
        <header className="cab-secao cab-eventos">
          <div>
            <p className="rotulo" data-reveal>Agenda</p>
            <h2 data-split>Onde a Diamond <em>vai estar</em></h2>
          </div>
          <p className="lead" data-reveal>Eventos do clube e dos parceiros em um só lugar. Toque em um evento para ver local, mapa e como entrar na lista.</p>
        </header>

        <div className="filtros" role="group" aria-label="Filtrar eventos" data-reveal>
          {FILTROS.map((f) => (
            <button key={f.id} className="filtro" type="button" aria-pressed={filtro === f.id} onClick={() => setFiltro(f.id)}>
              {f.rotulo}<small>{contagem(f.id)}</small>
            </button>
          ))}
        </div>

        {lista.length === 0 ? (
          <p className="sem-eventos">Nenhum evento nesta categoria por enquanto. Siga o @diamondangels3 para saber das próximas datas.</p>
        ) : (
          <ul ref={grade} className="cards" data-stagger aria-live="polite">
            {lista.map((e) => {
              const { dia, mes, semana } = partesData(e.data);
              return (
                <li key={e.id} className="card">
                  <div className="card-foto">
                    <Foto e={e} />
                    <span className="card-data"><b>{dia}</b>{mes}</span>
                    <span className={`card-selo ${e.realizacao}`}>{e.realizacao === "diamond" ? "Diamond" : "Parceria"}</span>
                  </div>
                  <div className="card-info">
                    <h3>
                      <button type="button" className="card-abrir" onClick={(ev) => abrir(e, ev.currentTarget)}
                        aria-haspopup="dialog">{e.nome}</button>
                    </h3>
                    <p className="meta"><Icone id="pin" />{e.local} · {bairro(e)}</p>
                    <p className="meta"><Icone id="relogio" />{semana}, {e.hora}</p>
                    <div className="card-rodape">
                      <span className={`acesso${e.acesso === "vip" ? " vip" : ""}`}>{acesso(e)}</span>
                      <span className="ver" aria-hidden="true">Detalhes <Icone id="seta" /></span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {EVENTOS_SAO_EXEMPLO && <p className="nota">Datas, nomes e locais são exemplos. Para trocar, edite lib/eventos.ts.</p>}
      </div>

      <dialog ref={dialogo} className="detalhe" onClose={aoFechar} data-lenis-prevent aria-labelledby="detalhe-titulo"
        onClick={(ev) => { if (ev.target === ev.currentTarget) dialogo.current?.close(); }}>
        {aberto && (
          <div className="detalhe-corpo">
            <button type="button" className="fechar" onClick={() => dialogo.current?.close()} aria-label="Fechar">
              <Icone id="fechar" />
            </button>
            <div className="detalhe-foto"><Foto e={aberto} /></div>
            <div className="detalhe-info">
              <p className="rotulo">{selo(aberto)}</p>
              <h3 id="detalhe-titulo">{aberto.nome}</h3>
              <ul className="fatos">
                <li><Icone id="calendario" />{partesData(aberto.data).semana}, {dataBR(aberto.data)}</li>
                <li><Icone id="relogio" />A partir das {aberto.hora}</li>
                <li><Icone id="pin" /><span>{aberto.local}<small>{aberto.endereco}</small></span></li>
              </ul>
              <span className={`acesso${aberto.acesso === "vip" ? " vip" : ""}`}>{acesso(aberto)}</span>
              <p className="descricao">{aberto.descricao}</p>
              {aberto.destaques && aberto.destaques.length > 0 && (
                <ul className="destaques">{aberto.destaques.map((d) => <li key={d}>{d}</li>)}</ul>
              )}
              <div className="mapa">
                <iframe title={`Mapa: ${aberto.endereco}`} src={embedMapa(aberto.endereco)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
              <div className="detalhe-acoes">
                <a className="btn" href={linkWhatsApp(mensagemQueroIr(aberto))} target="_blank" rel="noopener"><Icone id="whatsapp" />Quero ir</a>
                <a className="btn vazado" href={linkMapa(aberto.endereco)} target="_blank" rel="noopener"><Icone id="pin" />Como chegar</a>
                {aberto.instagram && (
                  <a className="btn vazado" href={aberto.instagram} target="_blank" rel="noopener"><Icone id="instagram" />Instagram</a>
                )}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
