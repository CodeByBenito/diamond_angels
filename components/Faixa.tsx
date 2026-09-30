const PALAVRAS = ["Events", "Lista VIP", "Influence", "Benefícios", "Experiences", "Conexões"];

/** Faixa dourada que corre devagar entre o hero e o clube. Puramente decorativa. */
export default function Faixa() {
  const linha = (
    <span className="faixa-linha">
      {PALAVRAS.map((p) => <span key={p}>{p}<i>◆</i></span>)}
    </span>
  );
  return (
    <div className="faixa" aria-hidden="true">
      <div className="faixa-trilho">{linha}{linha}</div>
    </div>
  );
}
