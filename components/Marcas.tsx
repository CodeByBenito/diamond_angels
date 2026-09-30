import FormMarcas from "./FormMarcas";
import { FLUXO, SERVICOS } from "@/lib/conteudo";

export default function Marcas() {
  return (
    <section className="secao marcas" id="marcas">
      <div className="wrap">
        <div className="marcas-topo">
          <header className="cab-secao">
            <p className="rotulo" data-reveal>Para marcas e produtoras</p>
            <h2 data-split>Seu evento <em>com a Diamond</em></h2>
            <p className="lead" data-reveal>Coloque sua festa, marca ou lançamento diante das mulheres que movimentam a noite de Salvador, com promotoria feita por quem já circula nos eventos da cidade.</p>
          </header>
          <div className="servicos-bloco">
            <ul className="servicos" data-stagger>
              {SERVICOS.map((s) => <li key={s.titulo}><b>{s.titulo}</b><span>{s.texto}</span></li>)}
            </ul>
            <ol className="fluxo" aria-label="Como funciona" data-reveal>
              {FLUXO.map((f, i) => <li key={f}><span>{String(i + 1).padStart(2, "0")}</span>{f}</li>)}
            </ol>
          </div>
        </div>
        <div data-reveal><FormMarcas /></div>
      </div>
    </section>
  );
}
