import { useNavigate } from 'react-router-dom'
import AuthForm from '../components/authForm'

export default function LogInPage() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: 24 }}>
      <h2>Connexion</h2>
      <AuthForm mode="login" onSuccess={() => navigate('/')} />
    </div>
  )
}
