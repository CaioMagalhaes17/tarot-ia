import { type ReactNode } from 'react';
import { Header } from '../Header/Header';

interface DefaultLayoutProps {
  children: ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-purple-950/80 backdrop-blur-md border-t border-purple-900/50 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🔮</div>
              <span className="text-white font-semibold">Tarot IA</span>
            </div>
            <div className="text-purple-200 text-sm text-center md:text-right">
              <p>© {new Date().getFullYear()} Tarot IA. Todos os direitos reservados.</p>
              <p className="mt-1">
                Serviços de tarologia com Inteligência Artificial
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

