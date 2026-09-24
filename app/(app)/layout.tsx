import { Header } from "@/components/header";
import { BarraNavegacao } from "@/components/barra-navegacao";
import { FaixaInstalar } from "@/components/pwa";
import { temAcessoTotal } from "@/lib/admin";
import { getSessao } from "@/lib/sessao";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sessao = await getSessao();

  return (
    <>
      <Header />
      <main className="pb-barra mx-auto max-w-5xl px-4 pt-[calc(3.5rem+env(safe-area-inset-top)+1.25rem)]">
        {children}
      </main>
      <FaixaInstalar />
      <BarraNavegacao calculadoraLiberada={temAcessoTotal(sessao?.email)} />
    </>
  );
}
