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

    console.log(`Making request to: ${API_BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: { ...headers, Authorization: headers['Authorization'] ? 'Bearer ***' : 'none' },
    });

    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (networkError) {
      console.error('Network error:', networkError);
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    }

    console.log(`Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorData;
      try {
        const text = await response.text();
        console.error('Error response body:', text);
        errorData = text ? JSON.parse(text) : { message: 'Erro na requisição' };
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        errorData = { message: `Erro: ${response.statusText} (${response.status})` };
      }

      const errorWithStatus = new Error(errorData.message || `Erro: ${response.statusText}`);
      (errorWithStatus as any).status = response.status;
      throw errorWithStatus;
    }

    try {
      const data = await response.json();
      console.log('Response data received');
      return data;
    } catch (parseError) {
      console.error('Error parsing success response:', parseError);
      throw new Error('Resposta inválida do servidor');
    }
  }
}

export const apiClient = new ApiClient();

