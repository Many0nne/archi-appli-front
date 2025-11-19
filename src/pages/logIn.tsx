import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthComposable from '../composables/useAuth'

export default function LogInPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthComposable()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    } else {
      login()
    }
  }, [isAuthenticated, login, navigate])

  return (
    <div style={{ padding: 24 }}>
      <h2>Redirection vers Keycloak...</h2>
    </div>
  )
}
