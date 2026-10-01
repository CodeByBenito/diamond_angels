"use client";
import { LINKS } from "@/conteudo/contato";
import { PASSOS_ENTRAR } from "@/conteudo/textos";
import { primeiroNome } from "@/lib/nome";
import { linkWhatsApp, mensagemEntrar } from "@/lib/whatsapp";
import Icone from "../icones/Icone";
import Lista from "../lista/Lista";
import { useLista } from "../lista/ListaProvider";
import s from "./NaLista.module.css";

/** Cena 6 — Seu nome na lista. A lista volta com o nome dela; uma chamada só. */
export default function NaLista() {
  const { nome, pronto } = useLista();
  const comNome = pronto && !!nome;

  return (
    <section className={`secao ${s.final}`} id="lista" data-bg="#0a0708" aria-labelledby="lista-titulo">
      <div className={s.aura} aria-hidden="true" />
      <div className={`wrap ${s.grade}`}>
        <div className={s.texto}>
          <p className="rotulo" data-reveal>
            Seu nome na lista
          </p>
          <div data-reveal>
            <h2 id="lista-titulo">
              {comNome ? (
                <>
                  {primeiroNome(nome)}, <em>sua noite começa aqui.</em>
                </>
              ) : (
                <>
                  Seu lugar <em>está reservado.</em>
                </>
              )}
            </h2>
          </div>
          <ol className={s.passos} data-stagger>
            {PASSOS_ENTRAR.map((p, i) => (
              <li key={p.titulo}>
                <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                <b>{p.titulo}</b>
                <span>{p.texto}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={s.lado}>
          <Lista variante="final" />
          <a className={`btn btn-grande ${s.cta}`} href={linkWhatsApp(mensagemEntrar(nome))} target="_blank" rel="noopener">
            <Icone nome="whatsapp" />
            {comNome ? "Confirmar pelo WhatsApp" : "Quero ser Angel"}
          </a>
          <p className={s.alternativa}>
            Prefere o Instagram?{" "}
            <a className="link-seta" href={LINKS.agencia} target="_blank" rel="noopener">
              Fale com @bwagency7
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
