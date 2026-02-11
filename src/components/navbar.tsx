import { useNavigate } from 'react-router-dom'
import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import useAuthComposable from '../composables/useAuth'

export default function Navbar() {
  const { isAuthenticated, user, login, logout } = useAuthComposable()
  const isAdmin = !!(user?.roles && Array.isArray(user.roles) && user.roles.includes('ADMIN'))
  const navigate = useNavigate()

  const items: any[] = [
    { label: 'Home', icon: 'pi pi-home', command: () => navigate('/') },
    { label: 'Spectacles', icon: 'pi pi-calendar', command: () => navigate('/spectacles') },
  ]

  if (isAuthenticated) {
    items.push({ label: 'Mes réservations', icon: 'pi pi-ticket', command: () => navigate('/reservations') })
  }

  if (isAdmin) {
    items.push({ label: 'Admin', icon: 'pi pi-cog', command: () => navigate('/admin') })
  }

  const end = (
    <div className="flex items-center gap-3">
      {isAuthenticated ? (
        <>
          <span className="mr-3">Bonjour {user?.username || 'Utilisateur'}</span>
          <Button label="Logout" icon="pi pi-sign-out" className="p-button-text p-button-plain" onClick={logout} />
        </>
      ) : (
        <Button label="Login" icon="pi pi-sign-in" className="p-button-text p-button-plain" onClick={login} />
      )}
    </div>
  )

  return (
    <header className="nav-menubar fixed top-0 left-0 right-0 z-50 p-2">
        <Menubar model={items} end={end} className="shadow-sm justify-between" />
    </header>
  )
}

