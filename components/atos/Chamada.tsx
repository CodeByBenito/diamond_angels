import PulseiraVisual from "../PulseiraVisual";
import { LINKS } from "@/lib/conteudo";

/** Ato 6 — a pulseira chega aqui e vira o botão. Uma chamada só. */
export default function Chamada() {
  return (
    <section className="ato chamada" id="chamada" data-bg="#0b0708" data-ink="#efe6d6">
      <div className="wrap">
        <span className="mono">Última chamada</span>
        <h2 data-reveal="up">Entre para o time</h2>
        <p>Sua pulseira está pronta. Chame a equipe no Instagram, conte um pouco sobre você e receba as próximas etapas.</p>
        <div className="alvo">
          <a className="pulseira" id="pulseira-cta" href={LINKS.agencia} target="_blank" rel="noopener" data-cursor="Abrir Instagram">
            <PulseiraVisual linha1="Diamond Angels" linha2="Entre para o time →" carimbada />
          </a>
        </div>
      </div>
    </section>
  );
}
