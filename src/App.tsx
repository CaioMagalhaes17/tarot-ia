import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DefaultLayout } from './components/Layout/DefaultLayout';
import { Home } from './pages/Home/Home';
import { NotFound } from './pages/NotFound/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <DefaultLayout>
              <Home />
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
    </BrowserRouter>
  );
}

export default App;
