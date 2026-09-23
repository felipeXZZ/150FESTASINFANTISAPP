"use client";

import type { Ref } from "react";
import {
  ArrowRight,
  CalendarClock,
  Gift,
  LayoutGrid,
  ListChecks,
  PartyPopper,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { CHECKOUT_UPGRADE_URL, PRECO_UPGRADE } from "@/lib/config";
import type { Modulo } from "@/lib/tipos";

type Props = { ref: Ref<HTMLDialogElement>; bloqueados: Modulo[] };

// O que o Pacote Completo acrescenta ao Básico: as festas que faltam e os 5 bônus.
// A primeira vem em destaque, como a calculadora no popup da Biblioteca.
const ITENS: { Icone: LucideIcon; texto: string }[] = [
  { Icone: LayoutGrid, texto: "+100 festas prontas" },
  { Icone: Wrench, texto: "Manual de montagem" },
  { Icone: ListChecks, texto: "Checklist de compras" },
  { Icone: PartyPopper, texto: "Guia de balões" },
  { Icone: CalendarClock, texto: "Cronograma da festa" },
  { Icone: Gift, texto: "50 lembrancinhas" },
];

/** Popup de upgrade (Básico → Pacote Completo), no mesmo estilo do da Biblioteca. */
export function ModalUpgrade({ ref, bloqueados }: Props) {
  return (
    <dialog
      ref={ref}
      aria-labelledby="titulo-upgrade"
      // Toque fora do conteúdo fecha o popup.
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="popup m-auto max-h-[88dvh] w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-3xl bg-papel p-0 text-tinta shadow-2xl backdrop:bg-marinho/80 backdrop:backdrop-blur-[2px]"
    >
      <div className="relative max-h-[88dvh] overflow-y-auto">
        <form method="dialog" className="absolute top-3 right-3 z-10">
          <button
            type="submit"
            aria-label="Fechar"
            className="grid size-11 place-items-center rounded-full bg-white/15 text-white active:bg-white/25"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </form>

        <header className="relative overflow-hidden bg-marinho px-5 pt-5 pb-24 text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full bg-azul/50 blur-3xl"
          />
          <div className="relative pr-12">
            <span className="inline-flex rounded-full bg-ouro px-2.5 py-0.5 text-[11px] font-semibold text-tinta">
              Pacote Completo
            </span>
            <h2 id="titulo-upgrade" className="mt-2 font-titulo text-[1.35rem] leading-tight">
              Tenha as 150 festas e os 5 bônus
            </h2>
            <p className="mt-1 text-[13px] leading-snug text-azul-claro/90">
              Complete a sua coleção e monte qualquer festa, do começo ao fim.
            </p>
          </div>
        </header>

        {/* Capa do guia com os 5 bônus: fundo transparente, sai do topo marinho. */}
        <div className="relative -mt-24 px-8">
          <img
            src="/pacote-completo-800.webp"
            srcSet="/pacote-completo-480.webp 480w, /pacote-completo-800.webp 800w"
            sizes="(min-width: 640px) 320px, calc(100vw - 64px)"
            width={800}
            height={800}
            alt="Guia +150 Festas Infantis Prontas com os 5 bônus"
            className="entra mx-auto aspect-[5/4] w-full object-contain drop-shadow-[0_18px_24px_rgba(11,30,91,0.35)]"
          />
        </div>

        <ul className="grid grid-cols-3 gap-2 px-5 pt-3">
          {ITENS.map(({ Icone, texto }, i) => {
            const destaque = i === 0;
            return (
              <li
                key={texto}
                style={{ "--atraso": `${120 + i * 45}ms` } as React.CSSProperties}
                className={`entra relative flex flex-col items-center gap-1.5 rounded-xl border px-1.5 pt-2.5 pb-2 text-center ${
                  destaque ? "border-azul bg-azul text-white" : "border-linha bg-white text-tinta"
                }`}
              >
                {destaque && (
                  <span className="absolute -top-2 rounded-full bg-ouro px-1.5 py-px text-[10px] font-semibold text-tinta">
                    a mais
                  </span>
                )}
                <span
                  className={`grid size-8 place-items-center rounded-lg ${
                    destaque ? "bg-white/15 text-white" : "bg-azul-claro text-azul"
                  }`}
                >
                  <Icone className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="text-[11.5px] leading-tight font-semibold">{texto}</span>
              </li>
            );
          })}
        </ul>

        {/* Outros módulos do Completo, além das 150 festas e dos bônus da lista fixa. */}
        {bloqueados.length > 2 && (
          <p className="px-5 pt-3 text-center text-xs text-tinta-suave">
            E também: {bloqueados.slice(2).map((m) => m.titulo).join(", ")}
          </p>
        )}

        <div
          style={{ "--atraso": "380ms" } as React.CSSProperties}
          className="entra sticky bottom-0 mt-1 bg-gradient-to-t from-papel from-85% to-transparent px-5 pt-4 pb-5"
        >
          {PRECO_UPGRADE && (
            <div className="mb-2.5 flex items-end justify-between gap-3 px-1">
              <span className="text-xs leading-tight text-tinta-suave">
                Pagamento único
                <span className="block">acesso vitalício</span>
              </span>
              <span className="font-titulo text-[1.75rem] leading-none text-tinta">{PRECO_UPGRADE}</span>
            </div>
          )}
          <a
            href={CHECKOUT_UPGRADE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-verde text-base font-semibold text-white shadow-[0_10px_24px_-10px_rgba(34,180,85,0.9)] active:bg-verde-compra-escuro"
          >
            Quero o Pacote Completo
            <ArrowRight className="size-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </dialog>
  );
}
