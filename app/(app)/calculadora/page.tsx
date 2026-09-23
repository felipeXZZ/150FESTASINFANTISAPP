import { OfertaBiblioteca } from "@/components/biblioteca/oferta-biblioteca";
import { RegistrarVisita } from "./biblioteca";

export const metadata = { title: "Calculadora — 150 Festas Infantis" };

// A aba da barra abre o mesmo conteúdo em popup; esta página atende quem chega
// pelo endereço direto.
export default function CalculadoraPage() {
  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-3xl border border-linha bg-papel">
      <RegistrarVisita />
      <OfertaBiblioteca />
    </div>
  );
}
