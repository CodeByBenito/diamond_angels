"use client";
import { primeiroNome } from "@/lib/nome";
import Convite from "../convite/Convite";
import { useLista } from "../lista/ListaProvider";
import s from "./NaLista.module.css";

/**
 * Cena 6 — Quero ser Angel. A captação de novas integrantes: o Convite Diamond em quatro toques,
 * que sai pronto pelo WhatsApp e vira story marcando a Diamond (cada nova Angel divulga o clube).
 */
export default function NaLista() {
  const { nome, pronto } = useLista();
  const comNome = pronto && !!nome;

  return (
    <section className={`secao ${s.final}`} id="lista" data-bg="#0a0708" aria-labelledby="lista-titulo">
      <div className={s.aura} aria-hidden="true" />
      <div className="wrap">
        <header className={s.cab}>
          <p className="rotulo" data-reveal>
            Quero ser Angel
          </p>
          <div data-reveal>
            <h2 id="lista-titulo">
              {comNome ? (
                <>
                  {primeiroNome(nome)}, <em>falta pouco para entrar.</em>
                </>
              ) : (
                <>
                  Monte seu convite. <em>Sua noite começa aqui.</em>
                </>
              )}
            </h2>
          </div>
          <p className="lead" data-reveal>
            Quatro toques para a equipe conhecer você. No fim, o convite sai pronto no WhatsApp da Diamond e você ainda pode
            postar nos stories.
          </p>
        </header>
        <div className={s.corpo} data-reveal>
          <Convite />
        </div>
      </div>
    </section>
  );
}
