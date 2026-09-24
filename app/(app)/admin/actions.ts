"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export type DadosModulo = {
  id?: string;
  titulo: string;
  descricao: string;
  capa_url: string;
  contador: string;
  url_drive: string;
  plano_minimo: string;
  ordem: number;
  ativo: boolean;
  em_breve: boolean;
  bloqueado: boolean;
  checkout_url: string;
  preco: string;
  so_basico: boolean;
  destaque: boolean;
  produtos_ggcheckout: string;
};

export type Resposta = { ok: true; id: string } | { ok: false; mensagem: string };

const BUCKET = "capas";
const EXTENSOES = new Set(["jpg", "jpeg", "png", "webp"]);

export async function salvarModulo(d: DadosModulo): Promise<Resposta> {
  await exigirAdmin();

  const titulo = d.titulo.trim();
  const url = d.url_drive.trim();
  if (!titulo) return { ok: false, mensagem: "Preencha o título." };
  // Módulo "em breve" ainda não tem pasta: a URL pode ficar vazia.
  if (!(d.em_breve && !url) && !/^https:\/\/\S+$/i.test(url)) {
    return { ok: false, mensagem: "A URL do Drive precisa começar com https://" };
  }
  const checkout = d.checkout_url.trim();
  if (checkout && !/^https:\/\/\S+$/i.test(checkout)) {
    return { ok: false, mensagem: "O link de pagamento precisa começar com https://" };
  }
  if (d.plano_minimo !== "basico" && d.plano_minimo !== "completo") {
    return { ok: false, mensagem: "Plano mínimo inválido." };
  }

  const registro = {
    titulo: titulo.slice(0, 120),
    descricao: d.descricao.trim().slice(0, 300) || null,
    capa_url: d.capa_url.trim() || null,
    contador: d.contador.trim().slice(0, 40) || null,
    url_drive: url,
    plano_minimo: d.plano_minimo,
    ordem: Number.isFinite(d.ordem) ? Math.trunc(d.ordem) : 0,
    ativo: Boolean(d.ativo),
    em_breve: Boolean(d.em_breve),
    bloqueado: Boolean(d.bloqueado),
    checkout_url: checkout || null,
    preco: d.preco.trim().slice(0, 30) || null,
    so_basico: Boolean(d.so_basico),
    destaque: Boolean(d.destaque),
    // IDs da GGCheckout: só letras e números, separados por vírgula.
    produtos_ggcheckout:
      d.produtos_ggcheckout
        .split(/[\s,]+/)
        .map((id) => id.replace(/[^A-Za-z0-9_-]/g, ""))
        .filter(Boolean)
        .join(",") || null,
  };

  const admin = createAdminClient();
  const consulta = d.id
    ? admin.from("modulos").update(registro).eq("id", d.id).select("id").single()
    : admin.from("modulos").insert(registro).select("id").single();
  const { data, error } = await consulta;

  if (error || !data) {
    console.error("[admin] salvar módulo", error?.message);
    return { ok: false, mensagem: "Não conseguimos salvar. Confira os campos e tente de novo." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, id: data.id };
}

/** URL assinada para o navegador subir a capa direto no Storage, sem passar pelo servidor. */
export async function gerarUploadCapa(nomeArquivo: string) {
  await exigirAdmin();

  const ext = nomeArquivo.split(".").pop()?.toLowerCase() ?? "";
  if (!EXTENSOES.has(ext)) return { ok: false as const, mensagem: "Use uma imagem JPG, PNG ou WebP." };

  const caminho = `${randomUUID()}.${ext}`;
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(caminho);
  if (error || !data) {
    console.error("[admin] upload capa", error?.message);
    return { ok: false as const, mensagem: "Não conseguimos preparar o envio da imagem." };
  }

  const publica = admin.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl;
  return { ok: true as const, caminho, token: data.token, urlPublica: publica };
}
