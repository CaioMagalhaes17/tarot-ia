import { useState, useEffect, useCallback } from 'react';
import { subscriptionsApi, type SubscriptionPlan, type Subscription, type SubscribeResponse } from '../../services/api';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlansModal({ isOpen, onClose }: PlansModalProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeResponse, setSubscribeResponse] = useState<SubscribeResponse | null>(null);
  const [plansMinimized, setPlansMinimized] = useState(false);
  const [plansExpanded, setPlansExpanded] = useState(false);
  const [qrCodeExpanded, setQrCodeExpanded] = useState(true);

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

  useEffect(() => {
    if (isOpen) {
      loadPlans();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loadPlans]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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
    
    try {
      // Se for plano gratuito, não precisa de método de pagamento
      if (price === 0) {
        const response = await subscriptionsApi.subscribe({ planId });
        setSubscribeResponse(response);
        setPlansMinimized(true);
        setPlansExpanded(false);
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
        setPlansMinimized(true);
        setPlansExpanded(false);
        setQrCodeExpanded(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao assinar plano');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleClose = () => {
    // Resetar estados ao fechar
    setSubscribeResponse(null);
    setPlansMinimized(false);
    setPlansExpanded(false);
    setQrCodeExpanded(true);
    setError(null);
    onClose();
  };

  const togglePlansExpanded = () => {
    setPlansExpanded(!plansExpanded);
  };

  const toggleQrCodeExpanded = () => {
    setQrCodeExpanded(!qrCodeExpanded);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-[10000] w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-purple-950/95 backdrop-blur-md rounded-lg border border-purple-900/50 shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-purple-900/50">
            <h2 className="text-5xl font-bold text-white">Atualize seu Plano</h2>
            <button
              onClick={handleClose}
              className="text-purple-300 hover:text-white transition-colors text-2xl font-bold"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-white text-lg">Carregando planos...</div>
              </div>
            ) : error ? (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
                <p className="text-red-200">{error}</p>
                <button
                  onClick={loadPlans}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Seção de Planos com botão de expandir/colapsar */}
                <div>
                  {plansMinimized && (
                    <button
                      onClick={togglePlansExpanded}
                      className="w-full flex items-center justify-between mb-4 p-4 bg-purple-900/50 backdrop-blur-sm rounded-lg border border-purple-800/50 hover:border-purple-600/50 transition-all"
                    >
                      <span className="text-purple-200 text-lg font-semibold">
                        Planos Disponíveis
                      </span>
                      <span className="text-purple-300 text-2xl transition-transform duration-300">
                        {plansExpanded ? '▲' : '▼'}
                      </span>
                    </button>
                  )}
                  
                  {!plansMinimized && (
                    <p className="text-purple-200 text-center text-2xl mb-5">
                      Você atingiu o limite diário do seu plano. Escolha um plano para continuar:
                    </p>
                  )}
                  
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ${
                    plansMinimized && !plansExpanded ? 'hidden' : 'block'
                  }`}>
                  {plans && plans.map((plan) => {
                    const isCurrentPlan = currentSubscription?.planId === plan.id && 
                                         (currentSubscription.status === 'ACTIVE' || 
                                          currentSubscription.status === 'TRIAL');
                    
                    return (
                      <div
                        key={plan.id}
                        className={`backdrop-blur-sm rounded-lg p-6 border transition-all flex flex-col ${
                          isCurrentPlan
                            ? 'bg-purple-800/70 border-purple-500 ring-2 ring-purple-400'
                            : 'bg-purple-900/50 border-purple-800/50 hover:border-purple-600/50'
                        }`}
                      >
                        {isCurrentPlan && (
                          <div className="mb-3 text-center">
                            <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                              ✓ Plano Atual
                            </span>
                          </div>
                        )}
                        
                        <div className="text-center mb-4">
                          <div className="text-4xl mb-2">{getPlanIcon(plan.name)}</div>
                          <h3 className="text-3xl font-bold text-white mb-2">{plan.name}</h3>
                          <div className="text-3xl font-bold text-purple-300 mb-2">
                            {formatPrice(plan.price)}
                          </div>
                          {plan.billingPeriod === 'MONTHLY' && (
                            <span className="text-purple-300 text-sm">/mês</span>
                          )}
                          {plan.billingPeriod === 'YEARLY' && (
                            <span className="text-purple-300 text-sm">/ano</span>
                          )}
                        </div>

                        <div className="space-y-3 mb-6 flex-grow">
                          <div className="text-center">
                            <p className="text-purple-200 text-sm mb-1">Limite Diário</p>
                            <p className="text-white font-semibold">
                              {getLimitText(plan.globalDailyLimit)}
                            </p>
                          </div>

                          {plan.description && (
                            <p className="text-purple-300 text-sm text-center">
                              {plan.description}
                            </p>
                          )}
                        </div>

                        <button
                          className={`w-full px-4 py-3 rounded-lg font-semibold cursor-pointer transition-all ${
                            isCurrentPlan
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-purple-800 hover:bg-purple-900 text-white transform hover:scale-105'
                          }`}
                          onClick={() => {
                            if (isCurrentPlan) {
                              return; // Não fazer nada se já for o plano atual
                            }
                            handleSubscribe(plan.id, plan.price);
                          }}
                          disabled={isCurrentPlan || isSubscribing}
                        >
                          {isSubscribing
                            ? 'Processando...'
                            : isCurrentPlan 
                              ? 'Plano Atual' 
                              : plan.price === 0 
                                ? 'Usar Plano' 
                                : 'Assinar Agora'
                          }
                        </button>
                      </div>
                    );
                  })}
                  </div>
                </div>

                {/* QR Code do PIX com botão de expandir/colapsar */}
                {subscribeResponse && subscribeResponse.payment.qrCode && (
                  <div className="mt-6 space-y-4">
                    <button
                      onClick={toggleQrCodeExpanded}
                      className="w-full flex items-center justify-between p-4 bg-purple-900/50 backdrop-blur-sm rounded-lg border border-purple-800/50 hover:border-purple-600/50 transition-all"
                    >
                      <span className="text-purple-200 text-lg font-semibold">
                        Pagamento PIX
                      </span>
                      <span className="text-purple-300 text-2xl transition-transform duration-300">
                        {qrCodeExpanded ? '▲' : '▼'}
                      </span>
                    </button>
                    
                    {qrCodeExpanded && (
                      <div className="bg-purple-900/50 backdrop-blur-sm rounded-lg p-6 border border-purple-800/50">
                        <h3 className="text-4xl font-bold text-white mb-4 text-center">
                          Escaneie o QR Code
                        </h3>
                        
                        <div className="flex flex-col items-center space-y-4">
                          <div className="bg-white p-4 rounded-lg">
                            <img
                              src={subscribeResponse.payment.qrCode}
                              alt="QR Code PIX"
                              className="w-64 h-64"
                            />
                          </div>
                          
                          {subscribeResponse.payment.pixCode && (
                            <div className="w-full max-w-md">
                              <p className="text-purple-200 text-sm mb-2 text-center">
                                Ou copie o código PIX:
                              </p>
                              <div className="flex items-center space-x-2 bg-purple-950/50 rounded-lg p-3 border border-purple-800/50">
                                <code className="flex-1 text-purple-200 text-xs break-all">
                                  {subscribeResponse.payment.pixCode}
                                </code>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(subscribeResponse.payment.pixCode || '');
                                    alert('Código PIX copiado!');
                                  }}
                                  className="px-3 py-1 bg-purple-800 hover:bg-purple-900 text-white rounded text-sm transition-colors"
                                >
                                  Copiar
                                </button>
                              </div>
                            </div>
                          )}
                          
                          <p className="text-purple-300 text-sm text-center">
                            {subscribeResponse.payment.message}
                          </p>
                          
                          <p className="text-purple-400 text-xs text-center">
                            Após o pagamento, sua assinatura será ativada automaticamente.
                          </p>
                          
                          <button
                            onClick={handleClose}
                            className="mt-4 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                          >
                            Confirmar Pagamento
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mensagem de sucesso para plano gratuito */}
                {/* {subscribeResponse && !subscribeResponse.payment.qrCode && (
                  <div className="mt-6">
                    <div className="bg-green-900/50 border border-green-700/50 rounded-lg p-6 text-center">
                      <p className="text-green-200 text-lg mb-2">
                        ✓ Plano ativado com sucesso!
                      </p>
                      <p className="text-green-300 text-sm">
                        Você já pode usar o serviço.
                      </p>
                    </div>
                  </div>
                )} */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

