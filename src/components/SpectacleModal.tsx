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
    <div className="p-4 rounded-md bg-white" style={{ border: '1px solid rgba(88,1,10,0.08)' }}>
      <h3 className="text-lg text-[#58010A] mb-2">Commander</h3>
      <div className="mb-3">
        <div className="text-sm text-gray-500">Disponibles</div>
        <div className="text-2xl font-semibold text-[#58010A]">{spectacle?.availableTickets ?? '-'}</div>
      </div>
      <div className="mb-3">
        <div className="text-sm text-gray-500">Quantité</div>
        <InputNumber value={qty} onValueChange={e => setQty(Number(e.value))} min={1} max={Math.min(spectacle?.availableTickets ?? 1, 50)} inputClassName="w-full text-black" />
        <div className="text-xs text-gray-400 mt-1">Maximum 50 billets par transaction</div>
      </div>
      <div className="mb-4">
        <div className="text-sm text-gray-500">Total</div>
        <div className="text-2xl font-semibold text-[#58010A]">{((spectacle?.price ?? 0) * qty).toFixed(2)} €</div>
      </div>
      <div>
        <ButtonT onClick={placeOrder} disabled={!(spectacle && spectacle.availableTickets > 0) || loading}>
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

        <div className="content-section">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-1">
                <div className="relative">
                  {spectacle ? (
                    <img src={spectacle.imageUrl} alt={spectacle.title} className="w-full h-64 object-cover rounded-md" />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-500 rounded-md">Aucune image</div>
                  )}
                </div>

                <div className="py-2">
                  <div className="text-sm text-gray-500">{spectacle ? new Date(spectacle.date).toLocaleString() : ''}</div>
                  <h3 className="text-2xl text-[#58010A] font-semibold mt-1">{spectacle?.title ?? ''}</h3>

                  <div>
                    {loading ? (
                      <div className="text-gray-500">Chargement...</div>
                    ) : spectacle ? (
                      <p className="text-gray-700 mt-1 leading-relaxed max-h-72 overflow-y-auto pr-2">{spectacle.description}</p>
                    ) : (
                      <div className="text-gray-500">Introuvable</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-80 md:shrink-0">
                <div className="md:sticky md:top-24">
                  {right}
                </div>
              </div>
            </div>
        </div>
    </Dialog>
  )
}
