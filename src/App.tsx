import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DefaultLayout } from './components/Layout/DefaultLayout';
import { Home } from './pages/Home/Home';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
