import React, { useState, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import type { AuthFormPayload, Mode } from '../types'

export default function AuthForm({
  mode = 'login',
  onSuccess,
  onSubmit,
}: {
  mode?: Mode
  onSuccess?: () => void
  onSubmit?: (payload: AuthFormPayload) => Promise<any>
}) {
  const toast = useRef<Toast>(null)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    try {
      if (!onSubmit) throw new Error('No submit handler provided')
      const payload: AuthFormPayload = { username, password, email: email || undefined }
      await onSubmit(payload)
      toast.current?.show({ severity: 'success', summary: 'Success', detail: mode === 'login' ? 'Connecté' : 'Compte créé', life: 2000 })
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
