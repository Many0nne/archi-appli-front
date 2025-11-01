import { Menubar } from 'primereact/menubar'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../stores/useAuth'

export default function Navbar() {
  const token = useAuth(s => s.token)
  const logout = useAuth(s => s.logout)
  const navigate = useNavigate()

  const items = token
    ? [
        { label: 'Home', icon: 'pi pi-home', command: () => navigate('/') },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => {
            logout()
            navigate('/login')
          },
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
