import { ICONES, type IconeNome } from "./catalogo";

interface Props {
  nome: IconeNome;
  /** Tamanho em px. Sem tamanho, o ícone acompanha o texto (1.15em) ou o CSS de quem o usa. */
  tamanho?: number;
  /** Texto para leitores de tela. Sem rótulo, o ícone é decorativo (aria-hidden). */
  rotulo?: string;
  className?: string;
}

/** Um ícone do conjunto Diamond Icons (veja catalogo.tsx e a página /icones). */
export default function Icone({ nome, tamanho, rotulo, className }: Props) {
  const acessivel = rotulo ?? undefined;
  return (
    <svg
      className={`icone${className ? ` ${className}` : ""}`}
      width={tamanho}
      height={tamanho}
      style={tamanho ? { width: tamanho, height: tamanho } : undefined}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={acessivel ? "img" : undefined}
      aria-label={acessivel}
      aria-hidden={acessivel ? undefined : true}
      focusable="false"
      data-icone={nome}
    >
      <use href={`#di-${nome}`} />
    </svg>
  );
}

export { ICONES, type IconeNome };
