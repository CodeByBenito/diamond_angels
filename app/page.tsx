import SmoothScroll from "@/components/SmoothScroll";
import Motion from "@/components/Motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Faixa from "@/components/Faixa";
import Clube from "@/components/Clube";
import Beneficios from "@/components/Beneficios";
import Eventos from "@/components/Eventos";
import Marcas from "@/components/Marcas";
import Chamada from "@/components/Chamada";
import Rodape from "@/components/Rodape";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Motion />
      <a className="pular" href="#clube">Pular para o conteúdo</a>
      <Header />
      <main>
        <Hero />
        <Faixa />
        <Clube />
        <Beneficios />
        <Eventos />
        <Marcas />
        <Chamada />
      </main>
      <Rodape />
    </>
  );
}
