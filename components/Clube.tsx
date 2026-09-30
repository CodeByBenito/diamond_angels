import { LINKS, PILARES } from "@/lib/conteudo";

export default function Clube() {
  return (
    <section className="secao clube" id="clube">
      <img className="marca-dagua" src="/logo-mark.webp" alt="" width={320} height={320} loading="lazy" decoding="async" data-parallax="0.3" aria-hidden="true" />
      <div className="wrap grade-clube">
        <div className="clube-texto">
          <p className="rotulo" data-reveal>O clube</p>
          <h2 data-split>Um clube feito para as <em>mulheres</em> de Salvador.</h2>
          <p className="lead" data-reveal>A gente reúne, divulga e abre portas. A Diamond Angels conecta mulheres da cidade aos melhores eventos, marcas e produtores, com lista VIP, benefícios e visibilidade para quem faz parte.</p>
          <a className="numero" href={LINKS.clube} target="_blank" rel="noopener" data-reveal>
            <b>15,6 mil</b>
            <span>seguidoras no <u>@diamondangels3</u></span>
          </a>
        </div>
        <ol className="pilares" data-stagger>
          {PILARES.map((p) => (
            <li key={p.num}>
              <span className="num">{p.num}</span>
              <div>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
