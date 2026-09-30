import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

/* Fontes baixadas no build e servidas pelo próprio site (sem depender do Google em produção).
   Cinzel = as capitulares romanas do logo · Cormorant = o itálico editorial · Manrope = leitura */
const marca = Cinzel({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--f-marca", display: "swap" });
const titulo = Cormorant_Garamond({ weight: ["400", "500"], style: ["normal", "italic"], subsets: ["latin"], variable: "--f-titulo", display: "swap" });
const texto = Manrope({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--f-texto", display: "swap" });

export const metadata: Metadata = {
  // Defina NEXT_PUBLIC_SITE_URL na hospedagem; na Vercel, cai no domínio de produção automaticamente
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: "Diamond Angels · O clube feminino de Salvador",
  description: "Diamond Angels, o clube feminino de Salvador. Agenda de eventos, lista VIP, benefícios exclusivos e divulgação de eventos para marcas e produtoras.",
  openGraph: {
    title: "Diamond Angels",
    description: "O clube feminino de Salvador. Eventos, lista VIP e benefícios exclusivos.",
    images: [{ url: "/og.png" }],
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0708",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${marca.variable} ${titulo.variable} ${texto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
