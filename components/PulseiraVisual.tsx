/** O desenho da pulseira VIP, usado no canto da tela e no botão final. */
export default function PulseiraVisual({ linha1, linha2, carimbada }: { linha1: string; linha2: string; carimbada?: boolean }) {
  return (
    <>
      <span className="txt"><span>{linha1}</span><b>{linha2}</b></span>
      <span className="selos" aria-hidden="true">
        {["EV", "IN", "EX"].map((s, i) => (
          <span key={s} className={`selo${carimbada ? " ok" : ""}`} data-selo={i + 1}>{s}</span>
        ))}
      </span>
      <span className="aba" aria-hidden="true" />
    </>
  );
}
