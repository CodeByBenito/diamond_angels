"use client";
import { primeiroNome } from "@/lib/nome";
import { useLista } from "./ListaProvider";

/** "Bem-vinda, Ana." escrito à mão, quando ela já está na lista. */
export default function Saudacao({ className }: { className?: string }) {
  const { nome, pronto } = useLista();
  return (
    <p className={`nome-escrito ${className ?? ""}`} aria-live="polite">
      {pronto && nome ? `Bem-vinda, ${primeiroNome(nome)}.` : "Bem-vinda."}
    </p>
  );
}
