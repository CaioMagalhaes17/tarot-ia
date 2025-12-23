import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-10xl font-bold text-white mb-4">
          🔮 Tarot IA
        </h1>
        <p className="text-xl md:text-2xl text-purple-100 mb-8">
          Descubra seu destino através das cartas com Inteligência Artificial
        </p>
        <p className="text-lg text-purple-200 mb-8">
          Interpretações personalizadas e profundas 24 horas por dia
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/tarot"
            className="px-8 py-4 bg-purple-800 hover:bg-purple-900 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Começar Leitura
          </Link>
          <Link
            to="/subscriptions"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-lg transition-all backdrop-blur-sm border border-white/20"
          >
            Ver Planos
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-16">
        <Link
          to="/tarot"
          className="bg-purple-950/50 backdrop-blur-sm rounded-lg p-6 border flex flex-col items-center border-purple-900/50 hover:border-purple-700/50 transition-all hover:transform hover:scale-105 cursor-pointer"
        >
          <div className="text-4xl mb-4">🔮</div>
          <h3 className="text-6xl font-bold text-white mb-3">Tarot</h3>
          <p className="text-purple-200 text-center">
            Leitura completa de tarot com múltiplas cartas. Escolha de 1 a 10 cartas do baralho completo de 78 cartas e receba uma interpretação detalhada e personalizada sobre sua pergunta ou tema.
          </p>
        </Link>

        <Link
          to="/amor"
          className="bg-purple-950/50 backdrop-blur-sm rounded-lg p-6 border flex flex-col items-center border-purple-900/50 hover:border-purple-700/50 transition-all hover:transform hover:scale-105 cursor-pointer"
        >
          <div className="text-4xl mb-4">💕</div>
          <h3 className="text-6xl font-bold text-white mb-3">Amor</h3>
          <p className="text-purple-200 text-center">
            Leitura especializada em relacionamentos e questões do coração. Descubra insights sobre seu relacionamento atual, futuro amoroso ou questões sentimentais através das cartas.
          </p>
        </Link>

        <Link
          to="/uma-carta"
          className="bg-purple-950/50 backdrop-blur-sm rounded-lg p-6 border flex flex-col items-center border-purple-900/50 hover:border-purple-700/50 transition-all hover:transform hover:scale-105 cursor-pointer"
        >
          <div className="text-4xl mb-4">🃏</div>
          <h3 className="text-6xl font-bold text-white mb-3">Uma Carta</h3>
          <p className="text-purple-200 text-center">
            Leitura rápida e direta com uma única carta. Ideal para respostas rápidas e orientações do dia. Uma carta, uma mensagem clara e objetiva para guiar seu caminho.
          </p>
        </Link>
      </div>
    </div>
  );
}

