import { useEffect, useState } from 'react';
import type { Spectacle } from '../types/spectacle';
import { getSpectacles } from '../composables/useSpectable';
import Navbar from '../components/navbar';
import SpectacleCard from '../components/SpectacleCard';
import ButtonT from '../components/button';
import TitleT from '../components/title';
import Stars from '../components/stars';

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
      <div
        className="w-full min-h-screen items-center flex"
        style={{
          backgroundImage: "url('/ChatGPT Image 19 nov. 2025, 22_32_47.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex flex-col items-center w-1/2">
          <Stars />
          <TitleT>NEW SHOW</TitleT>
          <h1
            className="text-[7rem] outlined-title"
            style={{
              fontFamily: "'Limelight', cursive",
              textShadow: '5px 5px #58010A, 6px 6px #58010A',
              color: '#F9E8CA',
            }}
          >
            CABARET
          </h1>
          <ButtonT>BUY TICKET</ButtonT>
        </div>
      </div>
    </>
  );
}
