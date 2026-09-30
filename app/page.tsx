import SmoothScroll from "@/components/SmoothScroll";
import Motion from "@/components/Motion";
import Header from "@/components/Header";
import Cursor from "@/components/Cursor";
import Pulseira from "@/components/Pulseira";
import Luzes from "@/components/atos/Luzes";
import Camarim from "@/components/atos/Camarim";
import Porta from "@/components/atos/Porta";
import Lineup from "@/components/atos/Lineup";
import Caminhos from "@/components/atos/Caminhos";
import Chamada from "@/components/atos/Chamada";
import Rodape from "@/components/Rodape";

/** A página é um desfile em seis atos. A ordem dos componentes é a ordem da história. */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Motion />
      <a className="pular" href="#camarim">Pular para o conteúdo</a>
      <Header />
      <Pulseira />
      <main id="inicio">
        <Luzes />
        <Camarim />
        <Porta />
        <Lineup />
        <Caminhos />
        <Chamada />
      </main>
      <Rodape />
      <Cursor />
    </>
  );
}
