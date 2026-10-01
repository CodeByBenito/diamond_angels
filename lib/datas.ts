export const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"] as const;
const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const;

/** "2026-10-17" → { dia: "17", mes: "OUT", semana: "Sábado" } */
export function partesData(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  return { dia: String(d).padStart(2, "0"), mes: MESES[m - 1], semana: DIAS[new Date(a, m - 1, d).getDay()] };
}

/** "2026-10-17" → "17/10/2026" */
export const dataBR = (iso: string) => {
  const [a, m, d] = iso.split("-");
  return a && m && d ? `${d}/${m}/${a}` : iso;
};

/** Hoje no fuso de quem está vendo, em AAAA-MM-DD. Só chame no navegador. */
export const hojeISO = () => new Date().toLocaleDateString("sv-SE");
