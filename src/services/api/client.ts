const API_BASE_URL = 'https://anon-pix.fly.dev';
// http://localhost:3000
// https://anon-pix.fly.dev

class ApiClient {
  private getToken(): string | null {
    const token = localStorage.getItem('token');
    // Verificar se o token não é null, undefined ou a string "undefined"
    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      return token;
    }
    return null;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    // Construir headers base
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Mesclar headers customizados (se houver)
    const customHeaders = options.headers as Record<string, string> | Headers | undefined;
    if (customHeaders) {
      if (customHeaders instanceof Headers) {
        customHeaders.forEach((value, key) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, customHeaders);
      }
    }

    // Adicionar token apenas se existir e não for vazio
    if (token && token.trim() !== '' && token !== 'undefined') {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('Token não encontrado ou inválido no localStorage para requisição:', endpoint);
      console.warn('Token value:', token);
    }

    console.log('Request headers:', { 
      ...headers, 
      Authorization: headers['Authorization'] ? 'Bearer ***' : 'none' 
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro na requisição' }));
      const errorWithStatus = new Error(error.message || `Erro: ${response.statusText}`);
      (errorWithStatus as any).status = response.status;
      throw errorWithStatus;
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();

