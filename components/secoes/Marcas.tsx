import { PARCEIROS } from "@/conteudo/parceiros";
import { FLUXO, SERVICOS } from "@/conteudo/textos";
import s from "./Marcas.module.css";

/** Cena 5 — Para marcas: "a outra porta". O fundo viaja para o rubi. */
export default function Marcas({ children }: { children: React.ReactNode }) {
  return (
    <section className={`secao ${s.marcas}`} id="marcas" data-bg="#2a0710">
      <div className="wrap">
        <div className={s.topo}>
          <header className={s.cab}>
            <p className="rotulo" data-reveal>
              Para marcas e produtoras
            </p>
            <h2 data-split>
              A outra porta: <em>seu evento com a Diamond</em>
            </h2>
            <p className="lead" data-reveal>
              Coloque sua festa, marca ou lançamento diante das mulheres que movimentam a noite de Salvador, com promotoria feita
              por quem já circula nos eventos da cidade.
            </p>
          </header>
          <div className={s.bloco}>
            <ul className={s.servicos} data-stagger>
              {SERVICOS.map((sv) => (
                <li key={sv.titulo}>
                  <b>{sv.titulo}</b>
                  <span>{sv.texto}</span>
                </li>
              ))}
            </ul>
            <ol className={s.fluxo} aria-label="Como funciona" data-stagger>
              {FLUXO.map((f, i) => (
                <li key={f}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {f}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {PARCEIROS.length > 0 && (
          <div className={s.parceiros} data-reveal>
            <p className="rotulo">Quem já esteve com a Diamond</p>
            <ul>
              {PARCEIROS.map((p) => (
                <li key={p.nome}>
                  {p.site ? (
                    <a href={p.site} target="_blank" rel="noopener" aria-label={p.nome}>
                      <img src={p.logo} alt={p.nome} loading="lazy" decoding="async" />
                    </a>
                  ) : (
                    <img src={p.logo} alt={p.nome} loading="lazy" decoding="async" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={s.form} data-desvelar>
          {children}
        </div>
      </div>
    </section>
  );
}
