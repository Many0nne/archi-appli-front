import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/navbar'
import { getSpectacles } from '../composables/useSpectable'
import { getStats, createSpectacle, updateSpectacle, deleteSpectacle } from '../composables/useStats'
import type { AdminStats } from '../types/admin'
import type { Spectacle } from '../types/spectacle'
import { Divider } from 'primereact/divider'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import ButtonT from '../components/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'

export default function AdminPage() {
  const [spectacles, setSpectacles] = useState<Spectacle[]>([])
  const [loading, setLoading] = useState(false)

  const [stats, setStats] = useState<AdminStats | null>(null)

  const [openDialog, setOpenDialog] = useState(false)
  const [editing, setEditing] = useState<Spectacle | null>(null)

  useEffect(() => {
    fetchAll()
    fetchStats()
  }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const data = await getSpectacles()
      setSpectacles(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchStats() {
    try {
      const s = await getStats()
      setStats(s)
      console.log('Stats loaded', s)
    } catch (err) {
      console.warn('Could not load stats', err)
      setStats(null)
    }
  }

  function openCreate() {
    setEditing({ id: 0 } as Spectacle)
    setOpenDialog(true)
  }

  function openEdit(s: Spectacle) {
    setEditing({ ...s })
    setOpenDialog(true)
  }

  async function save() {
    if (!editing) return
    try {
      if (editing.id && editing.id > 0) {
        await updateSpectacle(editing.id, editing)
      } else {
        const { id: _omit, ...payload } = editing as any
        await createSpectacle(payload)
      }
      setOpenDialog(false)
      await fetchAll()
      await fetchStats()
    } catch (err) {
      console.error('Save failed', err)
      alert('Erreur lors de l\'enregistrement')
    }
  }

  async function remove(id?: number) {
    if (!id) return
    if (!confirm('Supprimer ce spectacle ?')) return
    try {
      await deleteSpectacle(id)
      await fetchAll()
      await fetchStats()
    } catch (err) {
      console.error('Delete failed', err)
      alert('Erreur lors de la suppression')
    }
  }

  const actionsBody = (rowData: Spectacle) => {
    return (
      <div className="flex gap-2">
        <ButtonT onClick={() => openEdit(rowData)} aria-label="Modifier"><i className="pi pi-pencil"></i></ButtonT>
        <ButtonT onClick={() => remove(rowData.id)} aria-label="Supprimer" style={{ backgroundColor: '#ff4d4f', color: '#ffffff' }}><i className="pi pi-trash"></i></ButtonT>
      </div>
    )
  }

  const statsSummary = useMemo(() => {
    if (!stats) return null
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-white/6 rounded">
          <div className="text-sm">Revenu total</div>
          <div className="text-2xl font-semibold">{stats.totalRevenue?.toFixed(2)} €</div>
        </div>
        <div className="p-4 bg-white/6 rounded">
          <div className="text-sm">Réservations</div>
          <div className="text-2xl font-semibold">{stats.totalReservations}</div>
        </div>
      </div>
    )
  }, [stats])

  return (
    <>
      <Navbar />

      <main className="w-full flex justify-center bg-gray-50 min-h-screen px-4 md:px-8 lg:px-12 pb-12 pt-28">
        <div className="max-w-7xl w-full mx-auto">
          <div className="p-6 bg-white rounded-lg flex flex-col gap-4 shadow-sm">
          <header className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Administration</h2>
          </header>

          {statsSummary}

          <Divider />

          {stats?.salesBySpectacle && (
            <div className="mb-6">
              <h3 className="text-lg text-gray-900">Ventes par spectacle</h3>
              <div className="overflow-auto bg-white rounded shadow-sm">
                <table className="min-w-full text-left text-sm text-gray-700">
                  <thead>
                    <tr>
                      <th className="p-2">Spectacle</th>
                      <th className="p-2">Tickets vendus</th>
                      <th className="p-2">Revenu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.salesBySpectacle.map((s: any) => (
                      <tr key={s.spectacleId} className="border-t border-gray-200">
                        <td className="p-2">{s.title}</td>
                        <td className="p-2">{s.ticketsSold}</td>
                        <td className="p-2">{s.revenue?.toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Divider />

          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-lg text-gray-900 mb-2">Liste des spectacles</h3>
            <div className='flex gap-3'>
              <ButtonT onClick={openCreate}><i className="pi pi-plus" /> Créer</ButtonT>
              <ButtonT onClick={() => { fetchAll(); fetchStats() }} className="text-gray-800" style={{background:'#F9E8CA'}}><i className="pi pi-refresh" /> Rafraîchir</ButtonT>
            </div>
          </div>

          <section>
            <DataTable value={spectacles} loading={loading} className="shadow-sm bg-white rounded">
              <Column field="title" header="Titre" />
              <Column header="Date" body={(row: Spectacle) => {
                try {
                  return row.date ? new Date(row.date).toLocaleString() : '-'
                } catch (e) {
                  return String(row.date ?? '-')
                }
              }} />
              <Column field="price" header="Prix" body={(row: Spectacle) => `${row.price.toFixed(2)} €`} />
              <Column field="availableTickets" header="Places" />
              <Column header="Actions" body={actionsBody} style={{ width: 140 }} />
            </DataTable>
          </section>
          </div>
        </div>
      </main>

      <Dialog header={editing?.id ? 'Modifier spectacle' : 'Créer spectacle'} visible={openDialog} onHide={() => setOpenDialog(false)} style={{ width: '90%', maxWidth: 460 }}>
        {editing && (
          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-col gap-3">
                <label className="block text-gray-700">Titre</label>
                <InputText className="w-full p-inputtext-sm" value={editing.title ?? ''} onChange={e => setEditing({ ...editing, title: e.target.value })} />

                <label className="block text-gray-700">Description</label>
                <InputText className="w-full p-inputtext-sm" value={editing.description ?? ''} onChange={e => setEditing({ ...editing, description: e.target.value })} />

                <label className="block text-gray-700">Image URL</label>
                <InputText className="w-full p-inputtext-sm" value={editing.imageUrl ?? ''} onChange={e => setEditing({ ...editing, imageUrl: e.target.value })} />

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-gray-700">Prix</label>
                    <InputNumber inputClassName="w-full p-inputtext-sm" value={editing.price ?? 0} mode="decimal" minFractionDigits={2} onValueChange={e => setEditing({ ...editing, price: Number(e.value) })} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700">Places disponibles</label>
                    <InputNumber inputClassName="w-full p-inputtext-sm" value={editing.availableTickets ?? 0} onValueChange={e => setEditing({ ...editing, availableTickets: Number(e.value) })} />
                  </div>
                </div>

                <label className="block text-gray-700">Date</label>
                <Calendar className="w-full" value={editing.date ? new Date(editing.date) : null} onChange={e => setEditing({ ...editing, date: (e.value as Date)?.toISOString() ?? '' })} dateFormat="dd/mm/yy" showTime />

                <div className="flex justify-end gap-3 mt-4">
                  <ButtonT className="p-button-secondary" style={{background: '#F9E8CA'}} onClick={() => setOpenDialog(false)}>Annuler</ButtonT>
                  <ButtonT onClick={save}>Enregistrer</ButtonT>
                </div>
              </div>
          </div>
        )}
      </Dialog>
    </>
  )
}

