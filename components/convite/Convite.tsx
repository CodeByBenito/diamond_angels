"use client";
import { useEffect, useId, useRef, useState } from "react";
import { LINKS } from "@/conteudo/contato";
import { DESEJOS, NOITES } from "@/conteudo/convite";
import {
  arrobaInstagram,
  compartilharConvite,
  gerarImagemConvite,
  linkConvite,
  RESPOSTAS_VAZIAS,
  type RespostasConvite,
  type ResultadoCompartilhar,
} from "@/lib/convite";
import { limparNome, primeiroNome } from "@/lib/nome";
import Icone from "../icones/Icone";
import { useLista } from "../lista/ListaProvider";
import CartaoConvite from "./CartaoConvite";
import s from "./Convite.module.css";

const CHAVE = "diamond:convite";
const PASSOS = ["Quem é você", "Sua noite", "Na Diamond", "Seu convite"] as const;

/** Vibração curtinha no Android ao tocar numa opção (no iPhone o navegador ignora). */
const tocar = () => {
  try {
    navigator.vibrate?.(8);
  } catch {}
};

const MSG_COMPARTILHAR: Record<ResultadoCompartilhar, string> = {
  compartilhado: "Convite compartilhado. Marque @diamondangels3 no story!",
  baixado: "Imagem salva. Poste nos stories e marque @diamondangels3.",
  cancelado: "",
};

/**
 * Convite Diamond — a captação de novas Angels em quatro toques.
 * Ela responde, vê o convite se montar ao vivo, envia tudo pronto pelo WhatsApp e ainda pode postar
 * o convite nos stories marcando a Diamond. As respostas ficam só no aparelho até ela enviar.
 */
export default function Convite() {
  const { nome, pronto, entrar } = useLista();
  const [passo, setPasso] = useState(0);
  const [r, setR] = useState<RespostasConvite>(RESPOSTAS_VAZIAS);
  const [rascunhoNome, setRascunhoNome] = useState("");
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviado, setEnviado] = useState(false);
  const imagem = useRef<Blob | null>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const primeiraVez = useRef(true);
  const id = useId();

  /* Grava no momento da resposta (um efeito de "salvar" rodaria na montagem e apagaria o que estava guardado) */
  const atualizar = (muda: (a: RespostasConvite) => RespostasConvite) =>
    setR((a) => {
      const novo = muda(a);
      try {
        localStorage.setItem(CHAVE, JSON.stringify(novo));
      } catch {}
      return novo;
    });

  /* Lê o que ela já respondeu antes (mesmo aparelho) */
  useEffect(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE) ?? "null");
      if (salvo) setR({ ...RESPOSTAS_VAZIAS, ...salvo });
    } catch {}
  }, []);
  useEffect(() => {
    if (pronto) setRascunhoNome((atual) => atual || nome);
  }, [pronto, nome]);

  /* Troca de passo: o título do passo recebe o foco e o bloco volta para a tela se tiver saído */
  // biome-ignore lint/correctness/useExhaustiveDependencies: roda de propósito a cada troca de passo
  useEffect(() => {
    if (primeiraVez.current) {
      primeiraVez.current = false;
      return;
    }
    titulo.current?.focus({ preventScroll: true });
    const topo = raiz.current?.getBoundingClientRect().top ?? 0;
    if (topo < 0) raiz.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [passo]);

  /* No último passo a imagem dos stories já fica pronta: no iPhone o compartilhar precisa sair direto do toque */
  const nomeFinal = nome || limparNome(rascunhoNome);
  const chaveImagem = `${nomeFinal}|${r.noites.join()}`;
  // biome-ignore lint/correctness/useExhaustiveDependencies: refaz só quando muda o que aparece na imagem (nome e noites)
  useEffect(() => {
    if (passo !== 3 || !nomeFinal) return;
    let vivo = true;
    imagem.current = null;
    gerarImagemConvite(nomeFinal, r)
      .then((b) => {
        if (vivo) imagem.current = b;
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, [passo, chaveImagem]);

  const alternar = (campo: "noites" | "desejos", valor: string) => {
    tocar();
    setErro("");
    atualizar((a) => ({ ...a, [campo]: a[campo].includes(valor) ? a[campo].filter((v) => v !== valor) : [...a[campo], valor] }));
  };

  function avancar() {
    if (passo === 0) {
      const n = limparNome(rascunhoNome);
      if (!n) return setErro("Escreva seu nome para a gente colocar na lista.");
      if (n !== nome) entrar(n);
    }
    if (passo === 1 && !r.noites.length) return setErro("Escolha pelo menos uma.");
    if (passo === 2 && !r.desejos.length) return setErro("Escolha pelo menos uma.");
    setErro("");
    setPasso((p) => Math.min(3, p + 1));
  }

  async function postar() {
    tocar();
    setAviso("Preparando a imagem…");
    try {
      const b = imagem.current ?? (await gerarImagemConvite(nomeFinal, r));
      setAviso(MSG_COMPARTILHAR[await compartilharConvite(b)]);
    } catch {
      setAviso("Não deu para gerar a imagem neste navegador. Tire um print do convite!");
    }
  }

  const prontoParaEnviar = !!nomeFinal && r.maior;

  return (
    <div ref={raiz} className={s.convite}>
      <div className={s.vitrine}>
        <CartaoConvite nome={nomeFinal} noites={r.noites} carimbado={!!nomeFinal && passo > 0} />
      </div>

      <div className={s.ficha}>
        <div className={s.progresso} aria-hidden="true">
          {PASSOS.map((p, i) => (
            <span key={p} className={i <= passo ? s.feito : ""} />
          ))}
        </div>
        <p className={s.contador}>
          Passo {passo + 1} de {PASSOS.length} · {PASSOS[passo]}
        </p>

        <div key={passo} className={s.passo}>
          {passo === 0 && (
            <>
              <h3 ref={titulo} tabIndex={-1}>
                Como você se chama?
              </h3>
              <div className="campo">
                <label htmlFor={`${id}-nome`}>Seu nome</label>
                <input
                  id={`${id}-nome`}
                  value={rascunhoNome}
                  onChange={(e) => {
                    setRascunhoNome(e.target.value);
                    setErro("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && avancar()}
                  placeholder="Nome e sobrenome"
                  autoComplete="name"
                  enterKeyHint="next"
                  maxLength={40}
                  aria-invalid={!!erro || undefined}
                />
              </div>
              <div className="campo">
                <label htmlFor={`${id}-insta`}>
                  Seu Instagram <span className={s.opcional}>(a equipe conhece você por ele)</span>
                </label>
                <input
                  id={`${id}-insta`}
                  value={r.instagram}
                  onChange={(e) => atualizar((a) => ({ ...a, instagram: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && avancar()}
                  placeholder="@seuperfil"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  inputMode="url"
                />
              </div>
            </>
          )}

          {passo === 1 && (
            <>
              <h3 ref={titulo} tabIndex={-1}>
                {nomeFinal ? `${primeiroNome(nomeFinal)}, qual é a sua noite?` : "Qual é a sua noite?"}
              </h3>
              <p className={s.dica}>Escolha quantas quiser.</p>
              <div className={s.opcoes} role="group" aria-label="Sua noite">
                {NOITES.map((o) => (
                  <button
                    key={o}
                    type="button"
                    className={s.opcao}
                    aria-pressed={r.noites.includes(o)}
                    onClick={() => alternar("noites", o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </>
          )}

          {passo === 2 && (
            <>
              <h3 ref={titulo} tabIndex={-1}>
                O que você quer viver na Diamond?
              </h3>
              <p className={s.dica}>Isso ajuda a equipe a te chamar para o que combina com você.</p>
              <div className={s.opcoes} role="group" aria-label="O que você quer viver na Diamond">
                {DESEJOS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    className={s.opcao}
                    aria-pressed={r.desejos.includes(o)}
                    onClick={() => alternar("desejos", o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </>
          )}

          {passo === 3 && (
            <>
              <h3 ref={titulo} tabIndex={-1}>
                Seu convite está pronto.
              </h3>
              <dl className={s.resumo}>
                <div>
                  <dt>Nome</dt>
                  <dd>{nomeFinal}</dd>
                </div>
                {arrobaInstagram(r.instagram) && (
                  <div>
                    <dt>Instagram</dt>
                    <dd>{arrobaInstagram(r.instagram)}</dd>
                  </div>
                )}
                <div>
                  <dt>Sua noite</dt>
                  <dd>{r.noites.join(", ")}</dd>
                </div>
                <div>
                  <dt>Quer viver</dt>
                  <dd>{r.desejos.join(", ")}</dd>
                </div>
              </dl>
              <label className={s.maior}>
                <input
                  type="checkbox"
                  checked={r.maior}
                  onChange={(e) => {
                    tocar();
                    atualizar((a) => ({ ...a, maior: e.target.checked }));
                  }}
                />
                <span>Tenho 18 anos ou mais</span>
              </label>
              <div className={s.acoesFinais}>
                <a
                  className={`btn btn-grande${prontoParaEnviar ? "" : ` ${s.travado}`}`}
                  href={prontoParaEnviar ? linkConvite(nomeFinal, r) : undefined}
                  target="_blank"
                  rel="noopener"
                  aria-disabled={!prontoParaEnviar}
                  onClick={(e) => {
                    if (!prontoParaEnviar) {
                      e.preventDefault();
                      setErro("Confirme que você tem 18 anos ou mais.");
                      return;
                    }
                    tocar();
                    setEnviado(true);
                  }}
                >
                  <Icone nome="whatsapp" />
                  Enviar meu convite
                </a>
                <button type="button" className="btn vazado" onClick={postar}>
                  <Icone nome="instagram" />
                  Postar nos stories
                </button>
              </div>
              {enviado && (
                <p className={s.enviado}>
                  Abrimos o WhatsApp com seu convite. É só tocar em enviar por lá. Enquanto isso, poste nos stories!
                </p>
              )}
            </>
          )}
        </div>

        <p className={s.erro} role="alert">
          {erro}
        </p>
        <p className={s.aviso} role="status">
          {aviso}
        </p>

        <div className={s.navegar}>
          {passo > 0 && (
            <button type="button" className={s.voltar} onClick={() => setPasso((p) => p - 1)}>
              <Icone nome="seta" className={s.setaVoltar} />
              Voltar
            </button>
          )}
          {passo < 3 && (
            <button type="button" className={`btn ${s.continuar}`} onClick={avancar}>
              Continuar
              <Icone nome="seta" />
            </button>
          )}
          {passo === 3 && (
            <p className={s.alternativa}>
              Prefere o Instagram?{" "}
              <a className="link-seta" href={LINKS.agencia} target="_blank" rel="noopener">
                Fale com @bwagency7
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
