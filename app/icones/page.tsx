import type { Metadata } from "next";
import { ICONES, NOMES_ICONES } from "@/components/icones/catalogo";
import Icone from "@/components/icones/Icone";
import SpriteIcones from "@/components/icones/SpriteIcones";
import s from "./icones.module.css";

export const metadata: Metadata = {
  title: "Diamond Icons · Catálogo",
  robots: { index: false, follow: false },
};

/** Catálogo interno dos ícones (não aparece no Google). Abra em /icones. */
export default function Catalogo() {
  const grupos = [...new Set(NOMES_ICONES.map((n) => ICONES[n].grupo))];
  return (
    <main className={s.pagina}>
      <SpriteIcones />
      <header className={s.cab}>
        <p className="rotulo">Diamond Angels</p>
        <h1>Diamond Icons</h1>
        <p className="lead">
          Grade 24×24, traço de 1,5, cantos em chanfro de 45° (o corte do diamante) e o losango como detalhe de marca. Use com{" "}
          <code>{'<Icone nome="pin" />'}</code>. Para criar um ícone novo, siga as regras em{" "}
          <code>components/icones/catalogo.tsx</code>.
        </p>
      </header>
      {grupos.map((g) => (
        <section key={g} className={s.grupo}>
          <h2>{g}</h2>
          <ul>
            {NOMES_ICONES.filter((n) => ICONES[n].grupo === g).map((n) => (
              <li key={n}>
                <span className={s.amostra}>
                  <Icone nome={n} tamanho={40} />
                </span>
                <span className={s.amostraP}>
                  <Icone nome={n} tamanho={20} />
                </span>
                <b>{ICONES[n].rotulo}</b>
                <code>{n}</code>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
