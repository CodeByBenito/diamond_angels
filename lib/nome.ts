const MINUSCULAS = new Set(["de", "da", "do", "das", "dos", "e"]);

/** Limpa o que a pessoa digitou: tira espaços extras, limita o tamanho e capitaliza ("ana da silva" → "Ana da Silva"). */
export const limparNome = (bruto: string) =>
  bruto
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40)
    .split(" ")
    .map((p, i) =>
      i > 0 && MINUSCULAS.has(p.toLocaleLowerCase("pt-BR"))
        ? p.toLocaleLowerCase("pt-BR")
        : p.charAt(0).toLocaleUpperCase("pt-BR") + p.slice(1),
    )
    .join(" ");

/** "ana clara souza" → "Ana" (para saudações curtas). */
export const primeiroNome = (nome: string) => {
  const p = nome.split(" ")[0] ?? "";
  return p ? p[0].toLocaleUpperCase("pt-BR") + p.slice(1) : "";
};
