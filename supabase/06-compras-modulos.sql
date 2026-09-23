-- Módulos vendidos à parte ligados ao webhook. Rode no SQL Editor depois do
-- 05-so-basico.sql.

-- Qual produto da GGCheckout libera cada módulo. IDs separados por vírgula
-- (o mesmo módulo pode ser vendido em mais de um produto).
alter table modulos add column if not exists produtos_ggcheckout text;

-- QUEM COMPROU CADA MÓDULO AVULSO
-- Gravada pelo webhook; a tela Minhas festas consulta a cada abertura, então o
-- módulo abre na hora, sem sair e entrar de novo. Sem policy: só a service role.
create table if not exists compras_modulos (
  id bigserial primary key,
  email text not null,
  modulo_id uuid not null references modulos (id) on delete cascade,
  pagamento_id text,
  ativo boolean not null default true,         -- false tira o módulo (reembolso manual)
  criado_em timestamptz default now(),
  unique (email, modulo_id)
);

alter table compras_modulos enable row level security;

create index if not exists compras_modulos_email_idx on compras_modulos (email);
