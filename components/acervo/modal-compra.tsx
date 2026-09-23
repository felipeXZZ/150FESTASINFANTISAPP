"use client";

import type { Ref } from "react";
import { ArrowRight, ImageOff, Lock, X } from "lucide-react";
import { CHECKOUT_UPGRADE_URL } from "@/lib/config";
import { urlImagem } from "@/lib/imagem";
import { precoLegivel, type Modulo } from "@/lib/tipos";

type Props = { ref: Ref<HTMLDialogElement>; modulo: Modulo | null };

/** Popup de pagamento de um módulo vendido à parte (opção "Bloqueado" do admin). */
export function ModalCompra({ ref, modulo }: Props) {
  const capa = urlImagem(modulo?.capa_url, 640);
  const checkout = modulo?.checkout_url || CHECKOUT_UPGRADE_URL;

  return (
    <dialog
      ref={ref}
      aria-labelledby="titulo-compra"
      // Toque fora do conteúdo fecha o popup.
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="popup m-auto max-h-[88dvh] w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-3xl bg-papel p-0 text-tinta shadow-2xl backdrop:bg-marinho/80 backdrop:backdrop-blur-[2px]"
    >
      {modulo && (
        <div className="relative max-h-[88dvh] overflow-y-auto">
          <form method="dialog" className="absolute top-3 right-3 z-10">
            <button
              type="submit"
              aria-label="Fechar"
              className="grid size-11 place-items-center rounded-full bg-white/90 text-tinta shadow-sm active:bg-linha"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </form>

          <div className="relative aspect-video bg-marinho">
            {capa ? (
              <img src={capa} alt="" className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center text-white/40">
                <ImageOff className="size-8" aria-hidden="true" />
              </div>
            )}
            {modulo.contador && (
              <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-tinta shadow-sm">
                {modulo.contador}
              </span>
            )}
          </div>

          <div className="px-5 pt-4 pb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ouro px-3 py-1 text-xs font-semibold text-tinta">
              <Lock className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
              Material à parte
            </span>
            <h2 id="titulo-compra" className="mt-2.5 font-titulo text-[1.45rem] leading-tight">
              {modulo.titulo}
            </h2>
            {modulo.descricao && <p className="mt-1.5 text-tinta-suave">{modulo.descricao}</p>}

            {modulo.preco && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-ouro/50 bg-ouro-claro px-4 py-2.5">
                <span className="text-sm leading-tight text-tinta-suave">
                  Pagamento único
                  <span className="block font-semibold text-tinta">sem mensalidade</span>
                </span>
                <span className="font-titulo text-3xl leading-none text-tinta">{precoLegivel(modulo.preco)}</span>
              </div>
            )}

            {checkout ? (
              <a
                href={checkout}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-verde text-base font-semibold text-white shadow-[0_10px_24px_-10px_rgba(34,180,85,0.9)] active:bg-verde-compra-escuro"
              >
                Quero esse material
                <ArrowRight className="size-5" aria-hidden="true" />
              </a>
            ) : (
              <p className="mt-4 text-center text-sm text-tinta-suave">Disponível em breve.</p>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
