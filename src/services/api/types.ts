// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
  };
}

export interface GoogleLoginRequest {
  token: string;
}

export interface GoogleLoginResponse extends LoginResponse {}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
}

// Tarot Types
export type TarotSessionStatus = 'CREATED' | 'CARDS_DRAWN' | 'INTERPRETED';

export interface TarotCard {
  id: string;
  name: string;
  position: number;
  isReversed: boolean;
}

export interface TarotSession {
  id: string;
  userId: string;
  theme: string;
  status: TarotSessionStatus;
  cards: TarotCard[];
  interpretation: string | null;
  createdAt: string;
  cardsDrawnAt: string | null;
  interpretedAt: string | null;
}

export interface CreateTarotSessionRequest {
  theme: string;
}

export interface CreateTarotSessionResponse {
  id: string;
  theme: string;
  status: TarotSessionStatus;
  userId: string;
  cards: TarotCard[];
  interpretation: string | null;
  createdAt: string;
  cardsDrawnAt: string | null;
  interpretedAt: string | null;
}

export interface ListTarotSessionsResponse {
  sessions: TarotSession[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListTarotSessionsParams {
  page?: number;
  limit?: number;
}

export interface DrawCardsRequest {
  selectedCardIds: string[];
}

export interface AvailableCard {
  id: string;
  name: string;
  category: 'MAJOR_ARCANA' | 'MINOR_ARCANA';
}

export interface AvailableCardsResponse {
  cards: AvailableCard[];
}

export interface DrawCardsResponse {
  id: string;
  userId: string;
  theme: string;
  status: TarotSessionStatus;
  cards: TarotCard[];
  interpretation: string | null;
  createdAt: string;
  cardsDrawnAt: string | null;
  interpretedAt: string | null;
}

export interface InterpretResponse {
  id: string;
  userId: string;
  theme: string;
  status: TarotSessionStatus;
  cards: TarotCard[];
  interpretation: string;
  createdAt: string;
  cardsDrawnAt: string | null;
  interpretedAt: string;
}

// Subscription Types
export type BillingPeriod = 'MONTHLY' | 'YEARLY';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'TRIAL' | 'PENDING_PAYMENT';

export interface ServiceLimit {
  serviceName: string;
  dailyLimit: number;
  monthlyLimit: number | null;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number; // em centavos
  billingPeriod: BillingPeriod;
  features: ServiceLimit[];
  globalDailyLimit: number | null; // null = sem limite global, -1 = ilimitado
  isActive: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string | null;
  cancelledAt: string | null;
  createdAt: string;
  paymentId: string | null;
}

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX';

export interface CardData {
  cardNumber: string;
  cardHolderName: string;
  expirationMonth: number;
  expirationYear: number;
  cvv: string;
}

export interface SubscribeRequest {
  planId: string;
  paymentMethod?: PaymentMethod;
  cardData?: CardData;
  cpfCnpj?: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: string;
  transactionId: string;
  message: string;
  qrCode?: string; // data:image/png;base64,...
  pixCode?: string;
}

export interface SubscribeResponse {
  subscription: Subscription;
  plan: SubscriptionPlan;
  payment: PaymentResponse;
}

