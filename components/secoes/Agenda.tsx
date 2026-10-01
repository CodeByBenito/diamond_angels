"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { EVENTOS, EVENTOS_SAO_EXEMPLO, type Evento, type Realizacao } from "@/conteudo/eventos";
import { hojeISO, partesData } from "@/lib/datas";
import { EASE, gsap, MQ } from "@/lib/movimento";
import Icone from "../icones/Icone";
import s from "./Agenda.module.css";
import EventoDetalhe, { acessoEvento, FotoEvento } from "./EventoDetalhe";

type Filtro = "todos" | Realizacao;
const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: "todos", rotulo: "Todas" },
  { id: "diamond", rotulo: "Diamond" },
  { id: "parceria", rotulo: "Parcerias" },
];

/** Cena 4 — A agenda: uma parede de cartazes que desliza de lado (dedo, roda, arraste ou setas). */
export default function Agenda() {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [hoje, setHoje] = useState<string | null>(null); // definido no navegador, não no build
  const [aberto, setAberto] = useState<Evento | null>(null);
  const [nasPontas, setNasPontas] = useState({ inicio: true, fim: false });
  const [pausada, setPausada] = useState(false); // pausa pedida pela visitante (botão)
  const trilho = useRef<HTMLUListElement>(null);
  const barra = useRef<HTMLElement>(null);
  const detalheAberto = useRef(false);
  const origem = useRef<HTMLElement | null>(null);
  const primeira = useRef(true);

  useEffect(() => setHoje(hojeISO()), []);

  const futuros = useMemo(
    () => EVENTOS.filter((e) => !hoje || e.data >= hoje).sort((a, b) => a.data.localeCompare(b.data)),
    [hoje],
  );
  const lista = futuros.filter((e) => filtro === "todos" || e.realizacao === filtro);
  const temLista = lista.length > 0;
  detalheAberto.current = aberto !== null;
  const contagem = (f: Filtro) => futuros.filter((e) => f === "todos" || e.realizacao === f).length;
  // só mostra categorias com eventos; com uma categoria só, filtrar não muda nada e o grupo some
  const filtrosVisiveis = FILTROS.filter((f) => f.id === "todos" || contagem(f.id) > 0);
  const temFiltros = filtrosVisiveis.length > 2;

  /* Troca de filtro: os cartazes entram de novo, em sequência */
  // biome-ignore lint/correctness/useExhaustiveDependencies: roda de propósito a cada troca de filtro
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    const t = trilho.current;
    if (!t) return;
    t.scrollTo({ left: 0 });
    if (!matchMedia(MQ.reduzido).matches)
      gsap.fromTo(
        t.children,
        { autoAlpha: 0, x: 40 },
        { autoAlpha: 1, x: 0, duration: 1, ease: EASE, stagger: 0.07, overwrite: true },
      );
  }, [filtro]);

  /* Arrastar com o mouse (no toque, a rolagem nativa já desliza) + barra de progresso */
  // biome-ignore lint/correctness/useExhaustiveDependencies: o trilho é recriado quando a lista some e volta
  useEffect(() => {
    const t = trilho.current;
    if (!t) return;
    let inicioX = 0;
    let inicioScroll = 0;
    let arrastou = false;
    let ativo = false;
    // barra de progresso direto no estilo (sem re-renderizar a cada quadro) e setas só quando mudam
    const medir = () => {
      const max = t.scrollWidth - t.clientWidth;
      const p = max > 0 ? t.scrollLeft / max : 1;
      if (barra.current) barra.current.style.transform = `scaleX(${Math.max(0.08, p).toFixed(3)})`;
      const inicio = p <= 0.01;
      const fim = p >= 0.99;
      setNasPontas((a) => (a.inicio === inicio && a.fim === fim ? a : { inicio, fim }));
    };
    const baixo = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      ativo = true;
      arrastou = false;
      inicioX = e.clientX;
      inicioScroll = t.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!ativo) return;
      const dx = e.clientX - inicioX;
      if (Math.abs(dx) > 6 && !arrastou) {
        arrastou = true;
        t.classList.add(s.arrastando);
        t.setPointerCapture(e.pointerId);
      }
      if (arrastou) t.scrollLeft = inicioScroll - dx;
    };
    const cima = () => {
      ativo = false;
      t.classList.remove(s.arrastando);
    };
    const clique = (e: MouseEvent) => {
      if (arrastou) {
        e.preventDefault();
        e.stopPropagation();
        arrastou = false;
      }
    };
    t.addEventListener("pointerdown", baixo);
    t.addEventListener("pointermove", move);
    t.addEventListener("pointerup", cima);
    t.addEventListener("pointercancel", cima);
    t.addEventListener("click", clique, true);
    t.addEventListener("scroll", medir, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(t);
    return () => {
      t.removeEventListener("pointerdown", baixo);
      t.removeEventListener("pointermove", move);
      t.removeEventListener("pointerup", cima);
      t.removeEventListener("pointercancel", cima);
      t.removeEventListener("click", clique, true);
      t.removeEventListener("scroll", medir);
      ro.disconnect();
    };
  }, [temLista]);

  /*
   * Esteira: os cartazes deslizam sozinhos, desaceleram na ponta, param um instante e voltam.
   * Para enquanto a visitante usa (mouse em cima, toque, arraste, roda, teclado, detalhe aberto),
   * quando a seção sai da tela, quando a aba fica oculta ou pelo botão de pausa.
   * Com "reduzir movimento" ligado no sistema, a esteira não anda sozinha.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: reinicia quando o trilho é recriado ou o filtro muda
  useEffect(() => {
    const t = trilho.current;
    if (!t || pausada || matchMedia(MQ.reduzido).matches) return;
    const VEL = matchMedia(MQ.celular).matches ? 30 : 42; // px por segundo
    const FREIO = 110; // px antes da ponta em que começa a desacelerar
    let pos = t.scrollLeft;
    let ultimo = pos;
    let dir = 1;
    let v = 0;
    let espera = performance.now() + 1200;
    let ocupado = false;
    let retomarEm = 0;
    let visivel = false;
    let rodando = false;
    let raf = 0;
    let antes = performance.now();

    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
    });
    io.observe(t);

    const ocupar = () => {
      ocupado = true;
    };
    const soltar = (atraso: number) => () => {
      ocupado = false;
      retomarEm = performance.now() + atraso;
    };
    const entrouMouse = (e: PointerEvent) => e.pointerType === "mouse" && ocupar();
    const saiuMouse = (e: PointerEvent) => e.pointerType === "mouse" && soltar(700)();
    const fimToque = soltar(2600);
    const rodou = () => {
      retomarEm = performance.now() + 2600;
    };
    const focou = ocupar;
    const desfocou = soltar(1200);
    // se a visitante rolou na mão, a esteira continua de onde ela parou
    const sincronizar = () => {
      if (Math.abs(t.scrollLeft - ultimo) > 2) {
        pos = t.scrollLeft;
        ultimo = pos;
      }
    };

    t.addEventListener("pointerenter", entrouMouse);
    t.addEventListener("pointerleave", saiuMouse);
    t.addEventListener("touchstart", ocupar, { passive: true });
    t.addEventListener("touchend", fimToque);
    t.addEventListener("wheel", rodou, { passive: true });
    t.addEventListener("focusin", focou);
    t.addEventListener("focusout", desfocou);
    t.addEventListener("scroll", sincronizar, { passive: true });

    const quadro = (agora: number) => {
      const dt = Math.min(0.05, (agora - antes) / 1000);
      antes = agora;
      const max = t.scrollWidth - t.clientWidth;
      const parada = !visivel || ocupado || agora < retomarEm || document.hidden || detalheAberto.current || max <= 4;
      if (parada) {
        if (rodando) {
          rodando = false;
          v = 0;
          t.classList.remove(s.esteira);
        }
        pos = t.scrollLeft;
        ultimo = pos;
      } else {
        if (!rodando) {
          rodando = true;
          t.classList.add(s.esteira); // sem encaixe enquanto a esteira anda
        }
        if (agora >= espera) {
          const resta = dir > 0 ? max - pos : pos;
          const freio = Math.min(1, Math.max(0.25, resta / FREIO));
          v += (dir * VEL * freio - v) * Math.min(1, dt * 2.5); // acelera e freia macio
          pos += v * dt;
          if (pos >= max || pos <= 0) {
            pos = Math.min(max, Math.max(0, pos));
            dir = pos >= max ? -1 : 1;
            v = 0;
            espera = agora + 1400; // respira na ponta antes de voltar
          }
          t.scrollLeft = pos;
          ultimo = t.scrollLeft;
        }
      }
      raf = requestAnimationFrame(quadro);
    };
    raf = requestAnimationFrame(quadro);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      t.classList.remove(s.esteira);
      t.removeEventListener("pointerenter", entrouMouse);
      t.removeEventListener("pointerleave", saiuMouse);
      t.removeEventListener("touchstart", ocupar);
      t.removeEventListener("touchend", fimToque);
      t.removeEventListener("wheel", rodou);
      t.removeEventListener("focusin", focou);
      t.removeEventListener("focusout", desfocou);
      t.removeEventListener("scroll", sincronizar);
    };
  }, [temLista, pausada, filtro]);

  const passo = (dir: 1 | -1) => {
    const t = trilho.current;
    const card = t?.firstElementChild as HTMLElement | null;
    if (!t || !card) return;
    t.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: matchMedia(MQ.reduzido).matches ? "auto" : "smooth" });
  };

  const abrir = (e: Evento, el: HTMLElement) => {
    origem.current = el;
    setAberto(e);
  };

  return (
    <section className={`secao ${s.agenda}`} id="agenda" data-bg="#120b0d">
      <div className={`wrap ${s.cab}`}>
        <div className={s.titulo}>
          <p className="rotulo" data-reveal>
            A agenda
          </p>
          <h2 data-split>
            Onde a Diamond <em>vai estar</em>
          </h2>
          <p className="lead" data-reveal>
            Noites do clube e dos parceiros. Toque num cartaz para ver local, mapa e como entrar na lista.
          </p>
        </div>
        <div className={s.controles} data-reveal>
          {temFiltros && (
            <div className={s.filtros} role="group" aria-label="Filtrar eventos">
              {filtrosVisiveis.map((f) => (
                <button
                  key={f.id}
                  className={s.filtro}
                  type="button"
                  aria-pressed={filtro === f.id}
                  onClick={() => setFiltro(f.id)}
                >
                  {f.rotulo}
                  <small>{contagem(f.id)}</small>
                </button>
              ))}
            </div>
          )}
          <div className={s.setas}>
            <button
              type="button"
              className={s.pausa}
              onClick={() => setPausada((p) => !p)}
              aria-pressed={pausada}
              aria-label={pausada ? "Retomar a esteira de cartazes" : "Pausar a esteira de cartazes"}
              title={pausada ? "Retomar" : "Pausar"}
            >
              <Icone nome={pausada ? "play" : "pausa"} />
            </button>
            <button
              type="button"
              className={s.seta}
              onClick={() => passo(-1)}
              aria-label="Cartazes anteriores"
              disabled={nasPontas.inicio}
            >
              <Icone nome="seta" className={s.voltar} />
            </button>
            <button
              type="button"
              className={s.seta}
              onClick={() => passo(1)}
              aria-label="Próximos cartazes"
              disabled={nasPontas.fim}
            >
              <Icone nome="seta" />
            </button>
          </div>
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="wrap">
          <p className={s.vazio}>
            Nenhuma noite nesta categoria por enquanto. Siga o @diamondangels3 para saber das próximas datas.
          </p>
        </div>
      ) : (
        <ul ref={trilho} className={s.trilho} aria-label="Cartazes dos próximos eventos">
          {lista.map((e) => {
            const { dia, mes, semana } = partesData(e.data);
            return (
              <li key={e.id} className={s.cartaz}>
                <div className={s.foto}>
                  <FotoEvento e={e} />
                  <span className={s.data}>
                    <b>{dia}</b>
                    {mes}
                  </span>
                  <span className={`${s.selo} ${e.realizacao === "diamond" ? s.diamond : s.parceria}`}>
                    {e.realizacao === "diamond" ? "Diamond" : "Parceria"}
                  </span>
                  <span className={`acesso${e.acesso === "vip" ? " vip" : ""} ${s.acessoFoto}`}>{acessoEvento(e)}</span>
                </div>
                <h3>
                  <button type="button" className={s.abrir} onClick={(ev) => abrir(e, ev.currentTarget)} aria-haspopup="dialog">
                    {e.nome}
                  </button>
                </h3>
                <p className={s.meta}>
                  <Icone nome="pin" />
                  {e.local} · {semana}, {e.hora}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <div className={`wrap ${s.rodape}`}>
        <span className={s.barra} aria-hidden="true">
          <i ref={barra} />
        </span>
        {EVENTOS_SAO_EXEMPLO && (
          <p className="nota">Datas, nomes e locais são exemplos. Para trocar, edite conteudo/eventos.ts.</p>
        )}
      </div>

      <EventoDetalhe
        evento={aberto}
        aoFechar={() => {
          setAberto(null);
          origem.current?.focus({ preventScroll: true });
        }}
      />
    </section>
  );
}
