import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import esES from 'antd/locale/es_ES';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import TitularesPage from './pages/TitularesPage';
import VehiculosPage from './pages/VehiculosPage';
import ActasPage from './pages/ActasPage';
import NuevaActaPage from './pages/NuevaActaPage';
import DetalleActaPage from './pages/DetalleActaPage';
import DashboardPage from './pages/DashboardPage';
import TiposInfraccionPage from './pages/TiposInfraccionPage';

function App() {
  return (
    <ConfigProvider
      locale={esES}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#4f46e5',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        },
      }}
    >
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                {/* Accesible por todos los roles */}
                <Route path="/actas" element={<ActasPage />} />
                <Route path="/actas/:id" element={<DetalleActaPage />} />
                <Route path="/titulares" element={<TitularesPage />} />
                <Route path="/vehiculos" element={<VehiculosPage />} />

                {/* Solo inspector */}
                <Route element={<ProtectedRoute roles={['inspector']} />}>
                  <Route path="/actas/nueva" element={<NuevaActaPage />} />
                </Route>

                {/* Solo administrativo */}
                <Route element={<ProtectedRoute roles={['administrativo']} />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/tipos-infraccion" element={<TiposInfraccionPage />} />
                </Route>
              </Route>
            </Route>

            {/* Redirect */}
            <Route path="*" element={<Navigate to="/actas" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
