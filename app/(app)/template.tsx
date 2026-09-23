"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Ordem das abas da barra: a tela nova entra pelo lado da aba tocada.
const ORDEM = ["/", "/calculadora", "/conta"];

function posicao(pathname: string) {
  if (pathname === "/") return 0;
  const i = ORDEM.findIndex((r) => r !== "/" && pathname.startsWith(r));
  return i === -1 ? ORDEM.length : i; // /admin e o resto ficam depois de Conta
}

// Última aba vista. O template remonta a cada navegação, então fica fora dele;
// só é atualizada depois da renderização, para o React poder renderizar duas vezes.
let anterior: number | null = null;

export default function Template({ children }: { children: React.ReactNode }) {
  const atual = posicao(usePathname());
  // Decidido uma vez por tela: re-renderizar não reinicia a animação.
  const [sentido] = useState(() =>
    anterior === null || anterior === atual ? "pagina-subir" : atual > anterior ? "pagina-direita" : "pagina-esquerda",
  );

  useEffect(() => {
    anterior = atual;
  }, [atual]);

  return <div className={sentido}>{children}</div>;
}
