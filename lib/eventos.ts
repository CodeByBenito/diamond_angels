/**
 * AGENDA — edite esta lista com os eventos reais.
 * data: AAAA-MM-DD · tipo: "vip" ou "aberto".
 * Eventos com data passada somem sozinhos do site.
 */
export type TipoEvento = "vip" | "aberto";

export interface Evento {
  data: string;
  nome: string;
  local: string;
  hora: string;
  tipo: TipoEvento;
}

export const EVENTOS: Evento[] = [
  { data: "2026-10-17", nome: "Noite Diamond", local: "Barra, Salvador", hora: "22h", tipo: "vip" },
  { data: "2026-10-31", nome: "Halloween Angels", local: "Rio Vermelho, Salvador", hora: "23h", tipo: "aberto" },
  { data: "2026-11-14", nome: "Brunch das Angels", local: "Pituba, Salvador", hora: "12h", tipo: "vip" },
  { data: "2026-12-05", nome: "Festa de Fim de Ano", local: "Local a confirmar", hora: "22h", tipo: "aberto" },
];

/** Enquanto esta flag for true, a página avisa que os eventos são exemplos. */
export const EVENTOS_SAO_EXEMPLO = true;

export const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"] as const;
