import { LOOKS } from "@/lib/conteudo";

const REVELA = ["left", "up", "right"] as const;

/** Ato 2 — a folha de chamada do bastidor. Cada look carimba a pulseira ([data-carimbo]). */
export default function Camarim() {
  return (
    <section className="ato camarim" id="camarim" data-bg="#0b0708" data-ink="#efe6d6">
      <div className="wrap grade">
        <div>
          <div className="ficha mono"><span>Folha de chamada · Backstage</span><span>Salvador, BA · @diamondangels3</span></div>
          <h2 data-reveal="up">Um clube feito para as <em>mulheres</em> de Salvador. A gente reúne, divulga e abre portas.</h2>
        </div>
        <div className="arara">
          {LOOKS.map((l, i) => (
            <article key={l.num} className="etiqueta" data-reveal={REVELA[i]} data-delay={i * 0.12} data-carimbo={i + 1}>
              <span className="fio" aria-hidden="true" />
              <span className="mono">Look {l.num}</span>
              <h3>{l.titulo}</h3>
              <p>{l.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
