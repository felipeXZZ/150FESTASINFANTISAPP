import { BannerNovidade } from "@/components/acervo/banner-novidade";
import { ListaModulos } from "@/components/acervo/lista-modulos";
import { exigirSessao, primeiroNome } from "@/lib/sessao";
import { createClient } from "@/lib/supabase/server";
import { estadoModulo, type Modulo } from "@/lib/tipos";

export default async function MinhasFestasPage() {
  const sessao = await exigirSessao();
  const supabase = await createClient();

  // "*": se o 04-modulo-bloqueado.sql ainda não rodou, as colunas novas só vêm vazias.
  const { data, error } = await supabase
    .from("modulos")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  if (error) console.error("[acervo] modulos", error.message);
  const modulos = ((data ?? []) as Partial<Modulo>[])
    // Quem tem o Completo não vê o que é só do Básico: já está dentro do que ela tem.
    .filter((m) => !(sessao.plano === "completo" && m.so_basico))
    .map((m) => {
      const modulo: Modulo = {
        id: m.id!,
        titulo: m.titulo ?? "",
        descricao: m.descricao ?? null,
        capa_url: m.capa_url ?? null,
        contador: m.contador ?? null,
        url_drive: m.url_drive ?? "",
        plano_minimo: m.plano_minimo === "completo" ? "completo" : "basico",
        ordem: m.ordem ?? null,
        em_breve: Boolean(m.em_breve),
        bloqueado: Boolean(m.bloqueado),
        checkout_url: m.checkout_url ?? null,
        preco: m.preco ?? null,
        so_basico: Boolean(m.so_basico),
      };
      // O link do Drive só vai para o navegador de quem pode abrir o módulo.
      if (estadoModulo(modulo, sessao.plano) !== "liberado") modulo.url_drive = "";
      return modulo;
    });

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-titulo text-2xl leading-tight">Olá, {primeiroNome(sessao)}!</h1>
        <p className="mt-1 text-tinta/70">Sua coleção completa de festas, pronta pra montar.</p>
      </section>

      <BannerNovidade />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Módulos liberados</h2>
        <ListaModulos modulos={modulos} plano={sessao.plano} />
      </section>
    </div>
  );
}
