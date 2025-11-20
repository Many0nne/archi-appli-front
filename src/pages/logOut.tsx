import { useEffect, useRef } from 'react'
import useAuthComposable from '../composables/useAuth'

export default function LogOutPage() {
  const { logout, isAuthenticated } = useAuthComposable()
  const hasLoggedOut = useRef(false)

  useEffect(() => {
    if (isAuthenticated && !hasLoggedOut.current) {
      hasLoggedOut.current = true
      logout()
    }
  }, [logout, isAuthenticated])

  return (
    <div style={{ padding: 24 }}>
      <h2>Déconnexion en cours...</h2>
      <p>Vous allez être redirigé...</p>
    </div>
  )
}
