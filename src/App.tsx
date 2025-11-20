import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LogOutPage from './pages/logOut'
import RegisterPage from './pages/register'
import HomePage from './pages/HomePage'
import LogInPage from './pages/logIn'
import KeycloakProvider from './components/KeycloakProvider'
import RequireRole from './components/RequireRole'
import SpectaclesPage from './pages/spectacles'
import AdminPage from './pages/admin'
import ReservationsPage from './pages/reservations'

function App() {
  return (
    <KeycloakProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LogInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<LogOutPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/spectacles" element={<SpectaclesPage />} />
          <Route path="/admin" element={<RequireRole role="ADMIN"><AdminPage /></RequireRole>} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </KeycloakProvider>
  )
}

export default App
