import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, type User, type LoginRequest, type RegisterRequest } from '../services/api';
import { loginWithGoogle as loginWithGoogleAPI } from '../services/api/google-login';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (accessToken: string, options?: { redirect?: boolean }) => Promise<void>
  login: (data: LoginRequest, options?: { redirect?: boolean }) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(userData);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest, options?: { redirect?: boolean }) => {
    const response = await authApi.login(data);

    if (response.accessToken && response.accessToken.trim() !== '') {
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } else {
      throw new Error('Token não recebido do servidor');
    }

    if (options?.redirect !== false) {
      navigate('/');
    }
  };

  const loginWithGoogle = async (accessToken: string, options?: { redirect?: boolean }) => {
    console.log('token', accessToken)
    const response = await loginWithGoogleAPI(accessToken);
    console.log('REPONSE', response)
    if (response.accessToken && response.accessToken.trim() !== '') {
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } else {
      throw new Error('Token não recebido do servidor');
    }

    // Só redireciona se não for especificado ou se redirect for true
    if (options?.redirect !== false) {
      navigate('/');
    }
  };

  const register = async (data: RegisterRequest) => {
    await authApi.register(data);
    await login({ email: data.email, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const verifyEmail = async (token: string) => {
    await authApi.verifyEmail(token);
    if (user) {
      setUser({ ...user, emailVerified: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

