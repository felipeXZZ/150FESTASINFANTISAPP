import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESSAO } from "@/lib/sessao";

function sair(request: NextRequest) {
  const destino = new URL("/entrar", request.nextUrl.origin);
  // Acesso suspenso no meio da sessão (lib/acesso.ts): a entrada avisa o motivo.
  if (request.nextUrl.searchParams.get("motivo") === "suspenso") destino.searchParams.set("motivo", "suspenso");
  const resposta = NextResponse.redirect(destino, { status: 303 });
  resposta.cookies.delete(COOKIE_SESSAO);
  return resposta;
}

/** Botão "Sair". */
export async function POST(request: NextRequest) {
  return sair(request);
}

/** Usado por lib/acesso.ts quando a compra foi suspensa ou apagada. */
export async function GET(request: NextRequest) {
  return sair(request);
}
