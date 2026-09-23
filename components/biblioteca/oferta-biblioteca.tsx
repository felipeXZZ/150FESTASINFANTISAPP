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
      <header className="relative overflow-hidden bg-marinho px-5 pt-5 pb-12 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full bg-azul/50 blur-3xl"
        />
        <div className="relative pr-10">
          <span className="inline-flex rounded-full bg-ouro px-3 py-1 text-xs font-semibold text-tinta">
            Biblioteca Visual da Decoradora
          </span>
          <h2 id={tituloId} className="mt-2.5 font-titulo text-[1.45rem] leading-tight">
            Calculadora de preço de festa
          </h2>
          <p className="mt-1.5 text-sm text-azul-claro/90">
            Faz parte da Biblioteca Visual: o preço certo de cada festa, com margem e taxas já
            embutidas.
          </p>
        </div>
      </header>

      {/* Imagem da Biblioteca Visual: caixa, calculadora, orçamento e WhatsApp. */}
      <div className="relative -mt-9 px-5">
        <img
          src="/biblioteca-visual-800.webp"
          srcSet="/biblioteca-visual-480.webp 480w, /biblioteca-visual-800.webp 800w"
          sizes="(min-width: 640px) 344px, calc(100vw - 40px)"
          width={800}
          height={600}
          alt="Biblioteca Visual da Decoradora de Festas: 300 projetos, calculadora de preço, orçamento e scripts de WhatsApp"
          className="aspect-video w-full rounded-2xl border border-white/60 object-cover shadow-[0_14px_30px_-14px_rgba(11,30,91,0.55)]"
        />
      </div>

      <div className="px-5 pt-4">
        <p className="mb-2 text-xs font-semibold text-tinta-suave">O que vem na Biblioteca</p>
        <ul className="grid grid-cols-2 gap-2">
          {ITENS.map(({ Icone, texto }, i) => {
            const destaque = i === 0;
            return (
              <li
                key={texto}
                className={`flex min-h-11 items-center gap-2.5 rounded-xl border px-2.5 py-1.5 ${
                  destaque ? "border-azul bg-azul text-white" : "border-linha bg-white"
                }`}
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                    destaque ? "bg-white/15 text-white" : "bg-azul-claro text-azul"
                  }`}
                >
                  <Icone className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="text-[13px] leading-tight font-semibold">
                  {texto}
                  {destaque && <span className="block text-[11px] font-normal text-azul-claro">inclusa</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sticky bottom-0 bg-gradient-to-t from-papel from-80% to-transparent px-5 pt-4 pb-4">
        {PRECO_BIBLIOTECA && (
          <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-ouro/50 bg-ouro-claro px-4 py-2.5">
            <span className="text-sm leading-tight text-tinta-suave">
              Pagamento único
              <span className="block font-semibold text-tinta">sem mensalidade</span>
            </span>
            <span className="font-titulo text-3xl leading-none text-tinta">{PRECO_BIBLIOTECA}</span>
          </div>
        )}
        {checkout && (
          <a
            href={checkout}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void registrarEvento("clicou_biblioteca", "checkout")}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-verde text-base font-semibold text-white shadow-[0_10px_24px_-10px_rgba(34,180,85,0.9)] active:bg-verde-compra-escuro"
          >
            Quero a Biblioteca Visual
            <ArrowRight className="size-5" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}
