import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // site 100% estático: hospeda em qualquer lugar (Vercel, Netlify, Cloudflare, cPanel)
  images: { unoptimized: true }, // as imagens já saem otimizadas por `npm run imagens`
  reactStrictMode: true,
  reactCompiler: true, // o React Compiler memoriza componentes sozinho: menos re-renderizações
  poweredByHeader: false,
};

export default nextConfig;
