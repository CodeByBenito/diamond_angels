# Diamond Angels — site (Next.js + TypeScript)

O clube feminino de Salvador: agenda de eventos (do clube e de parceiros), benefícios para quem faz parte
e formulário para marcas divulgarem eventos direto no WhatsApp.

## Rodar no seu computador

Precisa do Node.js 20.9 ou mais novo (https://nodejs.org).

Abra esta pasta (diamond_angels) no terminal e rode:

```bash
npm install        # uma vez só
npm run dev        # abre em http://localhost:3000 e atualiza sozinho ao editar
```

## Publicar

```bash
npm run build      # gera a pasta out/ com o site pronto (HTML, CSS, JS e imagens)
npm start          # serve a pasta out/ localmente (ou em hospedagem Node, na porta $PORT)
```

- **Vercel** (recomendado): importe a pasta/repositório em vercel.com. Ele detecta o Next.js sozinho.
- **Netlify / Cloudflare Pages**: comando de build `npm run build`, pasta publicada `out`, Node 20.9+ (o arquivo `.nvmrc` já fixa a versão 22).
- **Hospedagem comum (cPanel, FTP)**: envie o conteúdo da pasta `out/` para a raiz do domínio.
  O site precisa estar na raiz do domínio (ex.: diamondangels.com.br), não numa subpasta.

Depois de ter o domínio, defina `NEXT_PUBLIC_SITE_URL=https://seu-dominio` na hospedagem
(serve para a prévia do link no WhatsApp e no Instagram).

## O que editar no dia a dia

| O quê | Onde |
|---|---|
| Agenda de eventos (nome, data, local, endereço do mapa, foto, Diamond ou parceria) | `lib/eventos.ts` (mude `EVENTOS_SAO_EXEMPLO` para `false` quando forem reais) |
| Fotos dos eventos | coloque em `public/eventos/` e aponte no campo `foto` (vertical 4:5). Sem foto, o site gera um cartaz |
| Número do WhatsApp que recebe os formulários | `lib/whatsapp.ts` |
| Textos do clube, benefícios, serviços e links do Instagram | `lib/conteudo.ts` |
| Cores e tipografia | topo de `app/globals.css` e `app/layout.tsx` |

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript**, exportado como site estático.
- **GSAP 3 + ScrollTrigger + SplitText**: entradas suaves (curva expo), títulos linha a linha, parallax leve.
- **Lenis**: rolagem suave, movida pelo mesmo relógio do GSAP.
- **next/font**: Cinzel (capitulares do logo), Cormorant Garamond (itálico editorial) e Manrope, servidas pelo próprio site.
- Tudo respeita "reduzir movimento" do sistema: sem animação, a página vira uma leitura simples.

## Estrutura

```
app/            layout (fontes, SEO), página e estilos globais
components/     Header, Hero, Faixa, Clube, Beneficios, Eventos (+ Cartaz, detalhe com mapa),
                Marcas (+ FormMarcas → WhatsApp), Chamada, Rodape, Motion, SmoothScroll
lib/            conteudo.ts, eventos.ts, whatsapp.ts, movimento.ts
public/         logos, imagem de compartilhamento, fotos de eventos
docs/           briefing e registro de construções
```
