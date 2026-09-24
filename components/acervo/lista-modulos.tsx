"use client";

import { useRef, useState } from "react";
import { Clock, FolderOpen, ImageOff, Lock, Sparkles } from "lucide-react";
import { registrarEvento } from "@/app/(app)/acervo-actions";
import { srcSetImagem, urlImagem } from "@/lib/imagem";
import { estadoModulo, precoLegivel, type EstadoModulo, type Modulo, type Plano, type TipoEvento } from "@/lib/tipos";
import { ModalCompra } from "./modal-compra";
import { ModalUpgrade } from "./modal-upgrade";

type Props = { modulos: Modulo[]; plano: Plano };

export function ListaModulos({ modulos, plano }: Props) {
  const upgradeRef = useRef<HTMLDialogElement>(null);
  const compraRef = useRef<HTMLDialogElement>(null);
  const [emCompra, setEmCompra] = useState<Modulo | null>(null);
  const doPlano = modulos.filter((m) => estadoModulo(m, plano) === "bloqueado_plano");

  function registrar(tipo: TipoEvento, ref: string) {
    // Dispara e segue: a navegação não espera o registro.
    void registrarEvento(tipo, ref);
  }

  function abrirBloqueado(modulo: Modulo, estado: EstadoModulo) {
    registrar("viu_bloqueado", modulo.id);
    if (estado === "bloqueado_venda") {
      setEmCompra(modulo);
      // O dialog precisa do módulo já renderizado antes de abrir.
      requestAnimationFrame(() => compraRef.current?.showModal());
    } else {
      upgradeRef.current?.showModal();
    }
  }

  if (modulos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-linha bg-white px-5 py-10 text-center">
        <FolderOpen className="mx-auto mb-3 size-8 text-tinta/40" aria-hidden="true" />
        <p className="text-tinta/70">Nenhum módulo por aqui ainda. Volte em breve.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modulos.map((modulo, i) => {
          const estado = estadoModulo(modulo, plano);
          const especial = modulo.destaque && estado === "bloqueado_venda";
          const conteudo = especial ? (
            <ConteudoEspecial modulo={modulo} prioridade={i < 2} />
          ) : (
            <ConteudoCard modulo={modulo} estado={estado} prioridade={i < 2} />
          );
          const classe = especial
            ? "block w-full overflow-hidden rounded-2xl border-2 border-ouro bg-ouro-claro text-left shadow-lg shadow-ouro/25 transition active:scale-[0.99]"
            : "block w-full overflow-hidden rounded-2xl border border-linha bg-white text-left transition active:scale-[0.99]";

          return (
            <li key={modulo.id} className={especial ? "sm:col-span-2 lg:col-span-3" : undefined}>
              {estado === "em_breve" ? (
                // Não abre nada: só mostra que vem mais conteúdo.
                <div className="block w-full overflow-hidden rounded-2xl border border-linha bg-white">
                  {conteudo}
                </div>
              ) : estado === "liberado" ? (
                <a
                  href={modulo.url_drive}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => registrar("abriu_modulo", modulo.id)}
                  className={classe}
                >
                  {conteudo}
                </a>
              ) : (
                <button type="button" onClick={() => abrirBloqueado(modulo, estado)} className={classe}>
                  {conteudo}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {doPlano.length > 0 && <ModalUpgrade ref={upgradeRef} bloqueados={doPlano} />}
      <ModalCompra ref={compraRef} modulo={emCompra} />
    </>
  );
}

/** Oferta em destaque: capa colorida, selo dourado e botão verde de compra. */
function ConteudoEspecial({ modulo, prioridade }: { modulo: Modulo; prioridade: boolean }) {
  const src = urlImagem(modulo.capa_url, 960);
  const preco = precoLegivel(modulo.preco);

  return (
    <div className="sm:flex">
      <div className="relative aspect-video bg-linha/60 sm:w-1/2 sm:shrink-0">
        {src ? (
          <img
            src={src}
            srcSet={srcSetImagem(modulo.capa_url, [400, 640, 960])}
            sizes="(min-width: 640px) 50vw, 100vw"
            alt=""
            loading={prioridade ? "eager" : "lazy"}
            decoding="async"
            className="size-full object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center text-tinta/30">
            <ImageOff className="size-8" aria-hidden="true" />
          </div>
        )}

        <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-ouro px-3 py-1.5 text-sm font-semibold text-tinta shadow-md">
          <Sparkles className="size-4" aria-hidden="true" />
          Oferta especial
        </span>
        {modulo.contador && (
          <span className="absolute right-3 bottom-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-tinta shadow-sm">
            {modulo.contador}
          </span>
        )}
      </div>

      <div className="flex flex-col justify-center gap-3 px-4 py-4 sm:px-5">
        <div>
          <h3 className="font-titulo text-lg leading-snug text-tinta">{modulo.titulo}</h3>
          {modulo.descricao && <p className="mt-1 text-sm text-tinta-suave">{modulo.descricao}</p>}
        </div>
        <span className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-verde px-4 text-base font-semibold text-white shadow-sm">
          <Lock className="size-4" strokeWidth={2.25} aria-hidden="true" />
          {preco ? `Quero por ${preco}` : "Quero essa oferta"}
        </span>
      </div>
    </div>
  );
}

function ConteudoCard({
  modulo,
  estado,
  prioridade,
}: {
  modulo: Modulo;
  estado: EstadoModulo;
  prioridade: boolean;
}) {
  const src = urlImagem(modulo.capa_url, 640);
  const liberado = estado === "liberado";
  const comCadeado = estado === "bloqueado_plano" || estado === "bloqueado_venda";

  return (
    <>
      <div className="relative aspect-video bg-linha/60">
        {src ? (
          <img
            src={src}
            srcSet={srcSetImagem(modulo.capa_url, [400, 640, 960])}
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            alt=""
            loading={prioridade ? "eager" : "lazy"}
            decoding="async"
            className={`size-full object-cover ${liberado ? "" : "grayscale opacity-60"}`}
          />
        ) : (
          <div className="grid size-full place-items-center text-tinta/30">
            <ImageOff className="size-8" aria-hidden="true" />
          </div>
        )}

        {modulo.contador && (
          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-tinta shadow-sm">
            {modulo.contador}
          </span>
        )}

        {estado === "em_breve" && (
          <div className="absolute inset-0 grid place-items-center">
            <span className="flex items-center gap-1.5 rounded-full bg-tinta px-3.5 py-1.5 text-sm font-semibold text-white shadow-md">
              <Clock className="size-4" aria-hidden="true" />
              Em breve
            </span>
          </div>
        )}

        {comCadeado && (
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid size-14 place-items-center rounded-full bg-ouro text-tinta shadow-md">
              <Lock className="size-6" strokeWidth={2.25} aria-hidden="true" />
            </span>
          </div>
        )}
      </div>

      <div className="px-4 py-3">
        <h3 className={`truncate font-semibold ${liberado ? "" : "text-tinta/60"}`}>{modulo.titulo}</h3>
        {estado === "em_breve" ? (
          <p className="truncate text-sm text-tinta/60">{modulo.descricao || "Chega em breve na sua coleção"}</p>
        ) : liberado ? (
          modulo.descricao && <p className="truncate text-sm text-tinta/70">{modulo.descricao}</p>
        ) : estado === "bloqueado_venda" ? (
          <p className="truncate text-sm font-semibold text-azul">
            {modulo.preco ? `Toque para adquirir por ${precoLegivel(modulo.preco)}` : "Toque para adquirir"}
          </p>
        ) : (
          <p className="truncate text-sm font-semibold text-azul">Disponível no Pacote Completo</p>
        )}
      </div>
    </>
  );
}
