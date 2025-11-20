import { Dialog } from 'primereact/dialog'
import { InputNumber } from 'primereact/inputnumber'
import { Toast } from 'primereact/toast'
import { useEffect, useRef, useState } from 'react'
import type { Spectacle } from '../types/spectacle'
import { getSpectacle } from '../composables/useSpectable'
import ButtonT from './button'
import { createReservation } from '../composables/useReservation'
import useAuthComposable from '../composables/useAuth'
import { getKeycloak } from '../config/keycloak'

export default function SpectacleModal({ id, visible, onHide, onReserved }: { id?: number; visible: boolean; onHide: () => void; onReserved?: (s?: Spectacle) => void }) {
  const [spectacle, setSpectacle] = useState<Spectacle | null>(null)
  const [loading, setLoading] = useState(false)
  const [qty, setQty] = useState<number>(1)
  const toast = useRef<Toast | null>(null)
  const { isAuthenticated, login, user } = useAuthComposable()

  useEffect(() => {
    if (!visible || !id) return
    setLoading(true)
    getSpectacle(id)
      .then(s => setSpectacle(s))
      .catch(err => { console.error(err); setSpectacle(null) })
      .finally(() => setLoading(false))
  }, [visible, id])

  useEffect(() => { if (!visible) { setSpectacle(null); setQty(1) } }, [visible])

  const placeOrder = () => {
    ;(async () => {
      if (!spectacle) return

      if (!isAuthenticated) {
        toast.current?.show({ severity: 'warn', summary: 'Authentification requise', detail: 'Veuillez vous connecter pour réserver', life: 3000 })
        login()
        return
      }

      
      const kc = getKeycloak()
      const derivedId = (user as any)?.id ?? kc?.tokenParsed?.sub ?? kc?.tokenParsed?.preferred_username
      if (!derivedId) {
        toast.current?.show({ severity: 'error', summary: 'Erreur', detail: "Impossible d'identifier l'utilisateur", life: 4000 })
        return
      }

      try {
        setLoading(true)
        await createReservation(spectacle.id, derivedId as any, qty)
        
        try {
          const updated = await getSpectacle(spectacle.id)
          setSpectacle(updated)
          onReserved?.(updated)
        } catch (refreshErr) {
          console.warn('Could not refresh spectacle after reservation', refreshErr)
        }

        toast.current?.show({ severity: 'success', summary: 'Réservé', detail: `${qty} billet(s) réservés`, life: 3000 })
        onHide()
      } catch (err: any) {
        console.error('Reservation failed', err)
        toast.current?.show({ severity: 'error', summary: 'Erreur', detail: err?.message ?? 'Échec de la réservation', life: 4000 })
      } finally {
        setLoading(false)
      }
    })()
  }

  const right = (
    <div className="p-4 rounded-md" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))', border: '1px solid rgba(88,1,10,0.25)' }}>
      <h3 className="text-lg text-[#F9E8CA] mb-2">Commander</h3>
      <div className="mb-3">
        <div className="text-sm text-white/80">Disponibles</div>
        <div className="text-2xl font-semibold text-[#F9E8CA]">{spectacle?.availableTickets ?? '-'}</div>
      </div>
      <div className="mb-3">
        <div className="text-sm text-white/80">Quantité</div>
        <InputNumber value={qty} onValueChange={e => setQty(Number(e.value))} min={1} max={spectacle?.availableTickets ?? 1} inputClassName="w-full text-black" />
      </div>
      <div className="mb-4">
        <div className="text-sm text-white/80">Total</div>
        <div className="text-2xl font-semibold text-[#F9E8CA]">{((spectacle?.price ?? 0) * qty).toFixed(2)} €</div>
      </div>
      <div>
        <ButtonT onClick={placeOrder} disabled={!(spectacle && spectacle.availableTickets > 0) || loading} className={`w-full`}>
          Commander
        </ButtonT>
      </div>
    </div>
  )

  const headerContent = (
    <div className="flex items-center justify-end modal-drag-handle" style={{ width: '100%', padding: '0.18rem 0.5rem' }}>
      <button aria-label="Fermer" onClick={onHide} className="modal-close-btn">
        <i className="pi pi-times" />
      </button>
    </div>
  )

  return (
    <Dialog visible={visible} onHide={onHide} header={headerContent} style={{ width: '95%', maxWidth: 980 }} modal className="p-0" closable={false} draggable>
      <Toast ref={toast} />
      <div
        className="spectacle-modal text-white p-4 md:p-6 rounded-lg shadow-lg"
        style={{
          backgroundImage: "url('/9505443_2049.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >

        <div className="content-section">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-white/80">{spectacle ? new Date(spectacle.date).toLocaleString() : ''}</div>
              <h3 className="text-2xl text-[#F9E8CA] font-semibold mt-1">{spectacle?.title ?? ''}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 order-1 md:order-1">
                {loading ? (
                <div className="text-white/70">Chargement...</div>
                ) : spectacle ? (
                <div>
                    <img src={spectacle.imageUrl} alt={spectacle.title} className="w-full h-56 md:h-80 object-cover rounded-md" />
                    <div className="mt-4">
                    <p className="text-white/90 mt-1 leading-relaxed max-h-56 overflow-y-auto pr-2">{spectacle.description}</p>
                    </div>
                </div>
                ) : (
                <div className="text-white/70">Introuvable</div>
                )}
            </div>
            <div className="md:col-span-1 order-3 md:order-2">
                {right}
            </div>
            </div>
        </div>
      </div>
    </Dialog>
  )
}
