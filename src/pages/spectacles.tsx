import { useEffect, useMemo, useState } from 'react';
import type { Spectacle } from '../types/spectacle';
import { getSpectacles } from '../composables/useSpectable';
import Navbar from '../components/navbar';
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
    if (!q) return spectacles;
    return spectacles.filter(s => {
      const title = (s.title || '').toLowerCase();
      const desc = (s.description || '').toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [spectacles, query]);

  return (
    <>
      <Navbar />

      <main className="w-full min-h-screen px-4 md:px-8 lg:px-12 pb-12 pt-28 bg-[#A92831] flex justify-center">
        <div className="max-w-7xl mx-auto gap-4 flex flex-col">
          <header className="mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#F9E8CA] mb-2">Spectacles</h2>
            <p className="text-sm text-white/80">Parcourez nos spectacles — utilisez la recherche pour filtrer.</p>
          </header>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <label className="relative block">
                <span className="sr-only">Recherche</span>
                <span className="absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-white/70">
                  <i className="pi pi-search" aria-hidden />
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Rechercher un spectacle, mot-clé, artiste..."
                  className="search-input w-full pl-10 pr-4 py-3 rounded bg-white/6 text-white placeholder-white/60 focus:ring-2 focus:ring-[#F9E8CA] outline-none"
                />
              </label>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-white/80">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</div>
            </div>
          </div>

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
