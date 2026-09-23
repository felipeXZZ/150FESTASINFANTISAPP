import { ChevronRight, MessageCircleHeart } from "lucide-react";
import { IconeInstagram } from "@/components/icone-instagram";
import { IconeWhatsapp } from "@/components/icone-whatsapp";
import { arrobaInstagram, INSTAGRAM_URL, linkWhatsapp, WHATSAPP_NUMERO, whatsappLegivel } from "@/lib/config";

const MENSAGEM = "Olá! Não estou conseguindo entrar no 150 Festas Infantis.";

/** Saída para quem travou na entrada: ninguém fica sem falar com a gente. */
export function CanaisAjuda() {
  if (!WHATSAPP_NUMERO && !INSTAGRAM_URL) return null;

  return (
    <section className="mt-5 rounded-3xl border border-linha bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ouro-claro text-ouro">
          <MessageCircleHeart className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold">Com dificuldade para entrar?</h2>
          <p className="mt-0.5 text-sm text-tinta-suave">
            Chama a gente por aqui que a gente resolve o seu acesso.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {WHATSAPP_NUMERO && (
          <a
            href={linkWhatsapp(MENSAGEM)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center gap-3 rounded-2xl bg-verde px-4 text-white shadow-[0_8px_20px_-10px_rgba(34,180,85,0.8)] active:bg-verde-compra-escuro"
          >
            <IconeWhatsapp className="size-6 shrink-0" />
            <span className="flex-1 leading-tight">
              <span className="block text-sm font-semibold">Falar no WhatsApp</span>
              <span className="block text-xs text-white/85">{whatsappLegivel()}</span>
            </span>
            <ChevronRight className="size-5 shrink-0" aria-hidden="true" />
          </a>
        )}

        {INSTAGRAM_URL && (
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center gap-3 rounded-2xl border border-linha px-4 text-tinta active:bg-papel"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white">
              <IconeInstagram className="size-5" />
            </span>
            <span className="flex-1 leading-tight">
              <span className="block text-sm font-semibold">Chamar no Instagram</span>
              <span className="block text-xs text-tinta-suave">{arrobaInstagram()}</span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-tinta/40" aria-hidden="true" />
          </a>
        )}
      </div>
    </section>
  );
}
