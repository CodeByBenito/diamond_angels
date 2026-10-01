/**
 * MARCAS E CASAS PARCEIRAS — só entram com autorização de cada uma.
 * Enquanto a lista estiver vazia, a faixa de parceiros não aparece no site.
 *
 * logo: coloque o arquivo em public/parceiros/ (PNG com fundo transparente ou SVG),
 *       rode `npm run imagens` e aponte para o .webp (ou use o .svg direto).
 * Exemplo: { nome: "Casa Exemplo", logo: "/parceiros/casa-exemplo.webp", site: "https://instagram.com/casaexemplo" }
 */
export interface Parceiro {
  nome: string;
  logo: string;
  site?: string;
}

export const PARCEIROS: Parceiro[] = [];
