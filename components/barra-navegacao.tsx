"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, LayoutGrid, Lock, UserRound } from "lucide-react";
import { registrarEvento } from "@/app/(app)/acervo-actions";
import { ModalBiblioteca } from "@/components/biblioteca/modal-biblioteca";

const ABA =
  "flex h-full w-full flex-col items-center justify-center gap-1 text-xs";
const cor = (ativa: boolean) => (ativa ? "font-semibold text-azul" : "text-tinta/60");

export function BarraNavegacao() {
  const pathname = usePathname();
  const modalRef = useRef<HTMLDialogElement>(null);

  function abrirCalculadora() {
    void registrarEvento("viu_calculadora");
    modalRef.current?.showModal();
  }

  return (
    <>
      <nav
        aria-label="Navegação principal"
        className="pb-seguro fixed inset-x-0 bottom-0 z-30 border-t border-linha bg-white"
      >
        <ul className="mx-auto grid h-16 max-w-md grid-cols-3">
          <li>
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={`${ABA} ${cor(pathname === "/")}`}>
              <LayoutGrid className="size-6" strokeWidth={pathname === "/" ? 2.25 : 1.75} aria-hidden="true" />
              Minhas festas
            </Link>
          </li>

          {/* A Calculadora é da Biblioteca Visual, outro produto: abre um popup com a
              oferta. Na barra leva só um cadeado pequeno, nunca "bloqueada" escrito. */}
          <li>
            <button
              type="button"
              onClick={abrirCalculadora}
              aria-haspopup="dialog"
              className={`${ABA} ${cor(pathname.startsWith("/calculadora"))}`}
            >
              <Calculator className="size-6" strokeWidth={1.75} aria-hidden="true" />
              <span className="flex items-center gap-1">
                Calculadora
                <Lock className="size-3 text-ouro" strokeWidth={2.5} aria-hidden="true" />
              </span>
            </button>
          </li>

          <li>
            <Link
              href="/conta"
              aria-current={pathname.startsWith("/conta") ? "page" : undefined}
              className={`${ABA} ${cor(pathname.startsWith("/conta"))}`}
            >
              <UserRound className="size-6" strokeWidth={pathname.startsWith("/conta") ? 2.25 : 1.75} aria-hidden="true" />
              Conta
            </Link>
          </li>
        </ul>
      </nav>

      <ModalBiblioteca ref={modalRef} />
    </>
  );
}
