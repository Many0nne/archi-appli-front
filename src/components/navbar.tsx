import { useNavigate } from 'react-router-dom'
import useAuthComposable from '../composables/useAuth'

export default function Navbar() {
  const { isAuthenticated, user, login, logout } = useAuthComposable()
  const navigate = useNavigate()

  return (
    <header className="nav-menubar fixed top-0 left-0 right-0 z-50">
      <nav className="flex items-center justify-between bg-transparent rounded px-6 py-6 h-20">
        {/* Menu items (no logo) */}

        {/* Center: menu items */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-base font-medium px-4 py-2 rounded"
            style={{ color: '#F9E8CA', letterSpacing: '0.06em' }}
          >
            <i className="pi pi-home" aria-hidden />
            <span>Home</span>
          </button>
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-2 text-base font-medium px-4 py-2 rounded"
            style={{ color: '#F9E8CA', letterSpacing: '0.06em' }}
          >
            <i className="pi pi-user-plus" aria-hidden />
            <span>Register</span>
          </button>
        </div>

        {/* End: auth actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-base" style={{ color: '#F9E8CA', letterSpacing: '0.06em' }}>
                Bonjour {user?.username || 'Utilisateur'}
              </span>
              <button
                onClick={logout}
                className="text-sm px-4 py-2 rounded bg-transparent border border-neutral-300 hover:bg-neutral-100 flex items-center gap-2"
                style={{ color: '#F9E8CA', letterSpacing: '0.06em' }}
              >
                <i className="pi pi-sign-out" aria-hidden />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="text-sm px-4 py-2 rounded bg-primary hover:opacity-95 flex items-center gap-2"
              style={{ color: '#F9E8CA', letterSpacing: '0.06em' }}
            >
              <i className="pi pi-sign-in" aria-hidden />
              <span>Login</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}

