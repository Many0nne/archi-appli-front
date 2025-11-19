import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/authForm'
import useAuthComposable from '../composables/useAuth'
import type { RegisterData } from '../types/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuthComposable()

  const handleSubmit = async (payload: RegisterData | { username: string; password: string; email?: string }) => {
    // Accept either a full RegisterData or a loose payload with optional email
    return register({ username: payload.username, password: payload.password, email: payload.email ?? '' })
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Enregistrement</h2>
      <AuthForm mode="register" onSuccess={() => navigate('/')} onSubmit={handleSubmit} />
    </div>
  )
}
