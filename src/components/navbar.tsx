import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import useAuthComposable from '../composables/useAuth'

export default function Navbar() {
  const { isAuthenticated, user, login, logout } = useAuthComposable()
  const navigate = useNavigate()

  const items = [
    { label: 'Home', icon: 'pi pi-home', command: () => navigate('/') },
    // Garder l'inscription accessible même si non connecté
    { label: 'Register', icon: 'pi pi-user-plus', command: () => navigate('/register') },
  ]

  const end = isAuthenticated ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span>Bonjour {user?.username || 'Utilisateur'}</span>
      <Button label='Logout' icon='pi pi-sign-out' className='p-button-text' onClick={logout} />
    </div>
  ) : (
    <Button label='Login' icon='pi pi-sign-in' className='p-button-text' onClick={login} />
  )

  return (
    <div>
      <Menubar model={items} end={end} className='m-2 justify-between nav-menubar' />
    </div>
  )
}
