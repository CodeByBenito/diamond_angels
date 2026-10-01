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
| `npm run imagens` | lê os originais de `originais/eventos` e `originais/parceiros` e grava .webp e .avif em `public/` |
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
| Perguntas do "Quero ser Angel" (estilos de noite, o que ela quer viver, legenda dos stories) | `conteudo/convite.ts` |
| Agenda de eventos (nome, data, local, endereço do mapa, foto, Diamond ou parceria) | `conteudo/eventos.ts` — mude `EVENTOS_SAO_EXEMPLO` para `false` quando forem reais (só então os eventos vão para o Google) |
| Fotos dos eventos | original em `originais/eventos/` + `npm run imagens`, e aponte o campo `foto` para o `.webp` (vertical 4:5) |
| Logos de parceiros (só com autorização) | original em `originais/parceiros/` + `npm run imagens` + `conteudo/parceiros.ts` — a faixa só aparece quando a lista tiver alguém |
| Vídeo atrás do camarote | coloque em `public/videos/` e escreva o caminho em `conteudo/midia.ts` |
| WhatsApp, Instagram, número de seguidoras | `conteudo/contato.ts` |
| Textos do clube, acessos, passos e serviços | `conteudo/textos.ts` |
| Cores | topo de `app/globals.css` · fontes em `app/layout.tsx` |
| Ícones | `components/icones/catalogo.tsx` — veja todos em `/icones` (rode `npm run dev` e abra http://localhost:3000/icones) |

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript**, exportado como site estático (hospeda em qualquer lugar).
- **React Compiler** ligado: memoriza componentes sozinho, menos re-renderizações.
- **CSS Modules** por seção + um `globals.css` só com tokens e peças compartilhadas: CSS sem runtime, escopo por componente.
- **GSAP 3** (ScrollTrigger, SplitText) para a cena do diamante e as revelações; **Lenis** para a rolagem suave, no mesmo relógio.
- **Three.js** para o diamante 3D (WebGL), baixado só perto da cena; sem WebGL, entra o diamante em SVG.
- **next/font**: Italiana (títulos), Pinyon Script (nomes na lista) e Albert Sans (leitura), servidas pelo próprio site.
- **Biome** (lint + formatação num só, rápido) e **sharp** (otimização de imagens).
- SEO: dados estruturados (Organization e, quando reais, Event), `sitemap.xml`, `robots.txt`, imagem de compartilhamento 1200×630.
- Botão "Reduzir movimento" no rodapé: sem animação, a página vira uma leitura simples.
- O nome da visitante fica só no aparelho dela (localStorage) e só sai quando ela mesma envia pelo WhatsApp.

## Ícones (Diamond Icons)

Conjunto próprio, desenhado para a marca: grade 24×24, traço de 1,5, cantos em chanfro de 45° (o corte do
diamante do logo) e o losango como detalhe. Todos ficam num sprite único (`SpriteIcones`), e cada uso é só
`<Icone nome="pin" />` (opcional: `tamanho={20}` e `rotulo="Local"` quando o ícone precisa ser lido por leitores de tela).
Para criar um ícone novo, siga as regras no topo de `components/icones/catalogo.tsx` e confira em `/icones`.

## Movimento

Tudo passa por `components/efeitos/Revelar.tsx` (atributos no HTML) e por cada seção:
`data-reveal` (sobe e aparece), `data-stagger` (filhos em sequência), `data-split` (título linha a linha),
`data-desvelar` (bloco grande revelado de cima para baixo), `data-parallax` e `data-bg` (o fundo viaja).
O pico (diamante 3D) fica em `secoes/Acesso.tsx` (coreografia da rolagem) e `secoes/acesso/diamante3d.ts` (pedra, luzes e câmera);
a assinatura (lista, corda e carimbo) em `components/lista/`. Na cena presa, anime só `transform` e `opacity`:
recorte (`clip-path`), tamanho e `backdrop-filter` por quadro deixam a rolagem pesada.
As animações ficam **ligadas por padrão**, mesmo com "Efeitos de animação" desligado no Windows ou "Reduzir movimento"
no celular (muitos computadores vêm assim e o site ficava parado). Quem prefere o site parado usa o botão
**"Reduzir movimento"** no rodapé; a escolha fica guardada no aparelho (`lib/movimento.ts` e `lib/preferencias.ts`).

## Estrutura

```
app/                    layout (fontes, SEO), página, estilos globais, sitemap, robots
components/
  secoes/               Porta · Dentro · Acesso (pico) · Agenda (+ EventoDetalhe) · Marcas · NaLista
  lista/                a assinatura: ListaProvider (o nome), Lista, Corda de veludo, Saudacao
  icones/               Diamond Icons: catalogo (desenhos), SpriteIcones, Icone
  ui/                   Header, Rodape, Cartaz, ProximoEvento
  efeitos/              SmoothScroll (Lenis), Revelar (revelações e fundo que viaja)
  formularios/          FormMarcas (→ WhatsApp, com prévia)
conteudo/               o que a equipe edita: eventos, parceiros, contato, textos
lib/                    funções: datas, whatsapp, mapas, nome, seo, movimento
public/                 logos, og.png, eventos/ e parceiros/ (.webp/.avif gerados), videos/
originais/              fotos e logos originais (JPG/PNG), fora do site publicado
scripts/                otimizar-imagens.mjs
docs/                   BRIEF.md (entrevista e plano em cenas) e construcoes.md
```
