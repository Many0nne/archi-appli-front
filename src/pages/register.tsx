import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthComposable from '../composables/useAuth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuthComposable()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    } else {
      register()
    }
  }, [isAuthenticated, register, navigate])

  return (
    <div style={{ padding: 24 }}>
      <h2>Redirection vers l'inscription Keycloak...</h2>
    </div>
  )
}
