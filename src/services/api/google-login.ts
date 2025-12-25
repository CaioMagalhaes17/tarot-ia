import { apiClient } from "./client";
import type { LoginResponse } from "./types";

export async function loginWithGoogle(accessToken: string): Promise<LoginResponse> {
  const response = await apiClient.request<LoginResponse>('/users/login/google', {
    method: 'POST',
    body: JSON.stringify({ idToken: accessToken }),
  });
  console.log('respostad da api', response)
  return response
}