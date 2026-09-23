"use client";

import {
  ArrowRight,
  Calculator,
  FileSignature,
  FileText,
  LayoutGrid,
  MessageCircle,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { registrarEvento } from "@/app/(app)/acervo-actions";
import { linkCheckoutBiblioteca, PRECO_BIBLIOTECA } from "@/lib/config";

// Apresenta a Biblioteca Visual, que é outro produto, para outro público.
// Nunca escreva aqui "desbloquear", "liberar" ou "seu acesso" (CLAUDE.md, seção 8).

// A calculadora vem primeiro e em destaque: é o motivo de a oferta aparecer aqui.
const ITENS: { Icone: LucideIcon; texto: string }[] = [
  { Icone: Calculator, texto: "Calculadora de preço" },
  { Icone: LayoutGrid, texto: "300 projetos prontos" },
  { Icone: Tag, texto: "Preço sugerido" },
  { Icone: FileText, texto: "Orçamento em PDF" },
  { Icone: FileSignature, texto: "Contrato e recibo" },
  { Icone: MessageCircle, texto: "Scripts de WhatsApp" },
];

/** Conteúdo da oferta, usado no popup da barra e na página /calculadora. */
export function OfertaBiblioteca({ tituloId }: { tituloId?: string }) {
  const checkout = linkCheckoutBiblioteca();

  return (
    <div className="flex flex-col">
      <header className="relative overflow-hidden bg-marinho px-5 pt-5 pb-11 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full bg-azul/50 blur-3xl"
        />
        <div className="relative pr-12">
          <span className="inline-flex rounded-full bg-ouro px-2.5 py-0.5 text-[11px] font-semibold text-tinta">
            Biblioteca Visual da Decoradora
          </span>
          <h2 id={tituloId} className="mt-2 font-titulo text-[1.35rem] leading-tight">
            Calculadora de preço de festa
          </h2>
          <p className="mt-1 text-[13px] leading-snug text-azul-claro/90">
            O preço certo de cada festa, com margem e taxas já embutidas.
          </p>
        </div>
      </header>

      {/* Imagem da Biblioteca Visual: caixa, calculadora, orçamento e WhatsApp. */}
      <div className="relative -mt-8 px-5">
        <img
          src="/biblioteca-visual-800.webp"
          srcSet="/biblioteca-visual-480.webp 480w, /biblioteca-visual-800.webp 800w"
          sizes="(min-width: 640px) 344px, calc(100vw - 40px)"
          width={800}
          height={600}
          alt="Biblioteca Visual da Decoradora de Festas: 300 projetos, calculadora de preço, orçamento e scripts de WhatsApp"
          className="aspect-[2/1] w-full rounded-2xl border border-white/60 object-cover shadow-[0_14px_30px_-14px_rgba(11,30,91,0.55)]"
        />
      </div>

      <ul className="grid grid-cols-3 gap-2 px-5 pt-4">
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
                  inclusa
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

      <div style={{ "--atraso": "380ms" } as React.CSSProperties} className="entra sticky bottom-0 mt-1 bg-gradient-to-t from-papel from-85% to-transparent px-5 pt-4 pb-5">
        {/* A Biblioteca é assinatura: o preço sai sempre com "/mês". */}
        {PRECO_BIBLIOTECA && (
          <div className="mb-2.5 flex items-end justify-between gap-3 px-1">
            <span className="text-xs leading-tight text-tinta-suave">
              Assinatura mensal
              <span className="block">cobrança todo mês</span>
            </span>
            <span className="flex items-baseline gap-0.5 text-tinta">
              <span className="font-titulo text-[1.75rem] leading-none">{PRECO_BIBLIOTECA}</span>
              <span className="text-sm font-semibold text-tinta-suave">/mês</span>
            </span>
          </div>
        )}
        {checkout && (
          <a
            href={checkout}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void registrarEvento("clicou_biblioteca", "checkout")}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-verde text-base font-semibold text-white shadow-[0_10px_24px_-10px_rgba(34,180,85,0.9)] active:bg-verde-compra-escuro"
          >
            Quero a Biblioteca Visual
            <ArrowRight className="size-5" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}
