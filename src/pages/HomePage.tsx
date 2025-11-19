import { useEffect, useState } from 'react';
import type { Spectacle } from '../types/spectacle';
import { getSpectacles } from '../composables/useSpectable';
import Navbar from '../components/navbar';
import SpectacleCard from '../components/SpectacleCard';

export default function HomePage() {
  const [spectacles, setSpectacles] = useState<Spectacle[]>([]);

  useEffect(() => {
    getSpectacles()
      .then(setSpectacles)
      .catch(console.error);
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center my-8">Upcoming Spectacles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {spectacles.map(spectacle => (
            <SpectacleCard key={spectacle.id} spectacle={spectacle} />
          ))}
        </div>
      </div>
    </>
  );
}
