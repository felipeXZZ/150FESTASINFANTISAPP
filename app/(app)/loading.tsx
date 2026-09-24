// Aparece na hora em que ela toca numa aba, enquanto o servidor busca os dados:
// sem isso a tela fica parada até a resposta chegar.
export default function Carregando() {
  return (
    <div className="animate-pulse space-y-6 motion-reduce:animate-none" aria-busy="true" aria-label="Carregando">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg bg-linha" />
        <div className="h-4 w-64 max-w-full rounded bg-linha/70" />
      </div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <li key={i} className="overflow-hidden rounded-2xl border border-linha bg-white">
            <div className="aspect-video bg-linha/60" />
            <div className="space-y-2 p-4">
              <div className="h-5 w-3/4 rounded bg-linha" />
              <div className="h-4 w-1/2 rounded bg-linha/70" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
