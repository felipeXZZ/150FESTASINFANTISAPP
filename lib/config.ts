// Variáveis públicas lidas em um lugar só. NEXT_PUBLIC_* é embutido no build,
// então precisa ser acessado pelo nome literal.

export const WHATSAPP_NUMERO = (process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "").replace(/\D/g, "");
export const CHECKOUT_UPGRADE_URL = process.env.NEXT_PUBLIC_CHECKOUT_UPGRADE_URL ?? "";
/** Texto livre, ex: "R$ 19,90". Vazio = o botão de upgrade sai sem preço. */
export const PRECO_UPGRADE = (process.env.NEXT_PUBLIC_PRECO_UPGRADE ?? "").trim();
export const BIBLIOTECA_URL = process.env.NEXT_PUBLIC_BIBLIOTECA_URL ?? "";
export const BANNER_NOVIDADE = (process.env.NEXT_PUBLIC_BANNER_NOVIDADE ?? "").trim();
export const BANNER_NOVIDADE_URL = process.env.NEXT_PUBLIC_BANNER_NOVIDADE_URL ?? "";
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** "Quero o Pacote Completo por R$ 19,90", ou sem o preço se a variável estiver vazia. */
export const TEXTO_BOTAO_UPGRADE = PRECO_UPGRADE
  ? `Quero o Pacote Completo por ${PRECO_UPGRADE}`
  : "Quero o Pacote Completo";

export const BIBLIOTECA_CHECKOUT_URL = process.env.NEXT_PUBLIC_BIBLIOTECA_CHECKOUT_URL ?? "";
/** Texto livre, ex: "R$ 14,90". Vazio = o popup sai sem preço. */
export const PRECO_BIBLIOTECA = (process.env.NEXT_PUBLIC_PRECO_BIBLIOTECA ?? "").trim();

/** Garante o ?origem=app-festas, que mede as vendas da Biblioteca vindas daqui. */
function comOrigem(endereco: string) {
  if (!endereco) return "";
  try {
    const url = new URL(endereco);
    if (!url.searchParams.has("origem")) url.searchParams.set("origem", "app-festas");
    return url.toString();
  } catch {
    return endereco;
  }
}

/** Página de vendas da Biblioteca Visual. */
export const linkBiblioteca = () => comOrigem(BIBLIOTECA_URL);

/** Checkout da Biblioteca; sem ele, o botão principal vai para a página de vendas. */
export const linkCheckoutBiblioteca = () => comOrigem(BIBLIOTECA_CHECKOUT_URL) || linkBiblioteca();

/** Do link do perfil tira o @: .../decorar.semcomplicacao/ -> @decorar.semcomplicacao */
export function arrobaInstagram(url = INSTAGRAM_URL) {
  const usuario = url.replace(/\/+$/, "").split("?")[0].split("/").pop();
  return usuario ? `@${usuario}` : "Instagram";
}

export function linkWhatsapp(mensagem = "Olá! Preciso de ajuda com o 150 Festas Infantis.") {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

/** 5511919005590 -> "(11) 91900-5590". Fora do padrao, mostra como veio. */
export function whatsappLegivel(numero = WHATSAPP_NUMERO) {
  const local = numero.replace(/^55/, "");
  const ddd = local.slice(0, 2);
  const resto = local.slice(2);
  if (ddd.length !== 2 || resto.length < 8) return numero;
  const corte = resto.length - 4;
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`;
}
