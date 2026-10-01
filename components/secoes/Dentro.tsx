import { LINKS, SEGUIDORAS } from "@/conteudo/contato";
import { PILARES } from "@/conteudo/textos";
import Saudacao from "../lista/Saudacao";
import s from "./Dentro.module.css";

/** Cena 2 — Do lado de dentro. Calma: quem é a Diamond, em três placas gravadas. */
export default function Dentro() {
  return (
    <section className={`secao ${s.dentro}`} id="dentro" data-bg="#0a0708">
      <img
        className={s.marcaDagua}
        src="/logo-mark.webp"
        alt=""
        width={320}
        height={320}
        loading="lazy"
        decoding="async"
        data-parallax="0.3"
        aria-hidden="true"
      />
      <div className={`wrap ${s.grade}`}>
        <div className={s.texto}>
          <p className="rotulo" data-reveal>
            Do lado de dentro
          </p>
          <div data-reveal data-delay="0.1">
            <Saudacao className={s.saudacao} />
          </div>
          <h2 data-split>
            Um clube feito para as <em>mulheres</em> de Salvador.
          </h2>
          <p className="lead" data-reveal>
            A gente reúne, divulga e abre portas. A Diamond Angels conecta mulheres da cidade aos melhores eventos, marcas e
            produtores, com lista VIP, benefícios e visibilidade para quem faz parte.
          </p>
          <a className={s.numero} href={LINKS.clube} target="_blank" rel="noopener" data-reveal>
            <b>{SEGUIDORAS}</b>
            <span>
              seguidoras no <u>@diamondangels3</u>
            </span>
          </a>
        </div>
        <ol className={s.placas} data-stagger>
          {PILARES.map((p) => (
            <li key={p.num} className={s.placa}>
              <span className={s.num}>{p.num}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
