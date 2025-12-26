import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../Header/Header';

interface DefaultLayoutProps {
  children: ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {children}
      </main>
      <footer className="bg-purple-950/80 backdrop-blur-md border-t border-purple-900/50 mt-auto h-[150px]">
        <div className="container mx-auto px-1 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo-natal.png" alt="Tarot IA" className="w-30 h-30" />
            </Link>

            {/* Informações e Créditos */}
            <div className="text-purple-200 text-sm text-center md:text-right">
              <p>© {new Date().getFullYear()} Tarot PRO. Todos os direitos reservados.</p>
              <p className="mt-2 text-purple-300">
                Desenvolvido por{' '}
                <a
                  href="https://www.linkedin.com/in/caio-magalh%C3%A3es-de-faria-394239191/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-purple-200 underline transition-colors font-semibold"
                >
                  Caio Magalhães de Faria
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

