type Props = { tamanho?: "md" | "lg"; /** Sobre fundo marinho. */ claro?: boolean };

export function Logo({ tamanho = "md", claro = false }: Props) {
  const grande = tamanho === "lg";
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`relative grid place-items-center rounded-xl bg-azul font-titulo tracking-tight text-white ${
          grande ? "size-12 text-base" : "size-8 text-[11px]"
        } ${claro ? "ring-2 ring-white/20" : ""}`}
      >
        150
        <span
          className={`absolute rounded-full bg-ouro ring-2 ${claro ? "ring-marinho" : "ring-papel"} ${
            grande ? "-top-1 -right-1 size-3.5" : "-top-0.5 -right-0.5 size-2.5"
          }`}
        />
      </span>
      <span
        className={`font-titulo leading-none ${claro ? "text-white" : "text-tinta"} ${
          grande ? "text-2xl" : "text-lg"
        }`}
      >
        150 Festas Infantis
      </span>
    </span>
  );
}
