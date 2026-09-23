import { redirect } from "next/navigation";
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
 * servidor. Compra suspensa (`ativo = false`) ou apagada tira ela da conta na
 * hora, mesmo com o cookie ainda válido. Se o banco falhar, cai no que está no
 * cookie: nunca tranca a cliente fora por causa de uma consulta.
 */
export async function carregarAcesso(sessao: Sessao): Promise<Acesso> {
  const reserva: Acesso = { plano: sessao.plano, modulosComprados: new Set() };
  let suspenso = false;
  let acesso = reserva;

  try {
    const admin = createAdminClient();
    const [compra, modulos] = await Promise.all([
      admin.from("compras").select("plano, ativo").eq("email", sessao.email).maybeSingle(),
      admin.from("compras_modulos").select("modulo_id").eq("email", sessao.email).eq("ativo", true),
    ]);
    if (modulos.error) console.warn("[acesso] compras_modulos", modulos.error.message);

    if (compra.error) {
      console.warn("[acesso] compras", compra.error.message);
    } else if (!compra.data || !compra.data.ativo) {
      suspenso = true;
    } else {
      acesso = {
        plano: compra.data.plano === "completo" ? "completo" : "basico",
        modulosComprados: new Set((modulos.data ?? []).map((m) => m.modulo_id as string)),
      };
    }
  } catch (e) {
    console.warn("[acesso]", e instanceof Error ? e.message : e);
  }

  // Fora do try: redirect() funciona lançando um erro que o Next precisa ver.
  if (suspenso) redirect("/sair?motivo=suspenso");
  return acesso;
}
