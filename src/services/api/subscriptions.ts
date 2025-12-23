import { apiClient } from './client';
import type { SubscriptionPlan, Subscription, SubscribeRequest, SubscribeResponse } from './types';

export const subscriptionsApi = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.request<{plans:SubscriptionPlan[]}>('/subscriptions/plans', {
      method: 'GET',
    });
    return response.plans
  },

  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      const response = await apiClient.request<{subscription:Subscription}>('/subscriptions/current', {
        method: 'GET',
      });
      return response.subscription
    } catch (error) {
      // Se não houver assinatura ou erro 404, retorna null
      if (error instanceof Error) {
        const errorWithStatus = error as Error & { status?: number };
        if (errorWithStatus.status === 404) {
          return null;
        }
      }
      throw error;
    }
  },

  async subscribe(data: SubscribeRequest): Promise<SubscribeResponse> {
    return apiClient.request<SubscribeResponse>('/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

