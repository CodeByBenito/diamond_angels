# Diamond Angels — site (Next.js + TypeScript)

O clube feminino de Salvador contado como um desfile em seis atos:
Luzes · Camarim · A porta · Line-up · Duas portas · Última chamada.

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
| Agenda de eventos | `lib/eventos.ts` (e mude `EVENTOS_SAO_EXEMPLO` para `false` quando forem reais) |
| Links do Instagram, looks, benefícios, serviços | `lib/conteudo.ts` |
| Vídeo atrás da cortina | coloque o arquivo em `public/videos/passarela.mp4` (aparece sozinho) |
| Cores e tipografia | topo de `app/globals.css` e `app/layout.tsx` |

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript**, exportado como site estático.
- **GSAP 3 + ScrollTrigger + SplitText**: cortina, desfile, títulos que montam, fundo que viaja.
- **Lenis**: rolagem suave, movida pelo mesmo relógio do GSAP.
- **next/font**: Gloock, Instrument Sans e JetBrains Mono servidas pelo próprio site.
- Tudo respeita "reduzir movimento" do sistema: sem animação, a página vira uma leitura simples.

## Estrutura

```
docs/                  BRIEF.md (entrevista e plano em cenas) e construcoes.md (registro da skill)
_versao-anterior-html/ a versão em HTML puro, guardada só como referência (não é publicada)
app/            layout (fontes, SEO), página e estilos globais
components/     Header, Pulseira (movimento-assinatura), Cursor, Briefing, SmoothScroll, Motion
components/atos Luzes, Camarim, Porta (pico), Lineup, Caminhos, Chamada
lib/            conteúdo, eventos e utilitários de movimento
public/         logos, imagem de compartilhamento, vídeos
```
