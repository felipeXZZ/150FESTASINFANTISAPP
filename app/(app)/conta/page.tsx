import Link from "next/link";
import { ChevronRight, LogOut, Settings, Sparkles } from "lucide-react";
import { IconeInstagram } from "@/components/icone-instagram";
import { IconeWhatsapp } from "@/components/icone-whatsapp";
import { ehAdmin } from "@/lib/admin";
import {
  arrobaInstagram,
  CHECKOUT_UPGRADE_URL,
  INSTAGRAM_URL,
  linkWhatsapp,
  TEXTO_BOTAO_UPGRADE,
} from "@/lib/config";
import { exigirSessao } from "@/lib/sessao";

export const metadata = { title: "Conta — 150 Festas Infantis" };

const NOME_PLANO = {
  basico: "Pacote Básico — acesso vitalício",
  completo: "Pacote Completo — acesso vitalício",
} as const;

export default async function ContaPage() {
  const sessao = await exigirSessao();

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <h1 className="font-titulo text-2xl">Conta</h1>

      <dl className="divide-y divide-linha rounded-2xl border border-linha bg-white px-4">
        <div className="py-3">
          <dt className="text-sm text-tinta/60">E-mail</dt>
          <dd className="font-semibold break-all">{sessao.email}</dd>
        </div>
        <div className="py-3">
          <dt className="text-sm text-tinta/60">Plano</dt>
          <dd className="font-semibold">{NOME_PLANO[sessao.plano]}</dd>
        </div>
      </dl>

      {sessao.plano === "basico" && (
        <section className="rounded-2xl border border-ouro/60 bg-ouro-claro p-4">
          <h2 className="flex items-center gap-2 font-titulo text-xl">
            <Sparkles className="size-5 text-ouro" aria-hidden="true" />
            Tenha o Pacote Completo
          </h2>
          <p className="mt-1 text-tinta/80">
            As 150 festas mais os 5 bônus: manual de montagem, checklist de compras, guia de
            balões, cronograma e lembrancinhas. Pagamento único.
          </p>
          <a
            href={CHECKOUT_UPGRADE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex min-h-14 items-center justify-center rounded-xl bg-verde px-4 text-center text-base font-semibold text-white active:bg-verde-compra-escuro"
          >
            {TEXTO_BOTAO_UPGRADE}
          </a>
        </section>
      )}

      {INSTAGRAM_URL && (
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-linha bg-white p-4 transition active:scale-[0.99] active:bg-papel"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-sm">
            <IconeInstagram className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Siga a gente no Instagram</span>
            <span className="block text-sm leading-snug text-tinta-suave">
              Acompanhe as novidades ou mande uma mensagem para tirar suas dúvidas.
            </span>
            <span className="mt-0.5 block truncate text-sm font-semibold text-azul">{arrobaInstagram()}</span>
          </span>
          <ChevronRight className="size-5 shrink-0 text-tinta/40" aria-hidden="true" />
        </a>
      )}

      <div className="grid gap-2">
        <a
          href={linkWhatsapp()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center gap-2 rounded-xl bg-verde-escuro text-base font-semibold text-white"
        >
          <IconeWhatsapp className="size-5" />
          Falar com o suporte
        </a>

        <form action="/sair" method="post">
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-linha bg-white font-semibold"
          >
            <LogOut className="size-5" aria-hidden="true" />
            Sair
          </button>
        </form>
      </div>

      {ehAdmin(sessao.email) && (
        <Link
          href="/admin"
          className="flex h-12 items-center gap-3 rounded-xl border border-dashed border-linha px-4 text-sm font-semibold text-tinta/70"
        >
          <Settings className="size-5" aria-hidden="true" />
          <span className="flex-1">Administrar módulos</span>
          <ChevronRight className="size-5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
