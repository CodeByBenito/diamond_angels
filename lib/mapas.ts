export const linkMapa = (endereco: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;

/**
 * Mapa embutido no detalhe do evento. Usa o formato público de incorporação do Google Maps.
 * Para a versão oficial (Maps Embed API), crie uma chave no Google Cloud e troque por:
 * `https://www.google.com/maps/embed/v1/place?key=SUA_CHAVE&q=${encodeURIComponent(endereco)}`
 */
export const embedMapa = (endereco: string) => `https://www.google.com/maps?q=${encodeURIComponent(endereco)}&output=embed`;
