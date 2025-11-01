import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LogInPage from './pages/login'
import LogOutPage from './pages/logOut'
import RegisterPage from './pages/register'
import Home from './pages/index'
import useAuthComposable from './composables/useAuth'

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
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
