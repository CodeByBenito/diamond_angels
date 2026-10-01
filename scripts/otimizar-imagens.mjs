/**
 * Otimiza as fotos de eventos e os logos de parceiros antes de publicar.
 *   npm run imagens
 * Lê os originais (JPG/PNG) de originais/eventos e originais/parceiros e grava as versões
 * .webp e .avif em public/eventos e public/parceiros — só elas vão para o site publicado.
 * (fotos de evento saem com 1080px de largura; logos de parceiros com 480px).
 * No conteudo/eventos.ts, aponte a foto para o .webp (ex.: "/eventos/noite-diamond.webp").
 */
import { mkdir, readdir } from "node:fs/promises";
import { extname, join, parse } from "node:path";
import sharp from "sharp";

const PASTAS = [
  { origem: "originais/eventos", destino: "public/eventos", largura: 1080 },
  { origem: "originais/parceiros", destino: "public/parceiros", largura: 480 },
];

for (const { origem, destino, largura } of PASTAS) {
  let arquivos = [];
  try {
    arquivos = await readdir(origem);
  } catch {
    continue;
  }
  await mkdir(destino, { recursive: true });
  for (const nome of arquivos.filter((a) => /\.(jpe?g|png)$/i.test(extname(a)))) {
    const arquivo = join(origem, nome);
    const base = join(destino, parse(nome).name);
    const img = sharp(arquivo).rotate().resize({ width: largura, withoutEnlargement: true });
    await img.clone().webp({ quality: 80 }).toFile(`${base}.webp`);
    await img.clone().avif({ quality: 55 }).toFile(`${base}.avif`);
    console.log(`✓ ${arquivo} → ${base}.webp + .avif`);
  }
}
