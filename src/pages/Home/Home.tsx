import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
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
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
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
        <div className="bg-purple-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-700/50">
          <div className="text-4xl mb-4">🃏</div>
          <h3 className="text-xl font-bold text-white mb-2">78 Cartas Completas</h3>
          <p className="text-purple-200">
            Baralho completo de Tarot com Arcanos Maiores e Menores
          </p>
        </div>

        <div className="bg-purple-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-700/50">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-bold text-white mb-2">IA Avançada</h3>
          <p className="text-purple-200">
            Interpretações profundas usando OpenAI GPT-3.5
          </p>
        </div>

        <div className="bg-purple-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-700/50">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="text-xl font-bold text-white mb-2">24/7 Disponível</h3>
          <p className="text-purple-200">
            Acesse suas leituras a qualquer momento do dia
          </p>
        </div>
      </div>
    </div>
  );
}

