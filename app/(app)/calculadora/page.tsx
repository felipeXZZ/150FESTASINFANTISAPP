import { Suspense } from "react";
import Link from "next/link";
import { History } from "lucide-react";
import { Calculadora } from "@/components/calculadora/calculadora";
import { OfertaBiblioteca } from "@/components/biblioteca/oferta-biblioteca";
import { temAcessoTotal } from "@/lib/admin";
import { exigirSessao } from "@/lib/sessao";
import { RegistrarVisita } from "./biblioteca";

export const metadata = { title: "Calculadora — 150 Festas Infantis" };

// Acesso total (ACESSO_TOTAL_EMAILS) usa a calculadora de verdade. Para os
// outros, a aba da barra abre a oferta em popup; esta página atende quem chega
// pelo endereço direto.
export default async function CalculadoraPage() {
  const sessao = await exigirSessao();

  if (temAcessoTotal(sessao.email)) {
    return (
      <div className="mx-auto max-w-xl">
        <Link href="/historico" className="mb-2 flex min-h-11 items-center justify-end gap-1 text-sm font-semibold text-azul">
          <History className="size-4" aria-hidden="true" />
          Cálculos salvos
        </Link>
        {/* useSearchParams (?duplicar=) pede Suspense em volta. */}
        <Suspense>
          <Calculadora />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-3xl border border-linha bg-papel">
      <RegistrarVisita />
      <OfertaBiblioteca />
    </div>
  );
}
