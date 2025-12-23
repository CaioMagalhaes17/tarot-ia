import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-8">
        <div className="text-9xl font-bold text-purple-300/50 mb-4">404</div>
        <div className="text-6xl mb-4">🔮</div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Página Não Encontrada
      </h1>
      
      <p className="text-xl text-purple-200 mb-8 max-w-md">
        As cartas não revelaram este caminho. A página que você procura não existe neste universo.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="px-8 py-4 bg-purple-800 hover:bg-purple-900 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
        >
          Voltar ao Início
        </Link>
        <Link
          to="/tarot"
          className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-lg transition-all backdrop-blur-sm border border-white/20"
        >
          Fazer uma Leitura
        </Link>
      </div>
    </div>
  );
}

