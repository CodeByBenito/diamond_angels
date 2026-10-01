import type { Metadata, Viewport } from "next";
import { Albert_Sans, Italiana, Pinyon_Script } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

/* Fontes baixadas no build e servidas pelo próprio site.
   Italiana = letreiro fino de fachada · Pinyon Script = nomes escritos na lista · Albert Sans = leitura */
const titulo = Italiana({ weight: "400", subsets: ["latin"], variable: "--f-titulo", display: "swap" });
const nome = Pinyon_Script({ weight: "400", subsets: ["latin"], variable: "--f-nome", display: "swap" });
const texto = Albert_Sans({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--f-texto", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Diamond Angels · O clube feminino de Salvador",
  description:
    "Diamond Angels, o clube feminino de Salvador. Coloque seu nome na lista: eventos, lista VIP, benefícios exclusivos e divulgação para marcas e produtoras.",
  openGraph: {
    title: "Diamond Angels · O clube feminino de Salvador",
    description: "Com a Diamond, a porta se abre. Eventos, lista VIP e benefícios exclusivos.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Diamond Angels" }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0a0708",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${titulo.variable} ${nome.variable} ${texto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
