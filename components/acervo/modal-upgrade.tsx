"use client";

import type { Ref } from "react";
import { Lock, X } from "lucide-react";
import { CHECKOUT_UPGRADE_URL, TEXTO_BOTAO_UPGRADE } from "@/lib/config";
import type { Modulo } from "@/lib/tipos";

type Props = { ref: Ref<HTMLDialogElement>; bloqueados: Modulo[] };

export function ModalUpgrade({ ref, bloqueados }: Props) {
  return (
    <dialog
      ref={ref}
      aria-labelledby="titulo-upgrade"
      // Toque fora do conteúdo fecha o modal.
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-0 mt-auto max-h-[85dvh] w-full max-w-none rounded-t-3xl bg-papel p-0 text-tinta backdrop:bg-marinho/80 backdrop:backdrop-blur-[2px] sm:m-auto sm:max-w-md sm:rounded-3xl"
    >
      <div className="pb-seguro flex max-h-[85dvh] flex-col">
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <h2 id="titulo-upgrade" className="font-titulo text-2xl leading-tight">
            Tenha também os bônus
          </h2>
          <form method="dialog">
            <button
              type="submit"
              aria-label="Fechar"
              className="-mt-1 -mr-2 grid size-11 place-items-center rounded-full text-tinta/60 active:bg-linha"
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          </form>
        </div>

        <p className="px-5 pt-1 text-tinta/70">
          No Pacote Completo você recebe estes materiais para sempre, com pagamento único:
        </p>

        <ul className="mt-4 flex-1 divide-y divide-linha overflow-y-auto border-y border-linha bg-white px-5">
          {bloqueados.map((m) => (
            <li key={m.id} className="flex items-center gap-3 py-3">
              <Lock className="size-4 shrink-0 text-ouro" strokeWidth={2.5} aria-hidden="true" />
              <span className="flex-1 truncate font-semibold">{m.titulo}</span>
              {m.contador && <span className="shrink-0 text-sm text-tinta/60">{m.contador}</span>}
            </li>
          ))}
        </ul>

        <div className="p-5">
          <a
            href={CHECKOUT_UPGRADE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 w-full items-center justify-center rounded-xl bg-verde px-4 text-center text-base font-semibold text-white active:bg-verde-compra-escuro"
          >
            {TEXTO_BOTAO_UPGRADE}
          </a>
        </div>
      </div>
    </dialog>
  );
}
