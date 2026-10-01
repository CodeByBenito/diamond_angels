import { numeroConvite } from "@/lib/convite";
import Icone from "../icones/Icone";
import s from "./Convite.module.css";

interface Props {
  nome: string;
  noites: string[];
  carimbado: boolean;
}

/**
 * O convite VIP, em formato de ingresso: corpo com o nome escrito à mão e canhoto destacável com o número.
 * Vai se completando enquanto ela responde (é a recompensa visível de cada passo).
 */
export default function CartaoConvite({ nome, noites, carimbado }: Props) {
  return (
    <div className={s.cartao} aria-label={nome ? `Convite Diamond de ${nome}` : "Seu convite Diamond"} role="img">
      <div className={s.corpo}>
        <div className={s.cartaoCab}>
          <img src="/logo-mark.webp" alt="" width={34} height={34} />
          <span>Convite Diamond</span>
        </div>
        <p className={`nome-escrito ${s.cartaoNome}${nome ? "" : ` ${s.vazioNome}`}`}>{nome || "Seu nome"}</p>
        <p className={s.cartaoNoite}>{noites.length ? noites.join(" · ") : "Sua noite"}</p>
      </div>
      <div className={s.canhoto}>
        <span className={s.canhotoRotulo}>Nº</span>
        <b>{nome ? numeroConvite(nome) : "····"}</b>
        <span className={`${s.carimbo}${carimbado ? ` ${s.carimbado}` : ""}`}>
          <Icone nome="check" />
          Na lista
        </span>
      </div>
    </div>
  );
}
