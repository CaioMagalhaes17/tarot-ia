import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { subscriptionsApi, type SubscriptionPlan, type Subscription, type SubscribeResponse } from '../../services/api';

export function Plans() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeResponse, setSubscribeResponse] = useState<SubscribeResponse | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadPlans();
  }, [isAuthenticated, navigate]);

  const loadPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [plansData, subscription] = await Promise.all([
        subscriptionsApi.getPlans(),
        subscriptionsApi.getCurrentSubscription(),
      ]);
      setPlans(plansData);
      setCurrentSubscription(subscription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar planos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatPrice = (priceInCents: number) => {
    if (priceInCents === 0) return 'Gratuito';
    return `R$ ${(priceInCents / 100).toFixed(2).replace('.', ',')}`;
  };

  const getLimitText = (limit: number | null) => {
    if (limit === null) return 'Sem limite global';
    if (limit === -1) return 'Ilimitado';
    return `${limit} sessões diárias`;
  };

  const getPlanIcon = (name: string) => {
    if (name.toLowerCase().includes('free') || name.toLowerCase().includes('gratuito')) return '🆓';
    if (name.toLowerCase().includes('premium')) return '⭐';
    if (name.toLowerCase().includes('ilimitado') || name.toLowerCase().includes('unlimited')) return '🚀';
    return '💎';
  };

  const handleSubscribe = async (planId: string, price: number) => {
    setIsSubscribing(true);
    setError(null);
    setSelectedPlanId(planId);
    
    try {
      // Se for plano gratuito, não precisa de método de pagamento
      if (price === 0) {
        const response = await subscriptionsApi.subscribe({ planId });
        setSubscribeResponse(response);
        // Recarregar assinatura atual
        const subscription = await subscriptionsApi.getCurrentSubscription();
        setCurrentSubscription(subscription);
      } else {
        // Para planos pagos, usar PIX
        const response = await subscriptionsApi.subscribe({
          planId,
          paymentMethod: 'PIX',
        });
        setSubscribeResponse(response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao assinar plano');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleBackToPlans = () => {
    setSubscribeResponse(null);
    setSelectedPlanId(null);
    loadPlans();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
          Planos e Assinaturas
        </h1>
        <p className="text-xl text-purple-200">
          Escolha o plano ideal para suas necessidades
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="text-white text-2xl">Carregando planos...</div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center max-w-2xl mx-auto">
          <p className="text-red-200 text-lg mb-4">{error}</p>
          <button
            onClick={loadPlans}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
          >
            Tentar Novamente
          </button>
        </div>
      ) : subscribeResponse && subscribeResponse.payment.qrCode ? (
        // Exibir QR Code do PIX
        <div className="max-w-3xl mx-auto">
          <div className="bg-purple-950/50 backdrop-blur-sm rounded-lg p-8 border border-purple-900/50">
            <div className="text-center mb-6">
              <h2 className="text-4xl font-bold text-white mb-2">
                Pagamento PIX
              </h2>
              <p className="text-purple-200">
                Escaneie o QR Code ou copie o código PIX para finalizar sua assinatura
              </p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <img
                  src={subscribeResponse.payment.qrCode}
                  alt="QR Code PIX"
                  className="w-80 h-80"
                />
              </div>

              {subscribeResponse.payment.pixCode && (
                <div className="w-full max-w-2xl">
                  <p className="text-purple-200 text-sm mb-3 text-center">
                    Ou copie o código PIX:
                  </p>
                  <div className="flex items-center space-x-3 bg-purple-950/50 rounded-lg p-4 border border-purple-800/50">
                    <code className="flex-1 text-purple-200 text-sm break-all">
                      {subscribeResponse.payment.pixCode}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(subscribeResponse.payment.pixCode || '');
                        alert('Código PIX copiado!');
                      }}
                      className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white rounded text-sm transition-colors whitespace-nowrap"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 w-full max-w-2xl">
                <p className="text-green-200 text-center text-sm">
                  {subscribeResponse.payment.message}
                </p>
              </div>

              <p className="text-purple-300 text-sm text-center max-w-2xl">
                Após o pagamento, sua assinatura será ativada automaticamente. 
                Você receberá uma confirmação por email assim que o pagamento for processado.
              </p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleBackToPlans}
                  className="px-6 py-3 bg-purple-800 hover:bg-purple-900 text-white rounded-lg font-semibold transition-all"
                >
                  Voltar aos Planos
                </button>
                <button
                  onClick={() => {
                    setSubscribeResponse(null);
                    setSelectedPlanId(null);
                    loadPlans();
                  }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                >
                  Já Paguei
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : subscribeResponse && !subscribeResponse.payment.qrCode ? (
        // Mensagem de sucesso para plano gratuito
        <div className="max-w-3xl mx-auto">
          <div className="bg-green-900/50 border border-green-700/50 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-4xl font-bold text-green-200 mb-4">
              Plano Ativado com Sucesso!
            </h2>
            <p className="text-green-300 text-lg mb-6">
              Seu plano {subscribeResponse.plan.name} foi ativado. Você já pode usar todos os recursos disponíveis.
            </p>
            <button
              onClick={handleBackToPlans}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
            >
              Ver Meus Planos
            </button>
          </div>
        </div>
      ) : (
        // Listagem de planos
        <div className="space-y-8">
          {currentSubscription && (
            <div className="bg-purple-900/50 backdrop-blur-sm rounded-lg p-6 border border-purple-800/50 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4 text-center">
                Sua Assinatura Atual
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-lg">
                    <span className="font-semibold text-white">
                      {plans.find(p => p.id === currentSubscription.planId)?.name || 'Plano Ativo'}
                    </span>
                  </p>
                  <p className="text-purple-300 text-sm mt-1">
                    Status: <span className="font-semibold text-white">
                      {currentSubscription.status === 'ACTIVE' ? 'Ativa' : 
                       currentSubscription.status === 'TRIAL' ? 'Período de Teste' :
                       currentSubscription.status === 'PENDING_PAYMENT' ? 'Aguardando Pagamento' :
                       'Inativa'}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-purple-200 text-sm">
                    Início: {new Date(currentSubscription.startDate).toLocaleDateString('pt-BR')}
                  </p>
                  {currentSubscription.endDate && (
                    <p className="text-purple-200 text-sm">
                      Término: {new Date(currentSubscription.endDate).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-4xl font-bold text-white mb-6 text-center">
              Planos Disponíveis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans && plans.map((plan) => {
                const isCurrentPlan = currentSubscription?.planId === plan.id && 
                                     (currentSubscription.status === 'ACTIVE' || 
                                      currentSubscription.status === 'TRIAL');
                
                return (
                  <div
                    key={plan.id}
                    className={`backdrop-blur-sm rounded-lg p-8 border transition-all flex flex-col ${
                      isCurrentPlan
                        ? 'bg-purple-800/70 border-purple-500 ring-2 ring-purple-400'
                        : 'bg-purple-900/50 border-purple-800/50 hover:border-purple-600/50 hover:transform hover:scale-105'
                    }`}
                  >
                    {isCurrentPlan && (
                      <div className="mb-4 text-center">
                        <span className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-full">
                          ✓ Plano Atual
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <div className="text-5xl mb-3">{getPlanIcon(plan.name)}</div>
                      <h3 className="text-3xl font-bold text-white mb-3">{plan.name}</h3>
                      <div className="text-4xl font-bold text-purple-300 mb-2">
                        {formatPrice(plan.price)}
                      </div>
                      {plan.billingPeriod === 'MONTHLY' && (
                        <span className="text-purple-300 text-base">/mês</span>
                      )}
                      {plan.billingPeriod === 'YEARLY' && (
                        <span className="text-purple-300 text-base">/ano</span>
                      )}
                    </div>

                    <div className="space-y-4 mb-6 flex-grow">
                      <div className="text-center">
                        <p className="text-purple-200 text-base mb-2">Limite Diário</p>
                        <p className="text-white font-bold text-xl">
                          {getLimitText(plan.globalDailyLimit)}
                        </p>
                      </div>

                      {plan.description && (
                        <p className="text-purple-300 text-sm text-center">
                          {plan.description}
                        </p>
                      )}

                      {plan.features && plan.features.length > 0 && (
                        <div className="mt-4">
                          <p className="text-purple-200 text-sm font-semibold mb-2">Recursos:</p>
                          <ul className="space-y-1">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="text-purple-300 text-sm flex items-center">
                                <span className="mr-2">•</span>
                                <span>
                                  {feature.serviceName}: {feature.dailyLimit === -1 ? 'Ilimitado' : `${feature.dailyLimit} diárias`}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <button
                      className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all ${
                        isCurrentPlan
                          ? 'bg-green-600 hover:bg-green-700 text-white cursor-default'
                          : isSubscribing && selectedPlanId === plan.id
                          ? 'bg-purple-700 text-purple-300 cursor-not-allowed'
                          : 'bg-purple-800 hover:bg-purple-900 text-white transform hover:scale-105'
                      }`}
                      onClick={() => {
                        if (isCurrentPlan) {
                          return;
                        }
                        handleSubscribe(plan.id, plan.price);
                      }}
                      disabled={isCurrentPlan || (isSubscribing && selectedPlanId === plan.id)}
                    >
                      {isSubscribing && selectedPlanId === plan.id
                        ? 'Processando...'
                        : isCurrentPlan 
                        ? 'Plano Atual' 
                        : plan.price === 0 
                          ? 'Usar Plano Gratuito' 
                          : 'Assinar Agora'
                      }
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

