import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-purple-950/80 backdrop-blur-md border-b border-purple-900/50 shadow-lg">
      <nav className="container h-[90px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 mt-10 group">
            <img src="/logo.png" alt="Tarot IA" className="w-20 h-20" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 mt-6 text-xl">
            
            <Link
              to="/tarot"
              className="text-purple-100 hover:text-white transition-colors font-medium"
            >
              Tarot
            </Link>
            <Link
              to="/subscriptions"
              className="text-purple-100 hover:text-white transition-colors font-medium"
            >
              Planos
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/sessions"
                  className="text-purple-100 hover:text-white transition-colors font-medium"
                >
                  Minhas Sessões
                </Link>
                <div className="flex items-center space-x-4 ml-20">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center text-white font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-purple-100 font-bold">
                      {user?.name || 'Usuário'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 ml-5 text-white rounded-lg transition-colors font-medium"
                  >
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-purple-100 hover:text-white transition-colors font-medium"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white rounded-lg transition-colors font-medium"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-purple-100 hover:text-white p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-900/50">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-purple-100 hover:text-white transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                to="/tarot"
                className="text-purple-100 hover:text-white transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Tarot
              </Link>
              <Link
                to="/subscriptions"
                className="text-purple-100 hover:text-white transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Planos
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/sessions"
                    className="text-purple-100 hover:text-white transition-colors font-medium px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Minhas Sessões
                  </Link>
                  <div className="pt-4 border-t border-purple-900/50">
                    <div className="flex items-center space-x-2 px-2 py-2">
                      <div className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-purple-100 text-sm">
                        {user?.name || 'Usuário'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-left"
                    >
                      Sair
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t border-purple-900/50 flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-purple-100 hover:text-white transition-colors font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white rounded-lg transition-colors font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

