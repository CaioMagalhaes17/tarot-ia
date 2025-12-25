import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    setError('');
    setIsLoading(true);
    try {
      if (credential === '') throw new Error('Credencial de resposta do google não definida')
      await loginWithGoogle(credential)
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          🔮 Criar Conta
        </h1>
        <p className="text-xl text-purple-200">
          Comece sua jornada mística
        </p>
      </div>

      <div className="bg-purple-950/50 backdrop-blur-sm rounded-lg p-8 border border-purple-900/50">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-white font-bold mb-2">
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              className="w-full px-4 py-3 font-semibold bg-purple-900/50 border border-purple-800/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-white font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 font-semibold bg-purple-900/50 border border-purple-800/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white font-bold mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-3 font-semibold bg-purple-900/50 border border-purple-800/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-white font-bold mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite a senha novamente"
              className="w-full px-4 py-3 font-semibold bg-purple-900/50 border border-purple-800/50 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-8 py-4 rounded-lg font-semibold text-lg transition-all ${isLoading
              ? 'bg-purple-950/50 text-purple-400 cursor-not-allowed opacity-50'
              : 'bg-purple-800 hover:bg-purple-900 text-white transform hover:scale-105 shadow-lg cursor-pointer'
              }`}
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          <div className="px-4">
            <div className="relative flex items-center mb-4">
              <div className="flex-grow border-t border-purple-800/50"></div>
              <span className="flex-shrink mx-4 text-purple-300 text-sm">ou</span>
              <div className="flex-grow border-t border-purple-800/50"></div>
            </div>


            <GoogleLogin onSuccess={
              async (response) => await handleGoogleLogin(response.credential || '')
            }
              onError={() => console.log('login failed')}
              text='signup_with'
              shape='circle'
              auto_select={true}
            />


          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-purple-200">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

