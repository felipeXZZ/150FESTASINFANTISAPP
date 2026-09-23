import { CanaisAjuda } from "@/components/canais-ajuda";
import { FormEntrada } from "./form-entrada";

export const metadata = { title: "Entrar — 150 Festas Infantis" };

export default function EntrarPage() {
  return (
    <main className="min-h-dvh lg:grid lg:grid-cols-2">
      {/* Faixa marinho com a capa do guia: ela reconhece na hora o que comprou. */}
      <section className="pt-seguro relative overflow-hidden rounded-b-[2.5rem] bg-marinho px-5 pb-28 text-white lg:rounded-none lg:flex lg:flex-col lg:justify-center lg:pb-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-azul/40 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-sm pt-8 text-center lg:max-w-md">
          <h1 className="font-titulo text-[1.7rem] leading-tight">
            Suas festas prontas estão te esperando
          </h1>
          <p className="mt-2 text-azul-claro/90">
            Entre com o e-mail da compra e comece a montar hoje.
          </p>

          <img
            src="/capa-150-festas-800.webp"
            srcSet="/capa-150-festas-480.webp 480w, /capa-150-festas-800.webp 800w"
            sizes="(min-width: 1024px) 440px, 340px"
            width={800}
            height={800}
            alt="Guia +150 Festas Infantis Prontas, com páginas de projetos e bônus"
            loading="lazy"
            className="mx-auto mt-6 hidden w-full max-w-[440px] drop-shadow-[0_24px_40px_rgba(7,20,64,0.55)] lg:block"
          />
        </div>
      </section>

      <section className="pb-seguro relative px-5 lg:flex lg:flex-col lg:justify-center lg:py-10">
        <div className="mx-auto w-full max-w-sm">
          {/* No celular a capa sobe por cima da faixa marinho. */}
          <img
            src="/capa-150-festas-800.webp"
            srcSet="/capa-150-festas-480.webp 480w, /capa-150-festas-800.webp 800w"
            sizes="300px"
            width={800}
            height={800}
            alt=""
            fetchPriority="high"
            className="relative mx-auto -mt-24 w-[300px] max-w-full drop-shadow-[0_20px_30px_rgba(7,20,64,0.35)] lg:hidden"
          />

          <div className="mt-4 rounded-3xl border border-linha bg-white p-5 shadow-[0_20px_50px_-24px_rgba(26,35,56,0.35)] lg:mt-0">
            <FormEntrada />
          </div>

          <CanaisAjuda />
          <p className="py-8 text-center text-xs text-tinta-suave">
            Decoração Sem Complicação · acesso vitalício
          </p>
        </div>
      </section>
    </main>
  );
}
