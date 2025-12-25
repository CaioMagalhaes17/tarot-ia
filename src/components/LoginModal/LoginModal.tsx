import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../Modal/Modal';

declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_CLIENT_ID = '767695614738-ocj09in8rq8t101jbq88tij91kai406p.apps.googleusercontent.com';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  const handleCredentialResponse = useCallback(async (response: any) => {
    console.log('Google credential response received:', response);
    setError('');
    setIsLoading(true);
    
    try {
      // Verificar se é um erro do Google
      if (response.error) {
        console.error('Google Sign-In error:', response.error);
        throw new Error(`Erro do Google: ${response.error}${response.error_description ? ' - ' + response.error_description : ''}`);
      }
      
      if (!response || !response.credential) {
        throw new Error('Resposta do Google inválida: token não recebido');
      }
      
      console.log('Sending idToken to backend:', response.credential.substring(0, 50) + '...');
      await loginWithGoogle({ idToken: response.credential }, { redirect: false });
      onLoginSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error in Google login:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer login com Google');
      setIsLoading(false);
    }
  }, [loginWithGoogle, onLoginSuccess, onClose]);

  useEffect(() => {
    // Inicializar Google Identity Services quando o modal abrir
    if (isOpen) {
      const initializeGoogleSignIn = () => {
        if (window.google && window.google.accounts) {
          try {
            window.google.accounts.id.initialize({
              client_id: GOOGLE_CLIENT_ID,
              callback: handleCredentialResponse,
            });
            console.log('Google Identity Services initialized successfully in modal');
          } catch (error) {
            console.error('Error initializing Google Identity Services:', error);
            setError('Erro ao inicializar Google Sign-In');
          }
        }
      };

      // Verificar se o script do Google já foi carregado
      if (window.google && window.google.accounts) {
        initializeGoogleSignIn();
      } else {
        // Aguardar o script carregar
        let attempts = 0;
        const maxAttempts = 50; // 5 segundos (50 * 100ms)
        
        const checkGoogle = setInterval(() => {
          attempts++;
          if (window.google && window.google.accounts) {
            initializeGoogleSignIn();
            clearInterval(checkGoogle);
          } else if (attempts >= maxAttempts) {
            console.error('Google Identity Services script failed to load');
            setError('Google Sign-In não está disponível. Por favor, recarregue a página.');
            clearInterval(checkGoogle);
          }
        }, 100);
      }
    }
  }, [isOpen, handleCredentialResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password }, { redirect: false });
      setEmail('');
      setPassword('');
      onLoginSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Sign-In não está disponível. Por favor, recarregue a página.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Entrar">
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="modal-email" className="block text-white font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="modal-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-3 font-semibold bg-purple-900/50 border border-purple-800/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="modal-password" className="block text-white font-bold mb-2">
            Senha
          </label>
          <input
            type="password"
            id="modal-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 font-semibold bg-purple-900/50 border border-purple-800/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
            isLoading
              ? 'bg-purple-950/50 text-purple-400 cursor-not-allowed opacity-50'
              : 'bg-purple-800 hover:bg-purple-900 text-white transform hover:scale-105 shadow-lg cursor-pointer'
          }`}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="px-4 mt-6">
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-purple-800/50"></div>
          <span className="flex-shrink mx-4 text-purple-300 text-sm">ou</span>
          <div className="flex-grow border-t border-purple-800/50"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={`w-full mt-4 px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
            isLoading
              ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed opacity-50'
              : 'bg-white hover:bg-gray-100 text-gray-800 transform hover:scale-105 shadow-lg cursor-pointer'
          }`}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isLoading ? 'Autenticando...' : 'Continuar com Google'}
        </button>
      </div>

      <div className="mt-6 text-center mb-4">
        <p className="text-purple-200">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            onClick={onClose}
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </Modal>
  );
}

