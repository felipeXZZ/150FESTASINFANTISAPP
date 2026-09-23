-- Módulo "só para o Básico": aparece para quem tem o plano básico e some para
-- quem tem o Completo (ex: as 50 festas, que já estão dentro das 150).
-- Rode no SQL Editor depois do 04-modulo-bloqueado.sql.
alter table modulos add column if not exists so_basico boolean not null default false;
