"use client";

import { useRef } from "react";
import { registrarEvento } from "@/app/(app)/acervo-actions";
import { TEXTO_BOTAO_UPGRADE } from "@/lib/config";
import { ModalUpgrade } from "./modal-upgrade";

/** Botão do card de upgrade da Conta: abre o mesmo popup dos cards com cadeado. */
export function BotaoUpgrade({ className = "" }: { className?: string }) {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          void registrarEvento("viu_bloqueado", "conta");
          modalRef.current?.showModal();
        }}
        className={className}
      >
        {TEXTO_BOTAO_UPGRADE}
      </button>
      <ModalUpgrade ref={modalRef} />
    </>
  );
}
