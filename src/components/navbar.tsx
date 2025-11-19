import { Menubar } from 'primereact/menubar'
import { useNavigate } from 'react-router-dom'
import useAuthComposable from '../composables/useAuth'

export default function Navbar() {
  const { isAuthenticated, user } = useAuthComposable()
  const navigate = useNavigate()

  const items = isAuthenticated
    ? [
        { label: 'Home', icon: 'pi pi-home', command: () => navigate('/') },
        {
          label: `Bonjour ${user?.username || 'Utilisateur'}`,
          icon: 'pi pi-user',
          disabled: true,
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => navigate('/logout'),
        },
      ]
    : [
        { label: 'Home', icon: 'pi pi-home', command: () => navigate('/') },
        { label: 'Login', icon: 'pi pi-sign-in', command: () => navigate('/login') },
        { label: 'Register', icon: 'pi pi-user-plus', command: () => navigate('/register') },
      ]

  return (
    <div>
      <Menubar model={items} className='m-2' />
    </div>
  )
}
