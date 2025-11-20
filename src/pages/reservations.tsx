import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/navbar'
import { getReservationsForUser, deleteReservation } from '../composables/useReservation'
import useAuthComposable from '../composables/useAuth'
import { getKeycloak } from '../config/keycloak'
import { Toast } from 'primereact/toast'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

export default function ReservationsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const toast = useRef<Toast | null>(null)

  const { isAuthenticated } = useAuthComposable()

  const deriveUserId = () => {
    try {
      const kc = getKeycloak()
      return kc?.tokenParsed?.sub ?? kc?.tokenParsed?.preferred_username ?? null
    } catch {
      return null
    }
  }

  async function fetchData() {
    setLoading(true)
    try {
      const kcId = deriveUserId()
      if (!kcId) {
        setItems([])
        toast.current?.show({ severity: 'warn', summary: 'Utilisateur inconnu', detail: "Impossible d'identifier l'utilisateur", life: 3000 })
        return
      }

      const data: any[] = await getReservationsForUser(kcId)
      setItems(data)
    } catch (err) {
      console.error('Could not load reservations', err)
      setItems([])
      toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les réservations', life: 4000 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([])
      return
    }
    fetchData()
  }, [isAuthenticated])

  const cancelReservation = async (reservation: any) => {
    if (!reservation || !reservation.id) return
    const specDate = reservation.spectacle?.date ?? reservation.date ?? reservation.createdAt
    if (specDate) {
      const when = new Date(specDate).getTime()
      const now = Date.now()
      const twoHours = 2 * 60 * 60 * 1000
      if (when - now < twoHours) {
        toast.current?.show({ severity: 'warn', summary: 'Annulation impossible', detail: 'Les annulations sont fermées dans les 2 heures avant le spectacle.', life: 4000 })
        return
      }
    }

    if (!confirm('Annuler cette réservation ?')) return
    try {
      await deleteReservation(reservation.id)
      toast.current?.show({ severity: 'success', summary: 'Supprimé', detail: 'Réservation annulée', life: 3000 })
      fetchData()
    } catch (err: any) {
      console.error('delete failed', err)
      toast.current?.show({ severity: 'error', summary: 'Erreur', detail: err?.message ?? 'Impossible d\'annuler', life: 4000 })
    }
  }

  const spectacleBody = (row: any) => {
    return row.spectacle?.title ?? row.title ?? '—'
  }

  const dateBody = (row: any) => {
    const d = row.spectacle?.date ?? row.date ?? row.createdAt
    try { return new Date(d).toLocaleString() } catch { return d ?? '' }
  }

  const qtyBody = (row: any) => {
    return row.quantity ?? row.qty ?? 1
  }

  const actionsBody = (row: any) => (
    <div className="flex gap-2">
      {
        (() => {
          const d = row.spectacle?.date ?? row.date ?? row.createdAt
          let cancellable = true
          if (d) {
            const when = new Date(d).getTime()
            const now = Date.now()
            const twoHours = 2 * 60 * 60 * 1000
            cancellable = when - now >= twoHours
          }
          return (
            <Button
              label="Annuler"
              icon="pi pi-times"
              className="p-button-danger p-button-sm"
              onClick={() => cancelReservation(row)}
              disabled={!cancellable}
              title={cancellable ? 'Annuler la réservation' : 'Annulation impossible dans les 2 heures avant le spectacle'}
            />
          )
        })()
      }
    </div>
  )

  return (
    <>
      <Navbar />
      <main className="w-full min-h-screen px-4 md:px-8 lg:px-12 pb-12 pt-28 bg-[#A92831] flex justify-center">
        <div className="max-w-6xl w-full">
          <Toast ref={toast} />
          <h2 className="text-2xl md:text-3xl font-semibold text-[#F9E8CA] mb-4">Mes réservations</h2>

          <div className="card">
            <DataTable value={items} loading={loading} emptyMessage="Aucune réservation trouvée">
              <Column header="Spectacle" body={spectacleBody} />
              <Column header="Date" body={dateBody} />
              <Column header="Quantité" body={qtyBody} />
              <Column header="Actions" body={actionsBody} style={{ width: 160 }} />
            </DataTable>
          </div>
        </div>
      </main>
    </>
  )
}
