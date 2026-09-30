"use client";
import { useRef, useState } from "react";
import { LINKS } from "@/lib/conteudo";

type Estado = "inicio" | "erro" | "copiado" | "manual";
const MENSAGEM: Record<Estado, string> = {
  inicio: "Preencha, copie o texto e cole na conversa do Instagram da agência.",
  erro: "Informe o nome da marca ou do evento.",
  copiado: "Briefing copiado. Cole na conversa do Instagram.",
  manual: "Não foi possível copiar sozinho. Copie o texto que apareceu em A ideia.",
};

/** Monta o texto do pedido de proposta e copia para colar no Instagram. */
export default function Briefing() {
  const [estado, setEstado] = useState<Estado>("inicio");
  const form = useRef<HTMLFormElement>(null);

  function enviar(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    if (!v("nome")) {
      setEstado("erro");
      form.current?.querySelector<HTMLInputElement>("#b-nome")?.focus();
      return;
    }
    const txt = [
      "Olá, Diamond Angels! Quero solicitar uma proposta.",
      `Marca/evento: ${v("nome")}`,
      `Serviço: ${v("tipo")}`,
      `Data prevista: ${v("data") || "a definir"}`,
      `Local: ${v("loc") || "a definir"}`,
      `Ideia: ${v("msg") || "a conversar"}`,
    ].join("\n");
    const manual = () => {
      setEstado("manual");
      const area = form.current?.querySelector<HTMLTextAreaElement>("#b-msg");
      if (area) { area.value = txt; area.select(); }
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(txt).then(() => {
        setEstado("copiado");
        setTimeout(() => setEstado((e) => (e === "copiado" ? "inicio" : e)), 2600);
      }, manual);
    } else manual();
  }

  return (
    <form ref={form} className="briefing" onSubmit={enviar} noValidate>
      <div className="campo">
        <label htmlFor="b-nome">Marca ou evento</label>
        <input id="b-nome" name="nome" placeholder="Nome da sua marca" autoComplete="organization" required
          aria-invalid={estado === "erro"} aria-describedby="b-status" onInput={() => estado === "erro" && setEstado("inicio")} />
      </div>
      <div className="campo">
        <label htmlFor="b-tipo">O que você precisa</label>
        <select id="b-tipo" name="tipo" defaultValue="Divulgação no perfil">
          <option>Divulgação no perfil</option><option>Promotoria em evento</option><option>Ativação com parceria</option><option>Outro formato</option>
        </select>
      </div>
      <div className="campo"><label htmlFor="b-data">Data prevista</label><input id="b-data" name="data" placeholder="Ex.: 15 de novembro" /></div>
      <div className="campo"><label htmlFor="b-loc">Local</label><input id="b-loc" name="loc" placeholder="Bairro ou casa de eventos" /></div>
      <div className="campo cheio"><label htmlFor="b-msg">A ideia</label><textarea id="b-msg" name="msg" placeholder="Público, objetivo e orçamento, se já tiver." /></div>
      <div className="campo cheio acoes-form">
        <button className="btn" type="submit">{estado === "copiado" ? "Copiado ✓" : "Copiar briefing"}</button>
        <a className="btn vazado" href={LINKS.agencia} target="_blank" rel="noopener">Abrir Instagram</a>
      </div>
      <span id="b-status" role="status" className={estado === "erro" ? "erro" : ""}>{MENSAGEM[estado]}</span>
    </form>
  );
}
