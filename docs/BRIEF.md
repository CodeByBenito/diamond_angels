# BRIEF — Diamond Angels

## v5 (2026-09-30) — proposta unificada

Pedido: unificar num só site (1) os eventos onde a Diamond está presente ou em parceria, com foto, localização e informações;
(2) o clube e os benefícios de quem participa; (3) um formulário para empresas divulgarem eventos que abre o WhatsApp
+55 71 99659-1036 com a mensagem montada. Motions mais suaves, tipografia alinhada ao logo, responsivo.

- **Ordem:** Hero · Faixa · O clube · Benefícios + como entrar · Eventos (filtro Diamond/Parceria, detalhe com mapa e "Quero ir" pelo WhatsApp) · Para marcas (formulário + prévia da mensagem) · Chamada final.
- **Tipografia:** Cinzel (as capitulares romanas do logo) em títulos de marca e rótulos; Cormorant Garamond itálico nos destaques em ouro; Manrope na leitura.
- **Movimento:** saíram a cortina presa por 5 telas, a pulseira voadora e o cursor próprio. Entram revelações únicas com curva expo, títulos linha a linha e parallax leve; toque nativo no celular.
- **Paleta:** a mesma do logo — preto, rubi e ouro polido em gradiente.

A seção abaixo é o plano da v4, mantido como histórico.

# v4 (Sites Incríveis)

## As 7 respostas

1. **O que é e pra quem:** Diamond Angels, o clube feminino de Salvador (eventos, VIP, divulgação e promotoria). O site fala com dois públicos, com uma entrada comum que depois se divide em "quero entrar" (mulheres) e "quero contratar" (marcas e produtores).
2. **Vibe:** backstage de desfile. Glamour, pressa, bastidor, atitude. Referências: Vogue, making of de desfile, camarim.
3. **Caminho:** ordem de desfile. Luzes acendem com a logo, camarim (quem somos), passarela (o que o time recebe), line-up (agenda), bifurcação (entrar ou contratar), encerramento.
4. **O que precisa acreditar no final:** fazer parte abre portas.
5. **Pico:** a porta que se abre. A cortina do backstage abre com a rolagem e a pessoa passa do bastidor para a passarela iluminada.
6. **Movimento-assinatura:** pulseira VIP. Uma pulseira de acesso dourada acompanha a rolagem, é carimbada a cada ato e, no final, vira o botão "Entre para o time".
7. **Materiais:** logo (versão nova, fundo transparente), textos e links do site atual, vídeos de eventos (a enviar), agenda real (a enviar). Sem fotos, números novos ou depoimentos. Nada será inventado.

## Jornada em cenas

| # | Cena | O que VÊ | O que SENTE | O que passa a ACREDITAR | Efeito (família) | Energia |
|---|---|---|---|---|---|---|
| 1 | **Luzes** | Palco escuro. Uma fileira de luzes de passarela acende uma a uma e revela a logo. Título "O clube feminino de Salvador." monta palavra por palavra. A pulseira aparece no canto, vazia. | Expectativa, "vai começar" | Isto é um evento, não um site comum | Texto que se monta + sequência de luzes (código próprio) | Média |
| 2 | **Camarim** | Uma "folha de chamada" de bastidor: LOOK 01 Events, LOOK 02 Influence, LOOK 03 Experiences, com etiquetas de arara. Cada look carimba a pulseira. | Intimidade, bastidor | Existe um time organizado por trás | Revelações (entram de lados alternados) | Calma |
| 3 | **A porta (PICO)** | Cena presa por 5 telas. Duas cortinas abrem com a rolagem, a luz invade e surge a passarela com os benefícios passando um a um (Acesso VIP, Benefícios exclusivos, Divulgação, Conexões). Com vídeo: um vídeo real do evento aparece atrás da cortina. | Arrepio, entrada triunfal | **Fazer parte abre portas** | Cena fixa com interpolação coreografada (+ vídeo pela rolagem, se enviado) | Máxima |
| 4 | **Line-up** | O fundo vira papel marfim, como o roteiro de um desfile ("run of show"): horário, evento, local, tipo de acesso, cada linha com "Quero ir". | Respiro, clareza | Acontece de verdade e tem data | Fundo que viaja (preto para marfim) | Calma-média |
| 5 | **Bifurcação** | Tela dividida em duas portas: "Quero entrar" e "Quero contratar". A porta sob o mouse se abre e mostra o conteúdo: benefícios do time de um lado, serviços, fluxo e briefing do outro. | Escolha, "isso é pra mim" | Tem um caminho feito para mim | Profundidade (mouse) + expansão própria | Média-alta |
| 6 | **Encerramento** | A pulseira, com os carimbos completos, vai para o centro e se transforma no botão "Entre para o time". Rodapé com os três perfis. | Pertencimento | Só falta eu entrar | Assinatura (a pulseira vira o CTA) | Resolve |

**Curva de energia:** média, calma, MÁXIMA, calma-média, média-alta, resolução. Cenas vizinhas nunca têm a mesma energia nem a mesma família de efeito.

## Direção visual

- **Paleta:** preto de coxia (fundo), vinho de cortina (superfície), marfim de papel (tinta e cena 4), dourado da logo como único acento: pulseira, carimbos, botão principal.
- **Tipografia:** serifada de alto contraste, estilo capa de revista de moda, para os títulos. Sem serifa limpa para a leitura. Mono de bastidor para etiquetas ("LOOK 01", horários, "RUN OF SHOW").
- **Detalhe só deste negócio:** numeração de look e folha de chamada. A ordem é real: é a ordem do desfile.

## Stack

- HTML, CSS e JS estáticos (hospedagem simples em qualquer lugar).
- Motor Sites Incríveis (`sites-incriveis.js` / `.css`) para revelações, cena fixa, fundo que viaja e profundidade.
- Lenis para rolagem suave com inércia.
- Pulseira, luzes e cortina em SVG e código próprio da página, sincronizados com a rolagem.
- Respeita movimento reduzido: tudo legível parado.

## Pendências (do Benito)

- [ ] Vídeos de eventos na pasta `diamond_angels/videos/` (idealmente 1 vídeo vertical e 1 horizontal, 10–20 s).
- [ ] Agenda real: data, nome, local, horário e se é VIP ou aberto.

## Mantido do site atual

Textos, links (@diamondangels3, @bwagency7, @bruwolker), logo, gerador de briefing para marcas e agenda com filtro VIP/Abertos.
