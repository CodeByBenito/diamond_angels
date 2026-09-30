import Icone from "./Icone";
import { BENEFICIOS, LINKS, PASSOS_ENTRAR } from "@/lib/conteudo";

export default function Beneficios() {
  return (
    <section className="secao beneficios" id="beneficios">
      <div className="wrap">
        <header className="cab-secao centro">
          <p className="rotulo" data-reveal>Para quem faz parte</p>
          <h2 data-split>Fazer parte <em>abre portas</em></h2>
          <p className="lead" data-reveal>O que cada Angel recebe ao entrar para o time.</p>
        </header>

        <ul className="grade-beneficios" data-stagger>
          {BENEFICIOS.map((b) => (
            <li key={b.titulo} className="beneficio">
              <Icone id={b.icone} />
              <h3>{b.titulo}</h3>
              <p>{b.texto}</p>
            </li>
          ))}
        </ul>

        <div className="entrar">
          <div className="entrar-cab" data-reveal>
            <p className="rotulo">Como entrar</p>
            <h3>Três passos para entrar no time</h3>
          </div>
          <ol className="passos" data-stagger>
            {PASSOS_ENTRAR.map((p, i) => (
              <li key={p.titulo}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <b>{p.titulo}</b>
                <span>{p.texto}</span>
              </li>
            ))}
          </ol>
          <div className="entrar-acoes" data-reveal>
            <a className="btn" href={LINKS.agencia} target="_blank" rel="noopener"><Icone id="instagram" />Falar com @bwagency7</a>
            <a className="btn vazado" href={LINKS.clube} target="_blank" rel="noopener">Seguir @diamondangels3</a>
          </div>
        </div>
      </div>
    </section>
  );
}
