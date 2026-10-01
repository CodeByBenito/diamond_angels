/**
 * Otimiza as fotos de eventos e parceiros antes de publicar.
 *   npm run imagens
 * Lê JPG/PNG de public/eventos e public/parceiros e gera ao lado versões .webp e .avif
 * (fotos de evento saem com 1080px de largura; logos de parceiros com 480px).
 * No conteudo/eventos.ts, aponte a foto para o .webp (ex.: "/eventos/noite-diamond.webp").
 */
import { readdir } from "node:fs/promises";
import { extname, join, parse } from "node:path";
import sharp from "sharp";

const PASTAS = [
  { dir: "public/eventos", largura: 1080 },
  { dir: "public/parceiros", largura: 480 },
];

for (const { dir, largura } of PASTAS) {
  let arquivos = [];
  try {
    arquivos = await readdir(dir);
  } catch {
    continue;
  }
  for (const nome of arquivos.filter((a) => /\.(jpe?g|png)$/i.test(extname(a)))) {
    const origem = join(dir, nome);
    const base = join(dir, parse(nome).name);
    const img = sharp(origem).rotate().resize({ width: largura, withoutEnlargement: true });
    await img.clone().webp({ quality: 80 }).toFile(`${base}.webp`);
    await img.clone().avif({ quality: 55 }).toFile(`${base}.avif`);
    console.log(`✓ ${origem} → .webp + .avif`);
  }
}
