// Export client
export { apiClient } from './client';

// Export API modules
export { authApi } from './auth';
export { tarotApi } from './tarot';
export { subscriptionsApi } from './subscriptions';

// Export types
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  TarotSession,
  TarotSessionStatus,
  TarotCard,
  CreateTarotSessionRequest,
  CreateTarotSessionResponse,
  ListTarotSessionsResponse,
  ListTarotSessionsParams,
  DrawCardsRequest,
  DrawCardsResponse,
  InterpretResponse,
  AvailableCard,
  AvailableCardsResponse,
  SubscriptionPlan,
  Subscription,
  BillingPeriod,
  SubscriptionStatus,
  ServiceLimit,
  PaymentMethod,
  CardData,
  SubscribeRequest,
  SubscribeResponse,
  PaymentResponse,
} from './types';

