"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { limparNome } from "@/lib/nome";

/**
 * Movimento-assinatura: "seu nome na lista".
 * O nome que a visitante escreve na porta acompanha a visita (saudação, camarote, agenda, mensagem final).
 * Fica guardado só neste aparelho (localStorage) e só sai daqui quando ela mesma envia pelo WhatsApp.
 */
interface Lista {
  nome: string;
  pronto: boolean; // já leu o que estava guardado (evita piscar no primeiro carregamento)
  entrar: (nome: string) => void;
  sair: () => void;
}

const CHAVE = "diamond:nome";
const Contexto = createContext<Lista>({ nome: "", pronto: false, entrar: () => {}, sair: () => {} });

export function ListaProvider({ children }: { children: React.ReactNode }) {
  const [nome, setNome] = useState("");
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      setNome(limparNome(localStorage.getItem(CHAVE) ?? ""));
    } catch {
      /* navegação privada ou armazenamento bloqueado: segue sem lembrar */
    }
    setPronto(true);
  }, []);

  const entrar = useCallback((bruto: string) => {
    const n = limparNome(bruto);
    setNome(n);
    try {
      if (n) localStorage.setItem(CHAVE, n);
      else localStorage.removeItem(CHAVE);
    } catch {}
  }, []);

  const sair = useCallback(() => entrar(""), [entrar]);

  return <Contexto.Provider value={{ nome, pronto, entrar, sair }}>{children}</Contexto.Provider>;
}

export const useLista = () => useContext(Contexto);
