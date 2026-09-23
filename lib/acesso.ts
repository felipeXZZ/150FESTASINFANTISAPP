import type { Sessao } from "@/lib/sessao";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Plano } from "@/lib/tipos";

export type Acesso = {
  /** Plano atual no banco: um upgrade vale na hora, sem sair e entrar de novo. */
  plano: Plano;
  /** Módulos avulsos que ela comprou (IDs de `modulos`). */
  modulosComprados: Set<string>;
};

/**
 * Lê o acesso atual da cliente em `compras` e `compras_modulos`. Só roda no
 * servidor. Se o banco falhar, cai no que está no cookie: nunca tranca a
 * cliente fora por causa de uma consulta.
 */
export async function carregarAcesso(sessao: Sessao): Promise<Acesso> {
  const reserva: Acesso = { plano: sessao.plano, modulosComprados: new Set() };
  try {
    const admin = createAdminClient();
    const [compra, modulos] = await Promise.all([
      admin.from("compras").select("plano").eq("email", sessao.email).maybeSingle(),
      admin.from("compras_modulos").select("modulo_id").eq("email", sessao.email).eq("ativo", true),
    ]);
    if (compra.error) console.warn("[acesso] compras", compra.error.message);
    if (modulos.error) console.warn("[acesso] compras_modulos", modulos.error.message);

    return {
      plano: compra.data?.plano === "completo" ? "completo" : compra.data ? "basico" : sessao.plano,
      modulosComprados: new Set((modulos.data ?? []).map((m) => m.modulo_id as string)),
    };
  } catch (e) {
    console.warn("[acesso]", e instanceof Error ? e.message : e);
    return reserva;
  }
}
