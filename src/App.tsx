import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LogOutPage from './pages/logOut'
import RegisterPage from './pages/register'
import HomePage from './pages/HomePage'
import useAuthComposable from './composables/useAuth'
import LogInPage from './pages/logIn'

function App() {
  const [loading, setLoading] = useState(true)
  const { refresh } = useAuthComposable()

  useEffect(() => {
    ;(async () => {
      try {
        await refresh()
      } catch (err) {
        console.debug('refresh failed', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [refresh])

  if (loading) return <div>Loading...</div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogOutPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
