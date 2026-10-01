"use client";
import { useEffect, useId, useRef, useState } from "react";
import { partesData } from "@/lib/datas";
import Icone from "../icones/Icone";
import s from "./Lista.module.css";
import { useLista } from "./ListaProvider";

/**
 * A "Lista Diamond": três linhas reservadas e a próxima linha livre para o nome da visitante.
 * Ao entrar, o nome é escrito à mão em dourado e recebe o carimbo "Na lista".
 */
export default function Lista({ variante = "porta" }: { variante?: "porta" | "final" }) {
  const { nome, pronto, entrar } = useLista();
  const [editando, setEditando] = useState(false);
  const [recemEscrito, setRecemEscrito] = useState(false);
  const [hoje, setHoje] = useState("");
  const campo = useRef<HTMLInputElement>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const [rebater, setRebater] = useState(false);
  const id = useId();

  useEffect(() => {
    const { dia, mes } = partesData(new Date().toLocaleDateString("sv-SE"));
    setHoje(`${dia} ${mes}`);
  }, []);

  useEffect(() => {
    if (editando) campo.current?.focus();
  }, [editando]);

  const mostrarNome = pronto && nome && !editando;

  /* Fechamento da assinatura: na lista final, o carimbo bate de novo quando ela entra na tela */
  useEffect(() => {
    const el = raiz.current;
    if (variante !== "final" || !el || !mostrarNome) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setRebater(true);
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [variante, mostrarNome]);

  function enviar(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const valor = new FormData(ev.currentTarget).get("nome");
    if (!String(valor ?? "").trim()) {
      campo.current?.focus();
      return;
    }
    entrar(String(valor));
    setEditando(false);
    setRecemEscrito(true);
  }

  return (
    <div ref={raiz} className={`${s.lista} ${s[variante]}`}>
      <div className={s.cab}>
        <img src="/logo-mark.webp" alt="" width={34} height={34} />
        <div>
          <p className={s.titulo}>Lista Diamond</p>
          <p className={s.sub}>{hoje ? `Hoje · ${hoje}` : "Salvador · BA"}</p>
        </div>
      </div>

      <ol className={s.linhas}>
        {[0, 1, 2].map((i) => (
          <li key={i} className={s.reservada}>
            <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
            <span className={s.tarja} style={{ width: `${[62, 48, 56][i]}%` }} aria-hidden="true" />
            <span className={s.reservado}>
              <Icone nome="cadeado" />
              Reservado
            </span>
          </li>
        ))}
        <li className={`${s.livre}${mostrarNome ? ` ${s.preenchida}` : ""}`} aria-live="polite">
          <span className={s.num}>04</span>
          {mostrarNome ? (
            <>
              <span className={`nome-escrito ${s.nome}${recemEscrito ? ` ${s.escrevendo}` : ""}`}>{nome}</span>
              <span className={`${s.carimbo}${recemEscrito ? ` ${s.carimbando}` : rebater ? ` ${s.rebatendo}` : ""}`}>
                <Icone nome="check" />
                Na lista
              </span>
            </>
          ) : (
            <form className={s.form} onSubmit={enviar}>
              <label htmlFor={id} className="sr">
                Seu nome
              </label>
              <input
                ref={campo}
                id={id}
                name="nome"
                defaultValue={nome}
                placeholder="Escreva seu nome"
                autoComplete="given-name"
                maxLength={40}
                enterKeyHint="go"
              />
              <button className="btn btn-sm" type="submit">
                Entrar na lista
              </button>
            </form>
          )}
        </li>
      </ol>

      <p className={s.rodape}>
        {mostrarNome ? (
          <button type="button" className={s.editar} onClick={() => setEditando(true)}>
            <Icone nome="caneta" />
            Trocar o nome
          </button>
        ) : (
          <span>Seu nome fica só neste aparelho.</span>
        )}
      </p>
    </div>
  );
}
