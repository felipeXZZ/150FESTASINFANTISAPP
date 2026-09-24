-- Módulo em destaque: o card aparece colorido, com borda dourada, selo
-- "Oferta especial" e botão verde, antes dos outros vendidos à parte.
-- Rode no SQL Editor depois do 07-fechar-modulos.sql.
alter table modulos add column if not exists destaque boolean not null default false;

-- A oferta "Pacote Leve Todos" já entra em destaque.
update modulos set destaque = true where id = '48519712-adc7-456f-a276-959050a45486';
