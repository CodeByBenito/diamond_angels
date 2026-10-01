"use client";
import { cloneElement, useRef, useState } from "react";
import { WHATSAPP } from "@/conteudo/contato";
import { dataBR } from "@/lib/datas";
import { linkWhatsApp } from "@/lib/whatsapp";
import Icone from "../icones/Icone";
import "./FormMarcas.css";

const TIPOS = [
  "Divulgação do evento no perfil",
  "Presença das Angels no evento",
  "Lista VIP / cortesias para o clube",
  "Ativação de marca",
  "Ainda não sei, quero conversar",
] as const;
const PUBLICOS = ["Até 100 pessoas", "100 a 300 pessoas", "300 a 1.000 pessoas", "Mais de 1.000 pessoas"] as const;

type Campos = {
  nome: string;
  empresa: string;
  contato: string;
  evento: string;
  tipo: string;
  data: string;
  hora: string;
  local: string;
  publico: string;
  instagram: string;
  detalhes: string;
};
type Chave = keyof Campos;

const VAZIO: Campos = {
  nome: "",
  empresa: "",
  contato: "",
  evento: "",
  tipo: TIPOS[0],
  data: "",
  hora: "",
  local: "",
  publico: "",
  instagram: "",
  detalhes: "",
};
const OBRIGATORIOS: { chave: Chave; erro: string }[] = [
  { chave: "nome", erro: "Informe seu nome." },
  { chave: "empresa", erro: "Informe a empresa ou produtora." },
  { chave: "evento", erro: "Informe o nome do evento." },
  { chave: "data", erro: "Escolha a data do evento." },
  { chave: "local", erro: "Informe o local do evento." },
];

/** A mensagem que chega no WhatsApp da Diamond (negrito com *asteriscos*, no padrão do WhatsApp). */
function montarMensagem(c: Campos) {
  const v = (s: string) => s.trim();
  const arroba =
    v(c.instagram) && !v(c.instagram).startsWith("@") && !v(c.instagram).includes("/") ? `@${v(c.instagram)}` : v(c.instagram);
  const quando = [v(c.data) ? dataBR(c.data) : "", v(c.hora) ? `às ${c.hora}` : ""].filter(Boolean).join(" ");
  const se = (valor: string, linha: string) => (valor ? [linha] : []);
  return [
    "Olá, Diamond Angels! Quero divulgar um evento com vocês.",
    "",
    `*Responsável:* ${v(c.nome) || "—"}`,
    `*Empresa/produtora:* ${v(c.empresa) || "—"}`,
    ...se(v(c.contato), `*Contato:* ${v(c.contato)}`),
    "",
    `*Evento:* ${v(c.evento) || "—"}`,
    `*Data:* ${quando || "—"}`,
    `*Local:* ${v(c.local) || "—"}`,
    ...se(c.publico, `*Público esperado:* ${c.publico}`),
    ...se(arroba, `*Instagram do evento:* ${arroba}`),
    `*O que procuramos:* ${c.tipo}`,
    ...se(v(c.detalhes), ""),
    ...se(v(c.detalhes), `*Detalhes:* ${v(c.detalhes)}`),
  ].join("\n");
}

/* Pré-visualização: transforma *negrito* do WhatsApp em <b> */
function Previa({ texto }: { texto: string }) {
  return (
    <>
      {texto.split("\n").map((linha, i) => (
        <span key={i} className="linha">
          {linha === ""
            ? " "
            : linha
                .split(/(\*[^*]+\*)/g)
                .map((p, j) => (p.startsWith("*") && p.endsWith("*") && p.length > 2 ? <b key={j}>{p.slice(1, -1)}</b> : p))}
        </span>
      ))}
    </>
  );
}

export default function FormMarcas() {
  const [c, setC] = useState<Campos>(VAZIO);
  const [erros, setErros] = useState<Partial<Record<Chave, string>>>({});
  const [enviado, setEnviado] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const texto = montarMensagem(c);

  const mudar = (k: Chave) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const valor = ev.target.value;
    setC((atual) => ({ ...atual, [k]: valor }));
    if (erros[k]) setErros((e) => ({ ...e, [k]: undefined }));
    setEnviado(false);
  };

  function enviar(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const novos: Partial<Record<Chave, string>> = {};
    OBRIGATORIOS.forEach(({ chave, erro }) => {
      if (!c[chave].trim()) novos[chave] = erro;
    });
    setErros(novos);
    const primeiro = OBRIGATORIOS.find(({ chave }) => novos[chave]);
    if (primeiro) {
      form.current?.querySelector<HTMLElement>(`#f-${primeiro.chave}`)?.focus();
      return;
    }
    const url = linkWhatsApp(texto);
    const janela = window.open(url, "_blank");
    if (janela) janela.opener = null;
    else window.location.href = url; // bloqueador de pop-up: abre na mesma aba
    setEnviado(true);
  }

  /* Campo com rótulo, mensagem de erro ligada por aria-describedby e realce de inválido */
  const campo = (
    k: Chave,
    rotulo: string,
    controle: React.ReactElement<Record<string, unknown>>,
    opts: { cheio?: boolean; obrigatorio?: boolean } = {},
  ) => (
    <div className={`campo${opts.cheio ? " cheio" : ""}${erros[k] ? " invalido" : ""}`}>
      <label htmlFor={`f-${k}`}>
        {rotulo}
        {opts.obrigatorio && <span aria-hidden="true"> *</span>}
      </label>
      {cloneElement(controle, {
        id: `f-${k}`,
        name: k,
        value: c[k],
        onChange: mudar(k),
        "aria-invalid": !!erros[k] || undefined,
        "aria-describedby": erros[k] ? `e-${k}` : undefined,
        "aria-required": opts.obrigatorio || undefined,
      })}
      {erros[k] && (
        <span className="erro" id={`e-${k}`}>
          {erros[k]}
        </span>
      )}
    </div>
  );

  return (
    <div className="form-marcas">
      <form ref={form} className="formulario" onSubmit={enviar} noValidate>
        <fieldset>
          <legend className="rotulo">Quem está falando</legend>
          {campo("nome", "Seu nome", <input autoComplete="name" placeholder="Nome e sobrenome" />, { obrigatorio: true })}
          {campo("empresa", "Empresa ou produtora", <input autoComplete="organization" placeholder="Nome da marca" />, {
            obrigatorio: true,
          })}
          {campo(
            "contato",
            "WhatsApp para retorno",
            <input type="tel" inputMode="tel" autoComplete="tel" placeholder="(71) 90000-0000" />,
            { cheio: true },
          )}
        </fieldset>
        <fieldset>
          <legend className="rotulo">Sobre o evento</legend>
          {campo("evento", "Nome do evento", <input placeholder="Ex.: Sunset de Verão" />, { cheio: true, obrigatorio: true })}
          {campo("data", "Data", <input type="date" />, { obrigatorio: true })}
          {campo("hora", "Horário", <input type="time" />)}
          {campo("local", "Local ou endereço", <input autoComplete="street-address" placeholder="Casa de eventos, bairro" />, {
            cheio: true,
            obrigatorio: true,
          })}
          {campo(
            "publico",
            "Público esperado",
            <select>
              <option value="">Selecione</option>
              {PUBLICOS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>,
          )}
          {campo("instagram", "Instagram do evento", <input placeholder="@seuevento" autoCapitalize="none" />)}
          {campo(
            "tipo",
            "O que você procura",
            <select>
              {TIPOS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>,
            { cheio: true },
          )}
          {campo(
            "detalhes",
            "Detalhes",
            <textarea rows={3} placeholder="Atrações, proposta para o clube, orçamento, se já tiver." />,
            { cheio: true },
          )}
        </fieldset>
        <div className="form-envio">
          <button className="btn btn-grande" type="submit">
            <Icone nome="whatsapp" />
            Enviar pelo WhatsApp
          </button>
          <p className="aviso" role="status">
            {Object.values(erros).some(Boolean)
              ? "Preencha os campos marcados para continuar."
              : enviado
                ? "Abrimos o WhatsApp com a sua mensagem. É só tocar em enviar por lá."
                : `A mensagem abre pronta no WhatsApp ${WHATSAPP.exibicao}. Você revisa antes de enviar.`}
          </p>
        </div>
      </form>

      <aside className="previa" aria-label="Prévia da mensagem">
        <p className="rotulo">Prévia da mensagem</p>
        <div className="zap">
          <div className="zap-topo">
            <img src="/logo-mark.webp" alt="" width={36} height={36} />
            <div>
              <b>Diamond Angels</b>
              <span>{WHATSAPP.exibicao}</span>
            </div>
          </div>
          <div className="zap-conversa">
            <p className="bolha">
              <Previa texto={texto} />
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
