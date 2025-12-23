import { apiClient } from './client';
import type {
  CreateTarotSessionRequest,
  CreateTarotSessionResponse,
  ListTarotSessionsResponse,
  ListTarotSessionsParams,
  TarotSession,
  DrawCardsRequest,
  DrawCardsResponse,
  AvailableCardsResponse,
  InterpretResponse,
} from './types';

export const tarotApi = {
  async createSession(data: CreateTarotSessionRequest): Promise<CreateTarotSessionResponse> {
    return apiClient.request<CreateTarotSessionResponse>('/tarot/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async listSessions(params?: ListTarotSessionsParams): Promise<ListTarotSessionsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/tarot/sessions${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.request<ListTarotSessionsResponse>(endpoint, {
      method: 'GET',
    });
  },

  async getSessionById(id: string): Promise<TarotSession> {
    return apiClient.request<TarotSession>(`/tarot/sessions/${id}`, {
      method: 'GET',
    });
  },

  async drawCards(sessionId: string, data: DrawCardsRequest): Promise<DrawCardsResponse> {
    return apiClient.request<DrawCardsResponse>(`/tarot/sessions/${sessionId}/draw-cards`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getAvailableCards(limit?: number): Promise<AvailableCardsResponse> {
    const query = new URLSearchParams();
    if (limit) query.append('limit', limit.toString());
    const queryString = query.toString();
    return apiClient.request<AvailableCardsResponse>(`/tarot/cards/available${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  },

  async interpret(sessionId: string): Promise<InterpretResponse> {
    return apiClient.request<InterpretResponse>(`/tarot/sessions/${sessionId}/interpret`, {
      method: 'POST',
    });
  },
};

