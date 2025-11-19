import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LogOutPage from './pages/logOut'
import RegisterPage from './pages/register'
import HomePage from './pages/HomePage'
import LogInPage from './pages/logIn'
import KeycloakProvider from './components/KeycloakProvider'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <KeycloakProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LogInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<LogOutPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </KeycloakProvider>
  )
}

export default App
