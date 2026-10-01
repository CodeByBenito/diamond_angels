"use client";
import { useEffect, useState } from "react";
import { EVENTOS, type Evento } from "@/conteudo/eventos";
import { hojeISO, partesData } from "@/lib/datas";
import s from "./ProximoEvento.module.css";

/** O próximo evento da agenda. Calculado no navegador (a data de "hoje" não existe no build). */
export default function ProximoEvento() {
  const [proximo, setProximo] = useState<Evento | null>(null);

  useEffect(() => {
    const hoje = hojeISO();
    setProximo(EVENTOS.filter((e) => e.data >= hoje).sort((a, b) => a.data.localeCompare(b.data))[0] ?? null);
  }, []);

  if (!proximo) return <span className={s.vazio} aria-hidden="true" />;
  const { dia, mes } = partesData(proximo.data);
  return (
    <a className={s.proximo} href="#agenda">
      <span className={s.data}>
        <b>{dia}</b>
        {mes}
      </span>
      <span className={s.info}>
        <span className="rotulo">Próxima noite</span>
        <b>{proximo.nome}</b>
      </span>
    </a>
  );
}
