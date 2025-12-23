import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { tarotApi, type TarotSession } from '../../services/api';

export function Sessions() {
  const [sessions, setSessions] = useState<TarotSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tarotApi.listSessions({ page, limit: 10 });
      setSessions(response.sessions);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar sessões');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      CREATED: 'Criada',
      CARDS_DRAWN: 'Cartas Escolhidas',
      INTERPRETED: 'Interpretada',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      CREATED: 'bg-purple-700',
      CARDS_DRAWN: 'bg-yellow-600',
      INTERPRETED: 'bg-green-600',
    };
    return colorMap[status] || 'bg-gray-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseTheme = (theme: string) => {
    try {
      const parsed = JSON.parse(theme);
      return {
        theme: parsed.theme || 'Não especificado',
        question: parsed.question || 'Não especificado',
      };
    } catch {
      return {
        theme: theme || 'Não especificado',
        question: 'Não especificado',
      };
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
          Minhas Sessões
        </h1>
        <p className="text-xl text-purple-200">
          Histórico completo das suas leituras
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-white text-xl">Carregando sessões...</div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center">
          <p className="text-red-200 text-lg">{error}</p>
          <button
            onClick={loadSessions}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-purple-950/50 backdrop-blur-sm rounded-lg p-12 border border-purple-900/50 text-center">
          <div className="text-6xl mb-4">🔮</div>
          <h2 className="text-2xl font-bold text-white mb-2">Nenhuma sessão encontrada</h2>
          <p className="text-purple-200 mb-6">
            Você ainda não criou nenhuma sessão de tarot.
          </p>
          <Link
            to="/tarot"
            className="inline-block px-8 py-4 bg-purple-800 hover:bg-purple-900 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Criar Primeira Sessão
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {sessions.map((session) => {
              const { theme: sessionTheme, question } = parseTheme(session.theme);
              
              return (
                <div
                  key={session.id}
                  className="bg-purple-950/50 backdrop-blur-sm rounded-lg p-6 border border-purple-900/50 hover:border-purple-700/50 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                            session.status
                          )}`}
                        >
                          {getStatusLabel(session.status)}
                        </span>
                        <span className="text-purple-300 text-sm">
                          {formatDate(session.createdAt)}
                        </span>
                      </div>
                      
                      <h3 className="text-4xl font-bold text-white mb-2">
                        {sessionTheme}
                      </h3>
                      
                      <p className="text-purple-200 mb-3 line-clamp-2">
                        {question}
                      </p>

                      {session.cards.length > 0 && (
                        <div className="flex items-center gap-2 text-purple-300 text-sm">
                          <span>🃏</span>
                          <span>
                            {session.cards.length} carta{session.cards.length !== 1 ? 's' : ''} escolhida
                            {session.cards.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      {session.interpretation && (
                        <div className="mt-3 p-3 bg-purple-900/30 rounded-lg">
                          <p className="text-purple-200 text-sm line-clamp-3">
                            {session.interpretation}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/sessions/${session.id}`}
                        className="px-6 py-2 bg-purple-800 hover:bg-purple-900 text-white rounded-lg font-semibold text-center transition-all transform hover:scale-105"
                      >
                        Ver Detalhes
                      </Link>
                      {session.status !== 'INTERPRETED' && (
                        <Link
                          to={`/tarot?sessionId=${session.id}`}
                          className="px-6 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold text-center transition-all transform hover:scale-105"
                        >
                          Continuar Consulta
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  page === 1
                    ? 'bg-purple-950/50 text-purple-400 cursor-not-allowed opacity-50'
                    : 'bg-purple-800 hover:bg-purple-900 text-white'
                }`}
              >
                Anterior
              </button>
              
              <span className="text-purple-200 px-4">
                Página {page} de {totalPages}
              </span>
              
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  page === totalPages
                    ? 'bg-purple-950/50 text-purple-400 cursor-not-allowed opacity-50'
                    : 'bg-purple-800 hover:bg-purple-900 text-white'
                }`}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

