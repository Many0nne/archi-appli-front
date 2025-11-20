import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthComposable from '../composables/useAuth'

export default function Navbar() {
  const { isAuthenticated, user, login, logout } = useAuthComposable()
  const isAdmin = !!(user?.roles && Array.isArray(user.roles) && user.roles.includes('ADMIN'))
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="nav-menubar fixed top-0 left-0 right-0 z-50">
      <nav className={`flex items-center justify-between rounded px-6 py-6 h-20 transition-colors duration-200 ${scrolled ? 'bg-black/60 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
        
        
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-base font-medium px-4 py-2 rounded hover:cursor-pointer hover:transform hover:scale-105 transition-all duration-150"
            style={{ color: '#F9E8CA', letterSpacing: '0.06em' }}
          >
            <i className="pi pi-home" aria-hidden />
            <span>Home</span>
          </button>
          <button
            onClick={() => navigate('/spectacles')}
            className="flex items-center gap-2 text-base font-medium px-4 py-2 rounded hover:cursor-pointer hover:transform hover:scale-105 transition-all duration-150"
            style={{ color: '#F9E8CA', letterSpacing: '0.06em' }}
          >
            <i className="pi pi-calendar" aria-hidden />
            <span>Spectacles</span>
          </button>
          <button
            onClick={() => navigate('/reservations')}
            className="flex items-center gap-2 text-base font-medium px-4 py-2 rounded hover:cursor-pointer hover:transform hover:scale-105 transition-all duration-150"
            style={{ color: '#F9E8CA', letterSpacing: '0.06em' }}
          >
            <i className="pi pi-ticket" aria-hidden />
            <span>Mes réservations</span>
          </button>
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 text-base font-medium px-4 py-2 rounded hover:cursor-pointer hover:transform hover:scale-105 transition-all duration-150"
              style={{ color: '#F9E8CA', letterSpacing: '0.06em' }}
            >
              <i className="pi pi-cog" aria-hidden />
              <span>Admin</span>
            </button>
          )}
        </div>

        
        <div className="md:hidden">
          <button
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="p-2 rounded text-[#F9E8CA]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="#F9E8CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        
        <div className="hidden md:flex items-center gap-3">
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

        
        {open && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/60 backdrop-blur-sm shadow mt-2 rounded-b text-[#F9E8CA]">
            <div className="flex flex-col p-4 gap-2">
              <button onClick={() => { navigate('/'); setOpen(false) }} className="text-left px-3 py-2 rounded hover:bg-white/10">Home</button>
              <button onClick={() => { navigate('/register'); setOpen(false) }} className="text-left px-3 py-2 rounded hover:bg-white/10">Register</button>
              {isAdmin && <button onClick={() => { navigate('/admin'); setOpen(false) }} className="text-left px-3 py-2 rounded hover:bg-white/10">Admin</button>}
              <div className="border-t border-white/20 mt-2 pt-2">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <span>Bonjour {user?.username || 'Utilisateur'}</span>
                    <button onClick={() => { logout(); setOpen(false) }} className="px-3 py-1 rounded hover:bg-white/10">Logout</button>
                  </div>
                ) : (
                  <button onClick={() => { login(); setOpen(false) }} className="px-3 py-2 rounded text-left hover:bg-white/10">Login</button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

