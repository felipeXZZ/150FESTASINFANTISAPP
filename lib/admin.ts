import { notFound } from "next/navigation";
import { exigirSessao } from "@/lib/sessao";

/** Lê uma lista de e-mails separados por vírgula de uma variável de ambiente. */
function listaEmails(valor: string | undefined) {
  return (valor ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** E-mails de ADMIN_EMAILS (separados por vírgula). Só roda no servidor. */
export function ehAdmin(email: string | null | undefined) {
  if (!email) return false;
  return listaEmails(process.env.ADMIN_EMAILS).includes(email.trim().toLowerCase());
}

/**
 * E-mails de ACESSO_TOTAL_EMAILS: entram mesmo sem compra, veem o Pacote
 * Completo, todos os módulos avulsos e a calculadora funcionando. Só no servidor.
 */
export function temAcessoTotal(email: string | null | undefined) {
  if (!email) return false;
  return listaEmails(process.env.ACESSO_TOTAL_EMAILS).includes(email.trim().toLowerCase());
}

/** Para páginas e actions do /admin: quem não é admin vê 404, sem pista de que a rota existe. */
export async function exigirAdmin() {
  const sessao = await exigirSessao();
  if (!ehAdmin(sessao.email)) notFound();
  return sessao;
}
