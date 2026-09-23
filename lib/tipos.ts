export type Plano = "basico" | "completo";

export type Modulo = {
  id: string;
  titulo: string;
  descricao: string | null;
  capa_url: string | null;
  contador: string | null;
  /** Vazio quando a cliente não pode abrir: o link do Drive nunca vai para quem não tem acesso. */
  url_drive: string;
  plano_minimo: Plano;
  ordem: number | null;
  /** Aparece em preto e branco com o selo "Em breve" e não abre. */
  em_breve: boolean;
  /** Vendido à parte, para qualquer plano: preto e branco, cadeado e popup de pagamento. */
  bloqueado: boolean;
  checkout_url: string | null;
  preco: string | null;
  /** Só aparece para o plano básico; quem tem o Completo não vê (ex: as 50 festas). */
  so_basico: boolean;
};

/** Como o card aparece para a cliente. */
export type EstadoModulo = "liberado" | "bloqueado_plano" | "bloqueado_venda" | "em_breve";

export type TipoEvento = "abriu_modulo" | "viu_bloqueado" | "viu_calculadora" | "clicou_biblioteca";

export function moduloLiberado(modulo: Pick<Modulo, "plano_minimo">, plano: Plano) {
  return plano === "completo" || modulo.plano_minimo === "basico";
}

export function estadoModulo(
  modulo: Pick<Modulo, "plano_minimo" | "em_breve" | "bloqueado">,
  plano: Plano,
): EstadoModulo {
  if (modulo.em_breve) return "em_breve";
  if (modulo.bloqueado) return "bloqueado_venda";
  return moduloLiberado(modulo, plano) ? "liberado" : "bloqueado_plano";
}

/** "9,90" -> "R$ 9,90"; quem já escreveu "R$" fica como está. */
export function precoLegivel(preco: string | null | undefined) {
  const p = (preco ?? "").trim();
  if (!p) return "";
  return /^r$/i.test(p) ? p : `R$ ${p}`;
}
