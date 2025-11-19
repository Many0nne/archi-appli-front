import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/authForm'
import useAuthComposable from '../composables/useAuth'
import type { Credentials } from '../types/auth'

export default function LogInPage() {
  const navigate = useNavigate()
  const { login } = useAuthComposable()

  const handleSubmit = async (payload: Credentials) => {
    return login(payload)
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Connexion</h2>
      <AuthForm mode="login" onSuccess={() => navigate('/')} onSubmit={handleSubmit} />
    </div>
  )
}
