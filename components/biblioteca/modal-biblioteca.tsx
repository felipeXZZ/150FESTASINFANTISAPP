"use client";

import type { Ref } from "react";
import { X } from "lucide-react";
import { OfertaBiblioteca } from "./oferta-biblioteca";

type Props = { ref: Ref<HTMLDialogElement> };

/** Popup da aba Calculadora: fundo escuro, oferta da Biblioteca e botão do checkout. */
export function ModalBiblioteca({ ref }: Props) {
  return (
    <dialog
      ref={ref}
      aria-labelledby="titulo-biblioteca"
      // Toque fora do conteúdo fecha o popup.
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="popup m-auto max-h-[88dvh] w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-3xl bg-papel p-0 text-tinta shadow-2xl backdrop:bg-marinho/80 backdrop:backdrop-blur-[2px]"
    >
      <div className="relative max-h-[88dvh] overflow-y-auto bg-papel">
        <form method="dialog" className="absolute top-3 right-3 z-10">
          <button
            type="submit"
            aria-label="Fechar"
            className="grid size-11 place-items-center rounded-full bg-white/15 text-white active:bg-white/25"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </form>
        <OfertaBiblioteca tituloId="titulo-biblioteca" />
      </div>
    </dialog>
  );
}
