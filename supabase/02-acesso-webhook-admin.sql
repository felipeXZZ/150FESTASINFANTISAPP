-- Acesso sem login, webhook da GGCheckout e admin de módulos.
-- Rode no SQL Editor do Supabase depois do schema.sql.

-- QUEM COMPROU
-- Alimentada pelo webhook da GGCheckout. A tela de entrada só confere se o
-- e-mail está aqui. Sem policy: só a service role (rota de servidor) acessa.
create table compras (
  id bigserial primary key,
  email text not null unique,
  nome text,
  plano text not null default 'basico',        -- basico | completo
  ativo boolean not null default true,         -- false bloqueia o acesso
  pagamento_id text,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

alter table compras enable row level security;

-- EVENTOS DE USO
-- A tabela `eventos` do schema depende de auth.users, que o acesso sem login
-- não usa. Os eventos ficam aqui, pelo e-mail da compra.
create table eventos_uso (
  id bigserial primary key,
  email text,
  tipo text not null,      -- abriu_modulo | viu_bloqueado | viu_calculadora | clicou_biblioteca
  ref text,
  criado_em timestamptz default now()
);

alter table eventos_uso enable row level security;

create index eventos_uso_data_idx on eventos_uso (criado_em desc);
create index eventos_uso_tipo_idx on eventos_uso (tipo, criado_em desc);

-- LOG DO WEBHOOK DE COMPRA
-- Toda requisição recebida fica aqui, com o payload cru: é a sua defesa em
-- contestação de compra. Sem policy: só a service role lê e grava.
create table webhook_log (
  id bigserial primary key,
  recebido_em timestamptz default now(),
  status text not null,             -- processado | ignorado | assinatura_invalida | erro
  detalhe text,
  email text,
  produto text,
  payload text not null
);

alter table webhook_log enable row level security;

create index webhook_log_data_idx  on webhook_log (recebido_em desc);
create index webhook_log_email_idx on webhook_log (email);

-- MÓDULOS "EM BREVE"
-- Aparecem em preto e branco com o selo "Em breve" e não abrem.
alter table modulos add column em_breve boolean not null default false;

-- CAPAS DOS MÓDULOS (admin)
-- Bucket público: as capas são lidas pelo transform de imagem. O upload usa URL
-- assinada gerada no servidor, então não precisa de policy de escrita.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('capas', 'capas', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
