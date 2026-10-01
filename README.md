# Diamond Angels — site

O clube feminino de Salvador, contado como uma noite: da porta ao camarote.
Na porta a visitante escreve o nome na **Lista Diamond**; o nome a acompanha pela visita e vai pronto na
mensagem do WhatsApp no final. O pico da página é **atravessar o diamante**: a cena fica presa enquanto
o diamante cresce até a pessoa passar por dentro dele e cair no camarote, onde aparecem os acessos.

## Rodar no seu computador

Precisa do Node.js 20.9 ou mais novo (https://nodejs.org). Abra esta pasta no terminal e rode:

```bash
npm install        # uma vez só (e sempre que o package.json mudar)
npm run dev        # abre em http://localhost:3000 e atualiza sozinho ao editar
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | gera a pasta `out/` com o site pronto (HTML, CSS, JS e imagens) |
| `npm start` | serve a pasta `out/` localmente |
| `npm run imagens` | otimiza fotos de `public/eventos` e logos de `public/parceiros` (gera .webp e .avif) |
| `npm run lint` / `npm run format` | confere e arruma o código (Biome) |
| `npm run verificar` | TypeScript + Biome + build, antes de publicar |

## Publicar

- **Vercel** (recomendado): importe o repositório em vercel.com; ele detecta o Next.js sozinho.
- **Netlify / Cloudflare Pages**: build `npm run build`, pasta publicada `out`, Node 20.9+ (o `.nvmrc` fixa a 22).
- **Hospedagem comum (cPanel, FTP)**: envie o conteúdo de `out/` para a raiz do domínio.

Com o domínio pronto, defina `NEXT_PUBLIC_SITE_URL=https://seu-dominio` na hospedagem
(prévia de links no WhatsApp/Instagram, sitemap e dados para o Google).

## O que editar no dia a dia

| O quê | Onde |
|---|---|
| Agenda de eventos (nome, data, local, endereço do mapa, foto, Diamond ou parceria) | `conteudo/eventos.ts` — mude `EVENTOS_SAO_EXEMPLO` para `false` quando forem reais (só então os eventos vão para o Google) |
| Fotos dos eventos | `public/eventos/` + `npm run imagens`, e aponte o campo `foto` para o `.webp` (vertical 4:5) |
| Logos de parceiros (só com autorização) | `public/parceiros/` + `conteudo/parceiros.ts` — a faixa só aparece quando a lista tiver alguém |
| Vídeo atrás do camarote | `public/videos/camarote.mp4` — aparece sozinho |
| WhatsApp, Instagram, número de seguidoras | `conteudo/contato.ts` |
| Textos do clube, acessos, passos e serviços | `conteudo/textos.ts` |
| Cores | topo de `app/globals.css` · fontes em `app/layout.tsx` |

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript**, exportado como site estático (hospeda em qualquer lugar).
- **React Compiler** ligado: memoriza componentes sozinho, menos re-renderizações.
- **CSS Modules** por seção + um `globals.css` só com tokens e peças compartilhadas: CSS sem runtime, escopo por componente.
- **GSAP 3** (ScrollTrigger, SplitText) para a cena do diamante e as revelações; **Lenis** para a rolagem suave, no mesmo relógio.
- **next/font**: Italiana (títulos), Pinyon Script (nomes na lista) e Albert Sans (leitura), servidas pelo próprio site.
- **Biome** (lint + formatação num só, rápido) e **sharp** (otimização de imagens).
- SEO: dados estruturados (Organization e, quando reais, Event), `sitemap.xml`, `robots.txt`, imagem de compartilhamento 1200×630.
- Tudo respeita "reduzir movimento": sem animação, a página vira uma leitura simples.
- O nome da visitante fica só no aparelho dela (localStorage) e só sai quando ela mesma envia pelo WhatsApp.

## Estrutura

```
app/                    layout (fontes, SEO), página, estilos globais, sitemap, robots
components/
  secoes/               Porta · Dentro · Acesso (pico) · Agenda (+ EventoDetalhe) · Marcas · NaLista
  lista/                a assinatura: ListaProvider (o nome), Lista, Corda de veludo, Saudacao
  ui/                   Header, Rodape, Icone, Cartaz, ProximoEvento
  efeitos/              SmoothScroll (Lenis), Revelar (revelações e fundo que viaja)
  formularios/          FormMarcas (→ WhatsApp, com prévia)
conteudo/               o que a equipe edita: eventos, parceiros, contato, textos
lib/                    funções: datas, whatsapp, mapas, nome, seo, movimento
public/                 logos, og.png, eventos/, parceiros/, videos/
scripts/                otimizar-imagens.mjs
docs/                   BRIEF.md (entrevista e plano em cenas) e construcoes.md
```
