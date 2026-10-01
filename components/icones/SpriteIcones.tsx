import { ICONES, NOMES_ICONES } from "./catalogo";

/**
 * Sprite único com todos os ícones como <symbol>. Entra uma vez na página;
 * cada <Icone> só referencia o desenho (<use>), sem repetir os caminhos no HTML.
 */
export default function SpriteIcones() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute", overflow: "hidden" }}>
      <defs>
        {NOMES_ICONES.map((nome) => (
          <symbol key={nome} id={`di-${nome}`} viewBox="0 0 24 24">
            {ICONES[nome].desenho}
          </symbol>
        ))}
      </defs>
    </svg>
  );
}
