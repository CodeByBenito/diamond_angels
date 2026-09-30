import { LINKS } from "@/lib/conteudo";

export default function Chamada() {
  return (
    <section className="secao chamada">
      <div className="aura" aria-hidden="true" />
      <div className="wrap">
        <img src="/logo-mark.webp" alt="" width={120} height={120} loading="lazy" decoding="async" data-reveal />
        <h2 data-split>Seu lugar <em>está reservado</em></h2>
        <p className="lead" data-reveal>Chame a equipe no Instagram, conte um pouco sobre você e receba as próximas etapas para entrar no time.</p>
        <div className="acoes" data-reveal>
          <a className="btn btn-grande" href={LINKS.agencia} target="_blank" rel="noopener">Quero ser Angel</a>
          <a className="btn vazado btn-grande" href="#marcas">Divulgar meu evento</a>
        </div>
      </div>
    </section>
  );
}
