import type { Metadata, Viewport } from "next";
import { Gloock, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* Fontes baixadas no build e servidas pelo próprio site (sem depender do Google em produção) */
const titulo = Gloock({ weight: "400", subsets: ["latin"], variable: "--f-titulo", display: "swap" });
const texto = Instrument_Sans({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--f-texto", display: "swap" });
const mono = JetBrains_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--f-mono", display: "swap" });

export const metadata: Metadata = {
  // Defina NEXT_PUBLIC_SITE_URL na hospedagem; na Vercel, cai no domínio de produção automaticamente
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: "Diamond Angels",
  description: "Diamond Angels, o clube feminino de Salvador. Eventos, VIP, benefícios exclusivos e divulgação que gera oportunidades.",
  openGraph: {
    title: "Diamond Angels",
    description: "O clube feminino de Salvador. Eventos + VIP + benefícios exclusivos.",
    images: [{ url: "/og.png" }],
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0708",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${titulo.variable} ${texto.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
