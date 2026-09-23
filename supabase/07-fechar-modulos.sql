-- Fecha a tabela de módulos para a chave pública. A policy "ler modulos" do
-- schema original deixava qualquer pessoa com a chave pública (que vai no
-- navegador) listar todos os links do Drive, inclusive dos módulos pagos.
-- O app lê os módulos só no servidor, com a service role, e filtra por plano.
-- Rode no SQL Editor depois do 06-compras-modulos.sql.
drop policy if exists "ler modulos" on modulos;
-- RLS continua ligado e sem policy: só a service role (servidor) lê e grava.
