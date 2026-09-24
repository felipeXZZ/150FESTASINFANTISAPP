import { redirect } from "next/navigation";
import { temAcessoTotal } from "@/lib/admin";
import { exigirSessao } from "@/lib/sessao";

/** Histórico de cálculos: só para quem usa a calculadora (ACESSO_TOTAL_EMAILS). */
export default async function HistoricoLayout({ children }: { children: React.ReactNode }) {
  const sessao = await exigirSessao();
  if (!temAcessoTotal(sessao.email)) redirect("/calculadora");
  return <div className="mx-auto max-w-xl">{children}</div>;
}
