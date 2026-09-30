import Icone from "./Icone";
import { LINKS, NAV } from "@/lib/conteudo";
import { WHATSAPP, linkWhatsApp } from "@/lib/whatsapp";

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="wrap rodape-grade">
        <div className="rodape-marca">
          <img src="/logo.webp" alt="Diamond Angels" width={150} height={124} loading="lazy" decoding="async" />
          <p>O clube feminino de Salvador.</p>
        </div>
        <nav aria-label="Rodapé">
          <p className="rotulo">Navegar</p>
          {NAV.map((n) => <a key={n.id} href={`#${n.id}`}>{n.rotulo}</a>)}
        </nav>
        <div>
          <p className="rotulo">Contato</p>
          <a href={linkWhatsApp("Olá, Diamond Angels!")} target="_blank" rel="noopener"><Icone id="whatsapp" />{WHATSAPP.exibicao}</a>
          <a href={LINKS.clube} target="_blank" rel="noopener"><Icone id="instagram" />@diamondangels3</a>
          <a href={LINKS.agencia} target="_blank" rel="noopener"><Icone id="instagram" />@bwagency7</a>
          <a href={LINKS.fundadora} target="_blank" rel="noopener"><Icone id="instagram" />@bruwolker</a>
        </div>
      </div>
      <div className="wrap rodape-base">
        <span>© 2026 Diamond Angels · Salvador, BA</span>
        <a href="#inicio">Voltar ao topo ↑</a>
      </div>
    </footer>
  );
}
