"use client";
import { useEffect, useRef } from "react";
import type { Evento } from "@/conteudo/eventos";
import { dataBR, partesData } from "@/lib/datas";
import { embedMapa, linkMapa } from "@/lib/mapas";
import { getLenis } from "@/lib/movimento";
import { linkWhatsApp, mensagemQueroIr } from "@/lib/whatsapp";
import Icone from "../icones/Icone";
import { useLista } from "../lista/ListaProvider";
import Cartaz from "../ui/Cartaz";
import "./EventoDetalhe.css";

export const seloEvento = (e: Evento) =>
  e.realizacao === "diamond" ? "Realização Diamond" : `Parceria${e.parceiro ? ` · ${e.parceiro}` : ""}`;
export const acessoEvento = (e: Evento) => (e.acesso === "vip" ? "Lista VIP" : "Aberto ao público");

/** Flyer do evento (AVIF quando o navegador aceita, WebP como reserva) ou o cartaz gerado. */
export function FotoEvento({ e }: { e: Evento }) {
  if (!e.foto) return <Cartaz id={e.id} />;
  const avif = e.foto.endsWith(".webp") ? e.foto.replace(/\.webp$/, ".avif") : null;
  return (
    <picture>
      {avif && <source srcSet={avif} type="image/avif" />}
      <img src={e.foto} alt={`Flyer do evento ${e.nome}`} loading="lazy" decoding="async" />
    </picture>
  );
}

/** Detalhe do evento: <dialog> nativo (foco preso, Esc fecha), rolagem da página parada. */
export default function EventoDetalhe({ evento, aoFechar }: { evento: Evento | null; aoFechar: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { nome } = useLista();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (evento) {
      if (!d.open) d.showModal();
      getLenis()?.stop();
    } else if (d.open) d.close();
  }, [evento]);

  /* Celular: arrastar a folha para baixo (com ela no topo) fecha o detalhe, como nos apps */
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    let inicio = -1;
    let dy = 0;
    const comeca = (e: TouchEvent) => {
      if (!matchMedia("(max-width: 760px)").matches || d.scrollTop > 0) return;
      inicio = e.touches[0].clientY;
      dy = 0;
    };
    const move = (e: TouchEvent) => {
      if (inicio < 0) return;
      dy = e.touches[0].clientY - inicio;
      if (dy <= 0 || d.scrollTop > 0) {
        d.style.transform = "";
        return;
      }
      d.style.transition = "none";
      d.style.transform = `translateY(${dy}px)`;
    };
    const solta = () => {
      if (inicio < 0) return;
      inicio = -1;
      d.style.transition = "";
      if (dy > 110) {
        d.style.transform = "translateY(100%)";
        setTimeout(() => d.close(), 220);
      } else d.style.transform = "";
    };
    d.addEventListener("touchstart", comeca, { passive: true });
    d.addEventListener("touchmove", move, { passive: true });
    d.addEventListener("touchend", solta);
    d.addEventListener("touchcancel", solta);
    return () => {
      d.removeEventListener("touchstart", comeca);
      d.removeEventListener("touchmove", move);
      d.removeEventListener("touchend", solta);
      d.removeEventListener("touchcancel", solta);
    };
  }, []);

  const fechar = () => {
    if (ref.current) ref.current.style.transform = ""; // a próxima abertura começa do jeito certo
    getLenis()?.start();
    aoFechar();
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: o clique no fundo é atalho; Esc e o botão Fechar já cobrem o teclado
    <dialog
      ref={ref}
      className="detalhe"
      onClose={fechar}
      data-lenis-prevent
      aria-labelledby="detalhe-titulo"
      onClick={(ev) => {
        if (ev.target === ev.currentTarget) ref.current?.close();
      }}
    >
      {evento && (
        <div className="detalhe-corpo">
          <span className="puxador" aria-hidden="true" />
          <button type="button" className="fechar" onClick={() => ref.current?.close()} aria-label="Fechar">
            <Icone nome="fechar" />
          </button>
          <div className="detalhe-foto">
            <FotoEvento e={evento} />
          </div>
          <div className="detalhe-info">
            <p className="rotulo">{seloEvento(evento)}</p>
            <h3 id="detalhe-titulo">{evento.nome}</h3>
            <ul className="fatos">
              <li>
                <Icone nome="calendario" />
                {partesData(evento.data).semana}, {dataBR(evento.data)}
              </li>
              <li>
                <Icone nome="relogio" />A partir das {evento.hora}
              </li>
              <li>
                <Icone nome="pin" />
                <span>
                  {evento.local}
                  <small>{evento.endereco}</small>
                </span>
              </li>
            </ul>
            <span className={`acesso${evento.acesso === "vip" ? " vip" : ""}`}>{acessoEvento(evento)}</span>
            <p className="descricao">{evento.descricao}</p>
            {evento.atracoes && evento.atracoes.length > 0 && (
              <div className="lineup">
                <p className="rotulo">Line-up</p>
                <ul>
                  {evento.atracoes.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {evento.destaques && evento.destaques.length > 0 && (
              <ul className="destaques">
                {evento.destaques.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
            <div className="mapa">
              <iframe
                title={`Mapa: ${evento.endereco}`}
                src={embedMapa(evento.endereco)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="detalhe-acoes">
              <a className="btn" href={linkWhatsApp(mensagemQueroIr(evento, nome))} target="_blank" rel="noopener">
                <Icone nome="whatsapp" />
                Quero ir
              </a>
              <a className="btn vazado" href={linkMapa(evento.endereco)} target="_blank" rel="noopener">
                <Icone nome="pin" />
                Como chegar
              </a>
              {evento.instagram && (
                <a className="btn vazado" href={evento.instagram} target="_blank" rel="noopener">
                  <Icone nome="instagram" />
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
