import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { DefaultLayout } from './components/Layout/DefaultLayout';
import { Home } from './pages/Home/Home';
import { NotFound } from './pages/NotFound/NotFound';
import { Tarot } from './pages/Tarot/Tarot';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { SnowEffect } from './components/SnowEffect';
import { Sessions } from './pages/Sessions';
const GOOGLE_CLIENT_ID = '767695614738-ocj09in8rq8t101jbq88tij91kai406p.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <SnowEffect snowflakeCount={20} active={true} />
          <Routes>
          <Route
            path="/"
            element={
              <DefaultLayout>
                <Home />
              </DefaultLayout>
            }
          />
          <Route
            path="/login"
            element={
              <DefaultLayout>
                <Login />
              </DefaultLayout>
            }
          />
          <Route
            path="/register"
            element={
              <DefaultLayout>
                <Register />
              </DefaultLayout>
            }
          />
          <Route
            path="/tarot"
            element={
              <DefaultLayout>
                <Tarot />
              </DefaultLayout>
            }
          />
          <Route
            path="/sessions"
            element={
              <DefaultLayout>
                <Sessions />
              </DefaultLayout>
            }
          />
          {/* TODO: Adicionar outras rotas */}
          <Route
            path="*"
            element={
              <DefaultLayout>
                <NotFound />
              </DefaultLayout>
            }
          />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
