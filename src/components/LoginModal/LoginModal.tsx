import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../Modal/Modal';

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
  const { login } = useAuth();

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

