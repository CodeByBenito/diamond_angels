import Revelar from "@/components/efeitos/Revelar";
import SmoothScroll from "@/components/efeitos/SmoothScroll";
import FormMarcas from "@/components/formularios/FormMarcas";
import SpriteIcones from "@/components/icones/SpriteIcones";
import { ListaProvider } from "@/components/lista/ListaProvider";
import Acesso from "@/components/secoes/Acesso";
import Agenda from "@/components/secoes/Agenda";
import Dentro from "@/components/secoes/Dentro";
import Marcas from "@/components/secoes/Marcas";
import NaLista from "@/components/secoes/NaLista";
import Porta from "@/components/secoes/Porta";
import BarraMobile from "@/components/ui/BarraMobile";
import Header from "@/components/ui/Header";
import Rodape from "@/components/ui/Rodape";
import { jsonLd } from "@/lib/seo";

/**
 * A noite, da porta ao camarote. A ordem das seções é a ordem da história:
 * Na porta → Do lado de dentro → O acesso (pico) → A agenda → Para marcas → Seu nome na lista.
 */
export default function Home() {
  return (
    <ListaProvider>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD gerado no build a partir do nosso próprio conteúdo */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      <SpriteIcones />
      <SmoothScroll />
      <Revelar />
      <a className="pular" href="#dentro">
        Pular para o conteúdo
      </a>
      <Header />
      <main>
        <Porta />
        <Dentro />
        <Acesso />
        <Agenda />
        <Marcas>
          <FormMarcas />
        </Marcas>
        <NaLista />
      </main>
      <Rodape />
      <BarraMobile />
    </ListaProvider>
  );
}
