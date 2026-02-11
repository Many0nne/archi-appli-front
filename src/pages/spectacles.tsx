import { useEffect, useMemo, useState } from 'react';
import type { Spectacle } from '../types/spectacle';
import { getSpectacles } from '../composables/useSpectable';
import Navbar from '../components/navbar';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import SpectacleCard from '../components/SpectacleCard';
import SpectacleModal from '../components/SpectacleModal';

export default function SpectaclesPage() {
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchSpectacles = async () => {
    try {
      const data = await getSpectacles()
      setSpectacles(data)
    } catch (err) {
      console.error('Could not load spectacles', err)
    }
  }

  useEffect(() => {
    fetchSpectacles()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const now = Date.now()
    const future = spectacles.filter(s => {
      if (!s?.date) return true
      const ts = s.date instanceof Date ? s.date.getTime() : Date.parse(s.date)
      if (Number.isNaN(ts)) return true
      return ts >= now
    })

    if (!q) return future

    return future.filter(s => {
      const title = (s.title || '').toLowerCase();
      const desc = (s.description || '').toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [spectacles, query]);

  return (
    <>
      <Navbar />

      <main className="w-full min-h-screen px-4 md:px-8 lg:px-12 pb-12 pt-28 bg-[#F9FAFB] flex justify-center">
        <div className="max-w-7xl mx-auto gap-4 flex flex-col">
          <header className="mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Spectacles</h2>
            <p className="text-sm">Parcourez nos spectacles — utilisez la recherche pour filtrer.</p>
          </header>

          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" style={{ top: '34%' }}></InputIcon>
            <InputText
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un spectacle, mot-clé, artiste..."
              className="w-full"
            />
          </IconField>

          <section>
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-white/80">Aucun spectacle trouvé pour "{query}".</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((spectacle) => (
                  <div key={spectacle.id} className="spectacle-card">
                    <SpectacleCard spectacle={spectacle} onOpen={() => { setSelectedId(spectacle.id); setModalOpen(true) }} />
                  </div>
                ))}
              </div>
            )}
          </section>
          <SpectacleModal id={selectedId} visible={modalOpen} onHide={() => setModalOpen(false)} onReserved={() => fetchSpectacles()} />
        </div>
      </main>
    </>
  );
}