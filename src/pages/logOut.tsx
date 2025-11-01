import { useEffect } from 'react'
import { useAuth } from '../stores/useAuth'

export default function LogOutPage() {
  const logout = useAuth(s => s.logout)

  useEffect(() => {
    logout()
    // appeler le backend pour invalider le refresh token une fois implémenté
  }, [logout])

  return (
    <div style={{ padding: 24 }}>
      <h2>Déconnecté</h2>
      <p>Vous êtes maintenant déconnecté.</p>
    </div>
  )
}
