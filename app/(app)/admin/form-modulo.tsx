"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ImagePlus, Loader2 } from "lucide-react";
import { urlImagem } from "@/lib/imagem";
import { createClient } from "@/lib/supabase/client";
import { gerarUploadCapa, salvarModulo, type DadosModulo } from "./actions";

type ModuloBanco = {
  id: string;
  titulo: string;
  descricao: string | null;
  capa_url: string | null;
  contador: string | null;
  url_drive: string;
  plano_minimo: string;
  ordem: number | null;
  ativo: boolean | null;
  em_breve: boolean | null;
  bloqueado?: boolean | null;
  checkout_url?: string | null;
  preco?: string | null;
  so_basico?: boolean | null;
  destaque?: boolean | null;
  produtos_ggcheckout?: string | null;
};

const INPUT =
  "h-12 w-full rounded-xl border border-linha bg-white px-3 text-base placeholder:text-tinta/35 focus:border-azul focus:outline-none";

export function FormModulo({ modulo }: { modulo?: ModuloBanco }) {
  const router = useRouter();
  const [dados, setDados] = useState<DadosModulo>({
    id: modulo?.id,
    titulo: modulo?.titulo ?? "",
    descricao: modulo?.descricao ?? "",
    capa_url: modulo?.capa_url ?? "",
    contador: modulo?.contador ?? "",
    url_drive: modulo?.url_drive ?? "",
    plano_minimo: modulo?.plano_minimo ?? "basico",
    ordem: modulo?.ordem ?? 0,
    ativo: modulo?.ativo ?? true,
    em_breve: modulo?.em_breve ?? false,
    bloqueado: modulo?.bloqueado ?? false,
    checkout_url: modulo?.checkout_url ?? "",
    preco: modulo?.preco ?? "",
    so_basico: modulo?.so_basico ?? false,
    destaque: modulo?.destaque ?? false,
    produtos_ggcheckout: modulo?.produtos_ggcheckout ?? "",
  });
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [previa, setPrevia] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, iniciar] = useTransition();

  const mudar = (parcial: Partial<DadosModulo>) => setDados((d) => ({ ...d, ...parcial }));
  const capaAtual = previa ?? urlImagem(dados.capa_url, 640);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    iniciar(async () => {
      let capa_url = dados.capa_url;

      if (arquivo) {
        const upload = await gerarUploadCapa(arquivo.name);
        if (!upload.ok) return setErro(upload.mensagem);
        const { error } = await createClient()
          .storage.from("capas")
          .uploadToSignedUrl(upload.caminho, upload.token, arquivo, { contentType: arquivo.type });
        if (error) return setErro(`Falha no envio da imagem: ${error.message}`);
        capa_url = upload.urlPublica;
      }

      const resposta = await salvarModulo({ ...dados, capa_url });
      if (!resposta.ok) return setErro(resposta.mensagem);
      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <form onSubmit={enviar} className="mx-auto max-w-xl space-y-4">
      <Link href="/admin" className="-ml-2 inline-flex h-11 items-center gap-1 pr-3 text-sm font-semibold text-tinta/70">
        <ChevronLeft className="size-5" aria-hidden="true" />
        Módulos
      </Link>
      <h1 className="font-titulo text-2xl">{modulo ? "Editar módulo" : "Novo módulo"}</h1>

      <div>
        <span className="mb-1 block text-sm font-semibold">Capa (16:9)</span>
        <label className="relative grid aspect-video cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-linha bg-white">
          {capaAtual ? (
            <img src={capaAtual} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-2 text-sm text-tinta/60">
              <ImagePlus className="size-8" aria-hidden="true" />
              Escolher imagem
            </span>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              if (f && f.size > 5 * 1024 * 1024) {
                setErro("Imagem acima de 5 MB. Reduza antes de enviar.");
                return;
              }
              setArquivo(f);
              setPrevia(f ? URL.createObjectURL(f) : null);
            }}
          />
        </label>
        {capaAtual && <p className="mt-1 text-sm text-tinta/60">Toque na imagem para trocar.</p>}
      </div>

      <Campo rotulo="Título">
        <input required maxLength={120} className={INPUT} value={dados.titulo} onChange={(e) => mudar({ titulo: e.target.value })} />
      </Campo>
      <Campo rotulo="Descrição (uma linha)">
        <input maxLength={300} className={INPUT} value={dados.descricao} onChange={(e) => mudar({ descricao: e.target.value })} />
      </Campo>
      <Campo rotulo="Contador">
        <input
          maxLength={40}
          placeholder="150 projetos"
          className={INPUT}
          value={dados.contador}
          onChange={(e) => mudar({ contador: e.target.value })}
        />
      </Campo>
      <Campo rotulo={dados.em_breve ? "URL do Drive (opcional enquanto for em breve)" : "URL do Drive"}>
        <input
          required={!dados.em_breve}
          type="url"
          inputMode="url"
          placeholder="https://drive.google.com/..."
          className={INPUT}
          value={dados.url_drive}
          onChange={(e) => mudar({ url_drive: e.target.value })}
        />
      </Campo>

      <div className="grid grid-cols-2 gap-3">
        <Campo rotulo="Plano mínimo">
          <select className={INPUT} value={dados.plano_minimo} onChange={(e) => mudar({ plano_minimo: e.target.value })}>
            <option value="basico">Básico</option>
            <option value="completo">Pacote Completo</option>
          </select>
        </Campo>
        <Campo rotulo="Ordem">
          <input
            type="number"
            inputMode="numeric"
            className={INPUT}
            value={dados.ordem}
            onChange={(e) => mudar({ ordem: Number(e.target.value) || 0 })}
          />
        </Campo>
      </div>

      <label className="flex h-12 items-center gap-3 rounded-xl border border-linha bg-white px-3">
        <input
          type="checkbox"
          className="size-5 accent-azul"
          checked={dados.ativo}
          onChange={(e) => mudar({ ativo: e.target.checked })}
        />
        <span className="font-semibold">Ativo (aparece no acervo)</span>
      </label>

      <label className="flex min-h-12 items-center gap-3 rounded-xl border border-linha bg-white px-3 py-2">
        <input
          type="checkbox"
          className="size-5 accent-azul"
          checked={dados.em_breve}
          onChange={(e) => mudar({ em_breve: e.target.checked })}
        />
        <span>
          <span className="block font-semibold">Em breve</span>
          <span className="block text-sm text-tinta/60">Capa em preto e branco, selo “Em breve” e não abre.</span>
        </span>
      </label>

      <label className="flex min-h-12 items-center gap-3 rounded-xl border border-linha bg-white px-3 py-2">
        <input
          type="checkbox"
          className="size-5 accent-azul"
          checked={dados.so_basico}
          onChange={(e) => mudar({ so_basico: e.target.checked })}
        />
        <span>
          <span className="block font-semibold">Só para o Básico</span>
          <span className="block text-sm text-tinta/60">
            Some para quem tem o Pacote Completo. Use no que já está dentro do Completo, como as 50 festas.
          </span>
        </span>
      </label>

      <label className="flex min-h-12 items-center gap-3 rounded-xl border border-linha bg-white px-3 py-2">
        <input
          type="checkbox"
          className="size-5 accent-azul"
          checked={dados.destaque}
          onChange={(e) => mudar({ destaque: e.target.checked })}
        />
        <span>
          <span className="block font-semibold">Destaque especial</span>
          <span className="block text-sm text-tinta/60">
            Card colorido, com borda dourada e selo “Oferta especial”, na frente dos outros vendidos à parte.
          </span>
        </span>
      </label>

      <div className="rounded-xl border border-linha bg-white">
        <label className="flex min-h-12 items-center gap-3 px-3 py-2">
          <input
            type="checkbox"
            className="size-5 accent-azul"
            checked={dados.bloqueado}
            onChange={(e) => mudar({ bloqueado: e.target.checked })}
          />
          <span>
            <span className="block font-semibold">Bloqueado</span>
            <span className="block text-sm text-tinta/60">
              Vendido à parte: capa em preto e branco com cadeado e popup de pagamento, para qualquer plano.
            </span>
          </span>
        </label>

        {dados.bloqueado && (
          <div className="space-y-3 border-t border-linha px-3 pt-3 pb-3">
            <Campo rotulo="Link de pagamento">
              <input
                type="url"
                inputMode="url"
                placeholder="https://ggcheckout.app/checkout/..."
                className={INPUT}
                value={dados.checkout_url}
                onChange={(e) => mudar({ checkout_url: e.target.value })}
              />
            </Campo>
            <Campo rotulo="Preço mostrado no popup">
              <input
                maxLength={30}
                placeholder="R$ 9,90"
                className={INPUT}
                value={dados.preco}
                onChange={(e) => mudar({ preco: e.target.value })}
              />
            </Campo>
            <Campo rotulo="ID do produto na GGCheckout (não do checkout)">
              <input
                placeholder="Ex: 6jfVtbCkP0kG2phGqapy"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className={INPUT}
                value={dados.produtos_ggcheckout}
                onChange={(e) => mudar({ produtos_ggcheckout: e.target.value })}
              />
            </Campo>
            <p className="text-sm text-tinta/60">
              Com o ID, a compra aprovada libera este módulo sozinha para quem comprou (o
              produto precisa estar no webhook da GGCheckout). Mais de um ID: separe por
              vírgula. Sem link de pagamento, o botão usa o checkout do Pacote Completo.
            </p>
          </div>
        )}
      </div>

      {erro && (
        <p role="alert" className="rounded-lg bg-ouro-claro px-3 py-2 text-sm font-semibold">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={salvando}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-azul text-base font-semibold text-white active:bg-azul-escuro disabled:opacity-70"
      >
        {salvando && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
        Salvar módulo
      </button>
    </form>
  );
}

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{rotulo}</span>
      {children}
    </label>
  );
}
