import React, { useState, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import useAuthComposable from '../composables/useAuth'

type Mode = 'login' | 'register'

export default function AuthForm({ mode = 'login', onSuccess }: { mode?: Mode; onSuccess?: () => void }) {
  const toast = useRef<Toast>(null)
  const { login, register } = useAuthComposable()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        await login({ username, password })
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Connecté', life: 2000 })
      } else {
        await register({ username, password, email })
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Compte créé', life: 2000 })
      }
      onSuccess?.()
    } catch (err: any) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: err?.message ?? String(err), life: 4000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-fluid p-formgrid p-grid" style={{ maxWidth: 420, margin: '0 auto' }}>
      <Toast ref={toast} />
      <form onSubmit={submit} style={{ width: '100%' }}>
        <div className="p-field p-col-12">
          <label htmlFor="username">Nom d'utilisateur</label>
          <InputText id="username" value={username} onChange={(e) => setUsername(e.currentTarget.value)} />
        </div>

        {mode === 'register' && (
          <div className="p-field p-col-12" style={{ marginTop: 12 }}>
            <label htmlFor="email">Email</label>
            <InputText id="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
          </div>
        )}

        <div className="p-field p-col-12" style={{ marginTop: 12 }}>
          <label htmlFor="password">Mot de passe</label>
          <Password id="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} toggleMask />
        </div>

        <div className="p-field p-col-12" style={{ marginTop: 18 }}>
          <Button label={mode === 'login' ? 'Se connecter' : "S'enregistrer"} type="submit" loading={loading} />
        </div>
      </form>
    </div>
  )
}
