import { LINKS } from "@/conteudo/contato";
import { EVENTOS, EVENTOS_SAO_EXEMPLO } from "@/conteudo/eventos";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const horaISO = (hora: string) => {
  const m = hora.match(/(\d{1,2})(?:h|:)?(\d{2})?/);
  return m ? `T${m[1].padStart(2, "0")}:${m[2] ?? "00"}:00-03:00` : "";
};

/** Dados estruturados (schema.org) lidos pelo Google: o clube e, quando reais, os eventos. */
export function jsonLd() {
  const clube = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#clube`,
    name: "Diamond Angels",
    description: "O clube feminino de Salvador. Eventos, lista VIP, benefícios exclusivos e divulgação para marcas.",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.webp`,
    sameAs: [LINKS.clube, LINKS.agencia],
    areaServed: { "@type": "City", name: "Salvador" },
  };

  // Eventos de exemplo nunca vão para o Google
  const eventos = EVENTOS_SAO_EXEMPLO
    ? []
    : EVENTOS.map((e) => ({
        "@type": "Event",
        name: e.nome,
        description: e.descricao,
        startDate: `${e.data}${horaISO(e.hora)}`,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: e.local,
          address: {
            "@type": "PostalAddress",
            streetAddress: e.endereco,
            addressLocality: "Salvador",
            addressRegion: "BA",
            addressCountry: "BR",
          },
        },
        organizer: { "@id": `${SITE_URL}/#clube` },
        ...(e.atracoes?.length ? { performer: e.atracoes.map((nome) => ({ "@type": "PerformingGroup", name: nome })) } : {}),
        ...(e.foto ? { image: [`${SITE_URL}${e.foto}`] } : {}),
      }));

  return { "@context": "https://schema.org", "@graph": [clube, ...eventos] };
}
