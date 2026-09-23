# 150 Festas Infantis — especificação do aplicativo

Área de membros da oferta **+150 Festas Infantis Prontas para Você Copiar**
(150festasinfantis.vercel.app), para o público de mães que montam a própria festa.
Marca: Decoração Sem Complicação.

É a mesma base do aplicativo do Kit da Decoradora (acesso pelo e-mail da compra +
webhook da GGCheckout), com duas diferenças: aqui só existem os módulos de
conteúdo, e a aba Calculadora apresenta a Biblioteca Visual da Decoradora, que é
outro produto.

Este arquivo é a fonte da verdade do projeto. Todo o texto de interface é em
português do Brasil.

---

## 1. O que é o produto

A cliente compra o guia por pagamento único e recebe acesso a este aplicativo.
Dentro dele ela abre os módulos de projetos e os bônus, cada um apontando para
uma pasta no Google Drive.

Dois planos de acesso vitalício, sem recorrência:

- `basico` — os projetos de festa infantil (R$ 10 na página de vendas)
- `completo` — os projetos + os 5 bônus (R$ 29,90): Manual de Montagem Passo a
  Passo, Checklist de Compras da Festa, Guia Prático de Balões, Cronograma da
  Festa Sem Correria, 50 Ideias de Lembrancinhas Econômicas

Preços mostrados na interface (upgrade) ficam em variável de ambiente, nunca no
código.

**Ela usa isso no celular, sentada no chão da sala montando, ou em pé na loja de
material.** Essa frase decide todo empate de layout.

---

## 2. Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- Supabase — Postgres com RLS e Storage (Auth não é usado; ver seção 5)
- Deploy na Vercel
- PWA instalável na tela inicial

### Regras fixas

- Mobile-first sempre. Desenhe para 390px e depois adapte para desktop.
- Alvos de toque com no mínimo 44px de altura.
- RLS ativado em toda tabela nova, sem exceção.
- Nenhuma biblioteca de UI pesada (nada de MUI, Chakra, Ant, shadcn).
- Ícones: `lucide-react`.
- Imagens servidas pelo transform do Supabase Storage (`lib/imagem.ts`).
- Nenhuma chave secreta no cliente. `SUPABASE_SERVICE_ROLE_KEY` só no servidor.

---

## 3. Direção visual

O público é mãe planejando a festa do filho. O tom é caprichado e alegre, mas
organizado — ela está resolvendo uma tarefa, não navegando por inspiração.

A paleta é a mesma do site de vendas (150festasinfantis.vercel.app), para a
cliente sentir que entrou no produto que comprou.

| Token | Hex | Uso |
|---|---|---|
| `tinta` | `#1A2338` | texto principal (`tinta-suave` `#4C5A72` no secundário) |
| `marinho` | `#0B1E5B` | header, `theme_color` do PWA |
| `azul` | `#1D4ED8` | botões primários, aba ativa, foco (`azul-escuro` no toque) |
| `ouro` | `#F0B429` | badges, banner de novidade, cadeado (`ouro-claro` no fundo) |
| `verde` | `#22B455` | botões de compra: upgrade e Biblioteca (`verde-compra-escuro` no toque) |
| `verde-escuro` | `#1F7A45` | confirmações, checks, WhatsApp |
| `papel` | `#F5F1EB` | fundo da aplicação (creme do site) |
| `linha` | `#E7E0D5` | bordas e divisórias |

Títulos em **Bricolage Grotesque** (700), interface em **Inter** (400 e 600).
Sem caixa alta em rótulos. Tokens em `app/globals.css`.

---

## 4. Banco de dados

Aplicar no SQL Editor do Supabase, nesta ordem:

1. `supabase/schema.sql` — o schema da especificação (profiles, modulos, eventos).
2. `supabase/02-acesso-webhook-admin.sql` — `compras`, `eventos_uso`,
   `webhook_log`, coluna `modulos.em_breve` e o bucket `capas`.
3. `supabase/03-modulos-exemplo.sql` (opcional) — 2 módulos: as festas e os 5 bônus juntos, com URL
   do Drive a trocar.

Não existe tabela `calculos`: a calculadora não roda aqui. `profiles` e `eventos`
ficam sem uso enquanto não houver Supabase Auth (seção 5).

---

## 5. Acesso (sem login)

Mesmo padrão do Kit da Decoradora. A cliente digita o e-mail que usou na compra
e entra na hora — sem senha e sem link por e-mail (magic link exige SMTP próprio
no Supabase; foi o que fez o Kit abandonar esse caminho).

- `/entrar` confere o e-mail na tabela `compras`, alimentada pelo webhook.
  E-mail fora da lista: "Não encontramos esse e-mail. Use o mesmo e-mail da
  compra ou fale com o suporte." com botão de WhatsApp ao lado.
  `compras.ativo = false`: "Esse acesso está suspenso".
- Acesso confirmado grava o cookie `fi_acesso` (httpOnly, 180 dias) com e-mail,
  nome e plano, assinado em HMAC-SHA256 com `SESSAO_SECRET` (`lib/sessao.ts`).
- `proxy.ts` (middleware do Next 16) manda para `/entrar` quem não tem acesso.
  Rotas públicas: `/entrar`, `/sair`, `/api/webhook`.
- Visual da entrada: faixa marinho com a capa do guia
  (`public/capa-150-festas-480.webp` e `-800.webp`, geradas do PNG original),
  formulário em card branco. No desktop, duas colunas.
- Abaixo do formulário, bloco "Com dificuldade para entrar?" com WhatsApp
  (verde do site) e Instagram. Nunca deixe a cliente sem saída numa tela de erro.

Limite conhecido: quem souber o e-mail de uma compradora entra. O caminho para
acesso individual de verdade é magic link do Supabase Auth com SMTP próprio.

O plano fica no cookie: depois de um upgrade, a cliente precisa sair e entrar de
novo para ver os bônus.

---

## 6. Layout

**Header fixo:** "150 Festas Infantis" à esquerda; à direita, WhatsApp e "Sair".

**Barra fixa no rodapé**, três abas:

```
  Minhas festas        Calculadora          Conta
        /              /calculadora         /conta
```

A aba Calculadora leva um pequeno cadeado ao lado do rótulo — nunca o texto
"(bloqueada)".

**Animações** (em `app/globals.css`, todas desligadas com `prefers-reduced-motion`):

- Troca de aba: `app/(app)/template.tsx` faz a tela entrar pelo lado da aba
  tocada (`pagina-direita` / `pagina-esquerda`); na primeira tela, sobe de leve.
- Barra: indicador azul desliza até a aba ativa e o ícone ativo cresce um pouco.
- Popups (`<dialog class="popup">`): centralizados também no celular; o fundo
  escurece, o popup sobe com um leve quique e os itens `.entra` aparecem em
  sequência (atraso em `--atraso`).

---

## 7. Minhas festas (`/`)

1. Saudação "Olá, {primeiro nome}!" (neutra: serve para mulher e homem) e "Sua coleção completa de festas,
   pronta pra montar." Nome da compra; sem nome, a parte do e-mail antes do `@`.
2. Banner de novidade (`NEXT_PUBLIC_BANNER_NOVIDADE`); vazio = não aparece.
3. "Módulos liberados": cards de `modulos` por `ordem`, 1/2/3 colunas.
   - liberado (`completo` vê tudo; `basico` vê `plano_minimo = 'basico'`): abre
     `url_drive` em nova aba e grava `abriu_modulo`;
   - bloqueado pelo plano: capa em preto e branco, cadeado dourado, "Disponível no Pacote
     Completo". Ao tocar grava `viu_bloqueado` e abre o modal com os bloqueados
     e o botão para `NEXT_PUBLIC_CHECKOUT_UPGRADE_URL`;
   - em breve (`em_breve`): preto e branco, selo "Em breve", não abre;
   - bloqueado (`bloqueado`, em `supabase/04-modulo-bloqueado.sql`): vendido à
     parte para qualquer plano. Preto e branco com cadeado; ao tocar abre o popup
     de pagamento com `checkout_url` e `preco` do próprio módulo (sem link, usa o
     checkout do upgrade). A compra avulsa ainda não é registrada: a entrega é
     pela GGCheckout.
   - Todo card que a cliente não pode abrir sai sem `url_drive` do servidor.

Módulo bloqueado nunca some da tela.

---

## 8. Calculadora (`/calculadora`) — outro produto

Não calcula nada. A aba da barra abre um popup (fundo escuro) e grava
`viu_calculadora`. Imagem da Biblioteca (`public/biblioteca-visual-480/800.webp`),
mensalidade de `NEXT_PUBLIC_PRECO_BIBLIOTECA` (a Biblioteca é assinatura: o app
mostra "/mês" e "Assinatura mensal") e botão verde para
`NEXT_PUBLIC_BIBLIOTECA_CHECKOUT_URL` ("Quero a Biblioteca Visual", o app
acrescenta `?origem=app-festas` e grava `clicou_biblioteca`). Só o link de
pagamento, sem link para a página de vendas. Topo marinho curto, 6 blocos com ícone
em duas colunas (o primeiro, em azul, é "Calculadora de preço — inclusa"), tudo
cabendo na tela do celular sem rolar. A página
`/calculadora` mostra o mesmo conteúdo para quem chega pelo endereço direto.

**Importante:** a calculadora nunca foi prometida na página de vendas. Tratar
como recurso trancado dá sensação de produto incompleto e gera reembolso. É
outro produto, de outro público. Nenhum texto dessa tela pode usar
"desbloquear", "liberar" ou "seu acesso".

---

## 9. Conta (`/conta`)

E-mail, plano por extenso ("Pacote Completo — acesso vitalício"), "Falar com o
suporte" e "Sair". Plano `basico` vê o card de upgrade. Admins veem o link para
`/admin`.

---

## 10. PWA

`public/manifest.json`: "150 Festas Infantis", curto "Festas", ícones 192/512,
`standalone`, `theme_color #0B1E5B`, `background_color #F5F1EB`. `public/sw.js`
(só em produção): páginas rede-primeiro com cache offline; estáticos
cache-primeiro. Faixa "Instale na tela inicial e use como aplicativo" com
`beforeinstallprompt` no Android e instruções no iOS.

---

## 11. Webhook de compra (GGCheckout)

`POST /api/webhook/compra`, no servidor, com a service role.

- Segredo em `x-secret` ou `Authorization: Bearer`, comparado com
  `WEBHOOK_SECRET`. Inválido = 401.
- Aprovada = `payment.status` (ou o final de `event`, ex. `pix.paid`) = `paid`.
- Plano: primeiro pelos IDs em `WEBHOOK_PRODUTOS_BASICO/_COMPLETO/_UPGRADE`
  (olha `product.id` e `products[].id`, vale o maior). Sem ID conhecido, pelo
  valor pago: perto de `WEBHOOK_VALOR_UPGRADE` = upgrade; a partir de
  `WEBHOOK_VALOR_MIN_COMPLETO` (16 em produção) = completo; abaixo = básico.
  Checkouts que usam este webhook: Básico R$ 10 (`dHBGUyfqTCc1FSzI0XPk`, produto
  "150 Festas Infantis: Copiar e Colar" `AhcuLW7B0yATLyaYSdK5`, em `WEBHOOK_PRODUTOS_BASICO`),
  Completo R$ 29,90 (`TrDo8Xg6jiuCWxmTrXEi`), upsell do popup R$ 17,90
  (`GwyvIf2cHvXUvPxPInpC`) e upgrade no app R$ 6,90 (`NuTIRfsxypFzjKAOivEi`).
  A oferta de R$ 12,90 (`je3Zk5rzT1MvKP5imfgR`) não é mais usada. Os do Completo ficam no mesmo
  produto da GGCheckout (`6jfVtbCkP0kG2phGqapy`, em `WEBHOOK_PRODUTOS_COMPLETO`).
  `amount` vem em centavos: inteiro a partir de 100 é lido como centavo.
  A Biblioteca Visual NÃO usa este webhook: é outro produto, com outra área. Sem
  valor, cai em `WEBHOOK_PRODUTO_PADRAO`.
- Quem já é `basico` e paga de novo (outro `payment.id`) vira `completo`: é o
  upgrade, mesmo que o valor não tenha sido reconhecido.
- Upsert em `compras` (e-mail, nome, plano). Plano nunca é rebaixado. Não envia
  e-mail: a cliente recebe o link do app pela GGCheckout e entra com o e-mail.
- 200 para tudo que foi processado ou ignorado de propósito (inclusive o evento
  `test`); 500 só em falha nossa, para o gateway tentar de novo.
- Toda requisição vai para `webhook_log` com o payload cru.
- Reembolso e chargeback são só registrados; bloquear fica para depois
  (manualmente: `compras.ativo = false`).

---

## 12. Admin de módulos

`/admin`, só para `ADMIN_EMAILS` (os outros veem 404). Cria e edita módulos:
título, descrição, capa (upload direto ao bucket `capas` por URL assinada),
contador, URL do Drive, plano mínimo, ordem, ativo, em breve.

---

## 13. Variáveis de ambiente

Ver `.env.example`, com explicação de cada uma:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SESSAO_SECRET=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_WHATSAPP_NUMERO=
NEXT_PUBLIC_INSTAGRAM_URL=
NEXT_PUBLIC_CHECKOUT_UPGRADE_URL=
NEXT_PUBLIC_PRECO_UPGRADE=
NEXT_PUBLIC_BIBLIOTECA_URL=
NEXT_PUBLIC_BIBLIOTECA_CHECKOUT_URL=
NEXT_PUBLIC_PRECO_BIBLIOTECA=
NEXT_PUBLIC_BANNER_NOVIDADE=
NEXT_PUBLIC_BANNER_NOVIDADE_URL=
WEBHOOK_SECRET=
WEBHOOK_PRODUTOS_BASICO=
WEBHOOK_PRODUTOS_COMPLETO=
WEBHOOK_PRODUTOS_UPGRADE=
WEBHOOK_PRODUTO_PADRAO=
WEBHOOK_VALOR_MIN_COMPLETO=
WEBHOOK_VALOR_UPGRADE=
ADMIN_EMAILS=
```

---

## 14. Pasta `_legado-kit/`

Código do Kit da Decoradora que não se aplica aqui (calculadora funcional,
histórico, SQL antigo, template de magic link). Fica fora do build e do git;
pode ser apagada.

---

## 15. Aviso sobre o acervo

Link de pasta do Google Drive vaza e não dá para revogar. Aceito nesta versão
para subir rápido. Quando houver faturamento, migre para o Supabase Storage com
URL assinada de 1 hora — basta trocar o destino de `url_drive`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
