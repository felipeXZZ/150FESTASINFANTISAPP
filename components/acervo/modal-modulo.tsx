"use client";

import type { CSSProperties, Ref } from "react";
import { CircleCheck, Download, ExternalLink, ImageOff, X } from "lucide-react";
import { linkDownloadDrive } from "@/lib/drive";
import { srcSetImagem, urlImagem } from "@/lib/imagem";
import type { Modulo } from "@/lib/tipos";

type Props = { ref: Ref<HTMLDialogElement>; modulo: Modulo | null; aoAbrir: (modulo: Modulo) => void };

/** Popup de um módulo liberado: baixar o arquivo direto ou abrir no Google Drive. */
export function ModalModulo({ ref, modulo, aoAbrir }: Props) {
  const capa = urlImagem(modulo?.capa_url, 640);
  const download = linkDownloadDrive(modulo?.url_drive);

  return (
    <dialog
      ref={ref}
      aria-labelledby="titulo-modulo"
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
              <img
                src={capa}
                srcSet={srcSetImagem(modulo.capa_url, [400, 640, 960])}
                sizes="384px"
                alt=""
                className="size-full object-cover"
              />
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
            <span className="entra inline-flex items-center gap-1.5 rounded-full bg-verde-escuro/10 px-3 py-1 text-xs font-semibold text-verde-escuro">
              <CircleCheck className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
              Já é seu
            </span>
            <h2 id="titulo-modulo" className="entra mt-2.5 font-titulo text-[1.45rem] leading-tight">
              {modulo.titulo}
            </h2>
            {modulo.descricao && <p className="entra mt-1.5 text-tinta-suave">{modulo.descricao}</p>}

            <div style={{ "--atraso": "120ms" } as CSSProperties} className="entra mt-5 flex flex-col gap-2.5">
              {download && (
                <a
                  href={download}
                  onClick={() => aoAbrir(modulo)}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-azul text-base font-semibold text-white shadow-[0_10px_24px_-10px_rgba(29,78,216,0.9)] active:bg-azul-escuro"
                >
                  <Download className="size-5" aria-hidden="true" />
                  Baixar no aparelho
                </a>
              )}
              <a
                href={modulo.url_drive}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => aoAbrir(modulo)}
                className={
                  download
                    ? "flex h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-azul bg-white text-base font-semibold text-azul active:bg-linha"
                    : "flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-azul text-base font-semibold text-white shadow-[0_10px_24px_-10px_rgba(29,78,216,0.9)] active:bg-azul-escuro"
                }
              >
                <ExternalLink className="size-5" aria-hidden="true" />
                {download ? "Abrir no Google Drive" : "Abrir material"}
              </a>
            </div>

            {download && (
              <p style={{ "--atraso": "200ms" } as CSSProperties} className="entra mt-3 text-center text-sm text-tinta-suave">
                Baixando, o arquivo fica salvo no aparelho. No Drive, você vê sem ocupar espaço.
              </p>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
