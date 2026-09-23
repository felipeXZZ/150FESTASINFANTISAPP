"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, LayoutGrid, Lock, UserRound } from "lucide-react";
import { registrarEvento } from "@/app/(app)/acervo-actions";
import { ModalBiblioteca } from "@/components/biblioteca/modal-biblioteca";

const ABA =
  "flex h-full w-full flex-col items-center justify-center gap-1 text-xs transition-colors duration-200 active:scale-95";
const cor = (ativa: boolean) => (ativa ? "font-semibold text-azul" : "text-tinta/60");
// Ícone da aba ativa cresce um pouco; a troca é animada.
const icone = (ativa: boolean) =>
  `size-6 transition-transform duration-300 ease-out ${ativa ? "scale-110" : "scale-100"}`;

export function BarraNavegacao() {
  const pathname = usePathname();
  const modalRef = useRef<HTMLDialogElement>(null);
  // Posição do indicador azul que desliza até a aba ativa.
  const indice = pathname === "/" ? 0 : pathname.startsWith("/calculadora") ? 1 : pathname.startsWith("/conta") ? 2 : -1;

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
        <div className="relative mx-auto max-w-md">
          <span
            aria-hidden="true"
            className={`absolute top-0 left-0 flex h-[3px] w-1/3 justify-center transition-[transform,opacity] duration-300 ease-out ${
              indice === -1 ? "opacity-0" : "opacity-100"
            }`}
            style={{ transform: `translateX(${Math.max(indice, 0) * 100}%)` }}
          >
            <span className="h-full w-10 rounded-b-full bg-azul" />
          </span>
          <ul className="grid h-16 grid-cols-3">
            <li>
              <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={`${ABA} ${cor(pathname === "/")}`}>
                <LayoutGrid className={icone(pathname === "/")} strokeWidth={pathname === "/" ? 2.25 : 1.75} aria-hidden="true" />
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
                <span className="relative">
                  <Calculator className={icone(pathname.startsWith("/calculadora"))} strokeWidth={1.75} aria-hidden="true" />
                  {/* Selo de lançamento: pulsa de leve para chamar atenção. */}
                  <span className="absolute -top-2 left-1/2 ml-1.5 flex">
                    <span
                      aria-hidden="true"
                      className="selo-novo-brilho absolute inset-0 rounded-full bg-verde"
                    />
                    <span className="relative rounded-full bg-verde px-1.5 py-px text-[9px] leading-[14px] font-bold text-white shadow-sm ring-2 ring-white">
                      Novo
                    </span>
                  </span>
                </span>
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
                <UserRound
                  className={icone(pathname.startsWith("/conta"))}
                  strokeWidth={pathname.startsWith("/conta") ? 2.25 : 1.75}
                  aria-hidden="true"
                />
                Conta
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <ModalBiblioteca ref={modalRef} />
    </>
  );
}
