import { LINKS, WHATSAPP } from "@/conteudo/contato";
import { NAV } from "@/conteudo/textos";
import { linkWhatsApp } from "@/lib/whatsapp";
import Icone from "./Icone";
import s from "./Rodape.module.css";

export default function Rodape() {
  return (
    <footer className={s.rodape}>
      <div className={`wrap ${s.grade}`}>
        <div className={s.marca}>
          <img src="/logo.webp" alt="Diamond Angels" width={150} height={124} loading="lazy" decoding="async" />
          <p>O clube feminino de Salvador.</p>
        </div>
        <nav aria-label="Rodapé">
          <p className="rotulo">Navegar</p>
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`}>
              {n.rotulo}
            </a>
          ))}
        </nav>
        <div>
          <p className="rotulo">Contato</p>
          <a href={linkWhatsApp("Olá, Diamond Angels!")} target="_blank" rel="noopener">
            <Icone id="whatsapp" />
            {WHATSAPP.exibicao}
          </a>
          <a href={LINKS.clube} target="_blank" rel="noopener">
            <Icone id="instagram" />
            @diamondangels3
          </a>
          <a href={LINKS.agencia} target="_blank" rel="noopener">
            <Icone id="instagram" />
            @bwagency7
          </a>
          <a href={LINKS.fundadora} target="_blank" rel="noopener">
            <Icone id="instagram" />
            @bruwolker
          </a>
        </div>
      </div>
      <div className={`wrap ${s.base}`}>
        <span>© 2026 Diamond Angels · Salvador, BA</span>
        <a href="#porta">Voltar à porta ↑</a>
      </div>
    </footer>
  );
}
