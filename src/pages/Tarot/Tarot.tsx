import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginModal } from '../../components/LoginModal/LoginModal';
import { PlansModal } from '../../components/PlansModal/PlansModal';
import { tarotApi, type TarotCard as ApiTarotCard, type AvailableCard } from '../../services/api';

export function Tarot() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [theme, setTheme] = useState('');
  const [question, setQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [sessionCreated, setSessionCreated] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [drawnCards, setDrawnCards] = useState<ApiTarotCard[]>([]);
  const [isDrawingCards, setIsDrawingCards] = useState(false);
  const [cardsRevealed, setCardsRevealed] = useState(false);
  const [revealedCardsCount, setRevealedCardsCount] = useState(0);
  const [availableCards, setAvailableCards] = useState<AvailableCard[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const interpretationRef = useRef<HTMLDivElement>(null);

  const loadSession = useCallback(async (id: string) => {
    setIsLoadingSession(true);
    try {
      const session = await tarotApi.getSessionById(id);
      setSessionId(session.id);
      
      // Parsear o theme JSON e preencher os campos
      try {
        const themeData = JSON.parse(session.theme);
        setTheme(themeData.theme || '');
        setQuestion(themeData.question || '');
      } catch {
        // Se não for JSON válido, usar o theme como está
        setTheme(session.theme || '');
      }

      // Se a sessão já tiver cartas escolhidas, marcar como criada
      if (session.status === 'CARDS_DRAWN' || session.status === 'INTERPRETED') {
        setSessionCreated(true);
        setCardsRevealed(true);
        setDrawnCards(session.cards);
        setRevealedCardsCount(session.cards.length); // Todas já reveladas se carregadas
      } else if (session.status === 'CREATED') {
        // Se a sessão foi criada mas não tem cartas, já marca como criada
        setSessionCreated(true);
      }
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
      alert(error instanceof Error ? error.message : 'Erro ao carregar sessão');
    } finally {
      setIsLoadingSession(false);
    }
  }, []);

  // Buscar cartas disponíveis da API
  useEffect(() => {
    const loadAvailableCards = async () => {
      setIsLoadingCards(true);
      try {
        const response = await tarotApi.getAvailableCards(30);
        setAvailableCards(response.cards);
      } catch (error) {
        console.error('Erro ao carregar cartas disponíveis:', error);
        alert(error instanceof Error ? error.message : 'Erro ao carregar cartas');
      } finally {
        setIsLoadingCards(false);
      }
    };

    loadAvailableCards();
  }, []);

  // Buscar sessão se sessionId estiver na query string
  useEffect(() => {
    const sessionIdParam = searchParams.get('sessionId');
    if (sessionIdParam && isAuthenticated) {
      loadSession(sessionIdParam);
    }
  }, [searchParams, isAuthenticated, loadSession]);

  const handleCardClick = (cardId: string) => {
    setSelectedCards(prev => {
      if (prev.includes(cardId)) {
        // Deselecionar se já estiver selecionada
        return prev.filter(id => id !== cardId);
      } else {
        // Selecionar (máximo 5 cartas)
        if (prev.length < 5) {
          return [...prev, cardId];
        }
        return prev;
      }
    });
  };

  const processSubmission = async () => {
    if (sessionCreated) {
      // Se a sessão já foi criada, revelar as cartas
      if (!sessionId) {
        alert('Erro: ID da sessão não encontrado');
        return;
      }

      setIsDrawingCards(true);
      try {
        const response = await tarotApi.drawCards(sessionId, {
          selectedCardIds: selectedCards,
        });
        setDrawnCards(response.cards);
        setCardsRevealed(true);
        setRevealedCardsCount(0);
        
        // Revelar cartas progressivamente com intervalo de 1.5s
        response.cards.forEach((_, index) => {
          setTimeout(() => {
            setRevealedCardsCount(index + 1);
          }, (index + 1) * 1500);
        });
      } catch (error) {
        console.error('Erro ao revelar cartas:', error);
        alert(error instanceof Error ? error.message : 'Erro ao revelar cartas');
      } finally {
        setIsDrawingCards(false);
      }
      return;
    }

    setIsCreatingSession(true);
    try {
      // Criar JSON string com theme e question
      const themeJson = JSON.stringify({
        theme: theme,
        question: question
      });

      // Criar sessão na API
      const response = await tarotApi.createSession({ theme: themeJson });
      setSessionId(response.id);
      
      // Aguardar um pouco para transição suave
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Atualizar estado para mostrar as mudanças visuais
      setSessionCreated(true);
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      
      // Verificar se é erro 403 de limite excedido
      if (error instanceof Error) {
        const errorStatus = (error as Error & { status?: number }).status;
        const errorMessage = error.message.toLowerCase();
        
        if (errorStatus === 403 || 
            errorMessage.includes('daily limit exceeded') || 
            errorMessage.includes('upgrade your subscription')) {
          setIsPlansModalOpen(true);
          return;
        }
      }
      
      alert(error instanceof Error ? error.message : 'Erro ao criar sessão');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se o usuário está autenticado
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    await processSubmission();
  };

  const handleLoginSuccess = async () => {
    // Após login bem-sucedido, processar o envio
    await processSubmission();
  };

  const handleInterpret = async () => {
    if (!sessionId) {
      alert('Erro: ID da sessão não encontrado');
      return;
    }

    setIsInterpreting(true);
    try {
      const response = await tarotApi.interpret(sessionId);
      setInterpretation(response.interpretation);
      
      // Scroll para a seção de interpretação após um pequeno delay
      setTimeout(() => {
        interpretationRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    } catch (error) {
      console.error('Erro ao interpretar cartas:', error);
      alert(error instanceof Error ? error.message : 'Erro ao interpretar cartas');
    } finally {
      setIsInterpreting(false);
    }
  };

  const parseThemeAndQuestion = () => {
    try {
      const themeData = JSON.parse(theme);
      return {
        theme: themeData.theme || theme,
        question: themeData.question || question
      };
    } catch {
      return {
        theme: theme,
        question: question
      };
    }
  };

  if (isLoadingSession) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-white text-xl">Carregando sessão...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
          🔮 Leitura de Tarot
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="transition-all duration-500">
          <h2 className="text-5xl font-bold text-white transition-all duration-500">
            { cardsRevealed ? 'Suas Cartas Reveladas' :
            sessionCreated ? 'Revelar Cartas' : 'Escolha suas cartas'}
          </h2>
          {!sessionCreated && (
            <p className="font-bold text-white transition-all duration-500">({selectedCards.length}/5)</p>
          )}
        </div>

        {/* Container de cartas reveladas */}
        {cardsRevealed && drawnCards.length > 0 && (
          <div className="mb-8 mt-10">
            
            <div className="flex flex-wrap justify-center gap-6">
              {drawnCards.map((card, index) => {
                const isRevealed = index < revealedCardsCount;
                
                return (
                  <div
                    key={card.id}
                    className={`relative transform transition-all duration-500 ${
                      isRevealed 
                        ? 'opacity-100 scale-100 hover:scale-105' 
                        : 'opacity-0 scale-95'
                    }`}
                  >
                    {isRevealed ? (
                      <>
                        <div className="relative">
                          <img
                            src={`/${card.id}.jpg`}
                            alt={card.id}
                            className="w-48 h-auto rounded-lg object-cover border-2 border-purple-400 shadow-lg shadow-purple-700/50"
                            onError={(e) => {
                              // Fallback para carta.avif se a imagem não existir
                              (e.target as HTMLImageElement).src = '/carta.avif';
                            }}
                          />
                          {card.isReversed && (
                            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                              Reversa
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 bg-purple-900/80 text-white text-xs font-semibold px-2 py-1 rounded">
                            Posição {card.position}
                          </div>
                        </div>
                        <p className="text-white text-center mt-2 font-semibold">{card.name}</p>
                      </>
                    ) : (
                      <div className="relative">
                        <img
                          src="/carta.avif"
                          alt="Carta não revelada"
                          className="w-48 h-auto rounded-lg object-cover border-2 border-purple-900/50"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tema e Pergunta após cartas reveladas */}
        {cardsRevealed && drawnCards.length > 0 && (
          <div className="mb-8 mt-8">
            <div className="max-w-4xl mx-auto bg-purple-900/30 backdrop-blur-sm rounded-lg p-6 border border-purple-900/50">
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-bold mb-2">
                    Tema da Leitura
                  </label>
                  <p className="text-purple-200 font-semibold">
                    {parseThemeAndQuestion().theme}
                  </p>
                </div>
                
                <div>
                  <label className="block text-white font-bold mb-2">
                    O que você quer saber?
                  </label>
                  <p className="text-purple-200 font-semibold">
                    {parseThemeAndQuestion().question}
                  </p>
                </div>
              </div>
            </div>

            {/* Botão Interpretar Cartas */}
            {!interpretation && (
              <div className="text-center mt-6">
                <button
                  onClick={handleInterpret}
                  disabled={isInterpreting}
                  className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
                    isInterpreting
                      ? 'bg-purple-950/50 text-purple-400 cursor-not-allowed opacity-50'
                      : 'bg-purple-800 hover:bg-purple-950 text-white transform hover:scale-105 shadow-lg cursor-pointer'
                  }`}
                >
                  {isInterpreting ? 'Interpretando...' : 'Interpretar Cartas'}
                </button>
              </div>
            )}

            {/* Interpretação */}
            {interpretation && (
              <div 
                ref={interpretationRef}
                className="mt-8 max-w-4xl mx-auto bg-purple-900/30 backdrop-blur-sm rounded-lg p-6 border border-purple-900/50"
              >
                <h3 className="text-3xl font-bold text-white mb-4 text-center">
                  Interpretação
                </h3>
                <div className="text-purple-200 leading-relaxed whitespace-pre-wrap">
                  {interpretation}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Container de cartas sobrepostas */}
        {!cardsRevealed && (
          <div className="relative overflow-x-auto overflow-y-visible pb-8" style={{ minHeight: '200px' }}>
            {isLoadingCards ? (
              <div className="h-full px-4">
                <div className="relative inline-flex items-end" style={{ height: '180px' }}>
                  {Array.from({ length: 30 }).map((_, index) => {
                    const leftOffset = index * 35; // Espaçamento menor para sobreposição
                    const zIndex = 30 - index;
                    
                    return (
                      <div
                        key={`skeleton-${index}`}
                        className="absolute animate-pulse"
                        style={{
                          left: `${leftOffset}px`,
                          bottom: 0,
                          zIndex: zIndex,
                        }}
                      >
                        <div className="relative w-[80px]">
                          <div className="w-[80px] h-[120px] bg-purple-900/50 rounded-lg border-2 border-purple-800/30 shadow-lg">
                            <div className="w-full h-full bg-gradient-to-br from-purple-900/70 via-purple-800/50 to-purple-900/70 rounded-lg"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-full px-4">
                <div className="relative inline-flex items-end" style={{ height: '180px' }}>
                  {availableCards.map((card, index) => {
                const isSelected = selectedCards.includes(card.id);
                const zIndex = availableCards.length - index;
                const leftOffset = index * 35; // Espaçamento menor para sobreposição
                
                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`absolute cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'transform -translate-y-4 scale-110 shadow-2xl ring-4 ring-purple-600 ring-opacity-90' 
                        : 'hover:transform hover:-translate-y-2 hover:scale-105 hover:z-40'
                    }`}
                    style={{
                      left: `${leftOffset}px`,
                      bottom: 0,
                      zIndex: isSelected ? 1000 : zIndex,
                    }}
                    title={card.name}
                  >
                    <div className="relative w-[80px]">
                      <img
                        src="/carta.avif"
                        alt={`Carta ${card.name}`}
                        className={`w-full h-auto rounded-lg object-cover border-2 ${
                          isSelected 
                            ? 'border-purple-400 shadow-purple-700/70' 
                            : 'border-purple-900/50 hover:border-purple-700/70'
                        } transition-all`}
                        draggable={false}
                      />
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg animate-pulse">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
                </div>
              </div>
            )}
          </div>
        )}
        {/*Form*/}
        {!sessionCreated && (
          <div className={`max-w-4xl mr-auto ml-auto bg-purple-900/30 backdrop-blur-sm rounded-lg p-6 border border-purple-900/50 mb-6 transition-all duration-500 ${
            sessionCreated ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100'
          }`}>
            <div className="flex flex-col gap-4 text-lg">
              <div className="flex-1">
                <label htmlFor="theme" className="block text-white font-bold mb-2">
                  Tema da Leitura
                </label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-4 py-3 font-semibold bg-purple-950/50 border border-purple-800/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
                  required
                  disabled={sessionCreated}
                >
                  <option value="Carreira e Finanças" className="bg-purple-950 font-semibold">Carreira e Finanças</option>
                  <option value="Saúde e bem-estar" className="bg-purple-950 font-semibold">Saúde e bem-estar</option>
                  <option value="Família" className="bg-purple-950 font-semibold">Família</option>
                  <option value="Espiritualidade" className="bg-purple-950 font-semibold">Espiritualidade</option>
                  <option value="Amor e relacionamentos" className="bg-purple-950 font-semibold">Amor e relacionamentos</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label htmlFor="question" className="block text-white font-bold mb-2">
                O que você quer saber?
                </label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Faça sua pergunta para as cartas..."
                  rows={4}
                  className="font-semibold w-full px-4 py-3 bg-purple-950/50 border border-purple-800/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent resize-none"
                  required
                  disabled={sessionCreated}
                />
              </div>
            </div>
          </div>
        )}

        

        <div className="text-center">
          {!cardsRevealed && !cardsRevealed ? (
            <>
            <button
            type="submit"
            disabled={
              isCreatingSession || 
              isDrawingCards ||
              (!sessionCreated && (selectedCards.length !== 5 || !question.trim())) ||
              (sessionCreated && (selectedCards.length !== 5 || cardsRevealed))
            }
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
              (sessionCreated && selectedCards.length === 5) || 
              (!sessionCreated && selectedCards.length === 5 && question.trim())
                ? 'bg-purple-800 hover:bg-purple-950 text-white transform hover:scale-105 shadow-lg cursor-pointer'
                : 'bg-purple-800/50 text-purple-400 cursor-not-allowed opacity-50'
            }`}
          >

            {isCreatingSession 
              ? 'Criando sessão...' 
              : isDrawingCards
                ? 'Revelando cartas...'
                : sessionCreated 
                  ? 'Confirmar Revelação' 
                  : 'Confirmar Seleção e Continuar'
            }
          </button>
            </>     
          ) : ''}
          
        </div>
      </form>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <PlansModal
        isOpen={isPlansModalOpen}
        onClose={() => setIsPlansModalOpen(false)}
      />
    </div>
  );
}

