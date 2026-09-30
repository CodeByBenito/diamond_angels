import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // site 100% estático: hospeda em qualquer lugar (Vercel, Netlify, Cloudflare, cPanel)
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
