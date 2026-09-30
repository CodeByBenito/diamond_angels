import { LINKS } from "@/lib/conteudo";

export default function Rodape() {
  return (
    <footer>
      <div className="wrap">
        <div>
          <img src="/logo.webp" alt="Diamond Angels" width={150} height={124} loading="lazy" decoding="async" />
          © 2026 Diamond Angels · Salvador, BA
        </div>
        <div className="links">
          <a href={LINKS.clube} target="_blank" rel="noopener">@diamondangels3</a>
          <a href={LINKS.agencia} target="_blank" rel="noopener">@bwagency7</a>
          <a href={LINKS.fundadora} target="_blank" rel="noopener">@bruwolker</a>
        </div>
      </div>
    </footer>
  );
}
