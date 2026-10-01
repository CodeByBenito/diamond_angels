"use client";
import { useEffect, useState } from "react";
import { definirMovimentoReduzido, movimentoReduzido } from "@/lib/movimento";
import Icone from "../icones/Icone";

/** Botão "Reduzir movimento": para quem prefere o site parado. Fica lembrado neste aparelho. */
export default function PreferenciaMovimento({ className }: { className?: string }) {
  const [reduzido, setReduzido] = useState(false); // lido no navegador (no build não existe preferência)

  useEffect(() => setReduzido(movimentoReduzido()), []);

  return (
    <button type="button" className={className} aria-pressed={reduzido} onClick={() => definirMovimentoReduzido(!reduzido)}>
      <Icone nome={reduzido ? "play" : "pausa"} />
      {reduzido ? "Ativar animações" : "Reduzir movimento"}
    </button>
  );
}
