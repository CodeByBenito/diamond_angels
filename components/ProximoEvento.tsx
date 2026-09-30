"use client";
import { useEffect, useState } from "react";
import { EVENTOS, partesData, type Evento } from "@/lib/eventos";

/** Chamada para o próximo evento da agenda. Calculada no navegador (a data de "hoje" não existe no build). */
export default function ProximoEvento() {
  const [proximo, setProximo] = useState<Evento | null>(null);

  useEffect(() => {
    const hoje = new Date().toLocaleDateString("sv-SE");
    setProximo([...EVENTOS].filter((e) => e.data >= hoje).sort((a, b) => a.data.localeCompare(b.data))[0] ?? null);
  }, []);

  if (!proximo) return <span className="proximo vazio" aria-hidden="true" />;
  const { dia, mes } = partesData(proximo.data);
  return (
    <a className="proximo" href="#eventos">
      <span className="rotulo">Próximo evento</span>
      <b>{proximo.nome}</b>
      <span>{dia} {mes} · {proximo.hora}</span>
    </a>
  );
}
