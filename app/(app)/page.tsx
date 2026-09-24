import { BannerNovidade } from "@/components/acervo/banner-novidade";
import { ListaModulos } from "@/components/acervo/lista-modulos";
import { carregarAcesso } from "@/lib/acesso";
import { exigirSessao, primeiroNome } from "@/lib/sessao";
import { createAdminClient } from "@/lib/supabase/admin";
import { estadoModulo, type EstadoModulo, type Modulo } from "@/lib/tipos";

const PRIORIDADE: Record<EstadoModulo, number> = {
  liberado: 0,
  bloqueado_plano: 1,
  bloqueado_venda: 2,
  em_breve: 3,
};

export default async function MinhasFestasPage() {
  const sessao = await exigirSessao();
  // Plano e módulos avulsos vêm do banco a cada abertura: compra aprovada pelo
  // webhook aparece na hora, sem sair e entrar de novo.
  const { plano, modulosComprados, acessoTotal } = await carregarAcesso(sessao);

  // Lido só no servidor, com a service role: a tabela não é pública (SQL 07),
  // senão qualquer um com a chave pública veria todos os links do Drive.
  // "*": se algum SQL de coluna nova ainda não rodou, a coluna só vem vazia.
  const { data, error } = await createAdminClient()
    .from("modulos")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  if (error) console.error("[acervo] modulos", error.message);
  const modulos = ((data ?? []) as Partial<Modulo>[])
    // Quem tem o Completo não vê o que é só do Básico: já está dentro do que ela tem.
    .filter((m) => !(plano === "completo" && m.so_basico))
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
        produtos_ggcheckout: null, // fica no servidor
      };
      // Módulo avulso comprado (ou acesso total): abre, qualquer que seja o plano.
      if (acessoTotal || modulosComprados.has(modulo.id)) {
        modulo.bloqueado = false;
        modulo.plano_minimo = "basico";
      }
      // O link do Drive só vai para o navegador de quem pode abrir o módulo.
      if (estadoModulo(modulo, plano) !== "liberado") modulo.url_drive = "";
      return modulo;
    })
    // O que ela já tem vem primeiro; logo depois, o que o upgrade libera (as 150
    // festas vêm na frente dos bônus pela "Ordem" do admin); depois os vendidos à
    // parte e, por último, os "em breve". Dentro de cada grupo vale a "Ordem".
    .sort((a, b) => PRIORIDADE[estadoModulo(a, plano)] - PRIORIDADE[estadoModulo(b, plano)]);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="font-titulo text-2xl leading-tight">Olá, {primeiroNome(sessao)}!</h1>
        <p className="mt-1 text-tinta/70">Sua coleção completa de festas, pronta pra montar.</p>
      </section>

      <BannerNovidade />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Módulos liberados</h2>
        <ListaModulos modulos={modulos} plano={plano} />
      </section>
    </div>
  );
}
