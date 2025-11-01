import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/authForm'

export default function RegisterPage() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: 24 }}>
      <h2>Enregistrement</h2>
      <AuthForm mode="register" onSuccess={() => navigate('/')} />
    </div>
  )
}
