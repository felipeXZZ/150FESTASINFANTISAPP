-- Módulo "bloqueado": vendido à parte, para qualquer plano. Aparece em preto e
-- branco com cadeado e, ao tocar, abre o popup de pagamento com o link e o preço
-- do próprio módulo. Rode no SQL Editor depois do 02-acesso-webhook-admin.sql.
alter table modulos add column if not exists bloqueado boolean not null default false;
alter table modulos add column if not exists checkout_url text;   -- link de pagamento do módulo
alter table modulos add column if not exists preco text;          -- texto livre, ex: "R$ 9,90"
