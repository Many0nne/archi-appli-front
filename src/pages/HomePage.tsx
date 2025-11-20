import Navbar from '../components/navbar';
import ButtonT from '../components/button';
import TitleT from '../components/title';
import Stars from '../components/stars';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate()
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
        <div className="flex flex-col items-center w-full">
          <Stars />
          <TitleT>NEW SHOW</TitleT>
          <h1
            className="outlined-title text-[2.5rem] md:text-[3rem] lg:text-[4rem] xl:text-[5rem] responsive-shadow"
            style={{
              fontFamily: "'Limelight', cursive",
              color: '#F9E8CA',
            }}
          >
            Le Théâtre du Minotaure
          </h1>
          <ButtonT onClick={() => navigate('/spectacles')}>Voir les spectacles</ButtonT>
        </div>
      </div>
    </>
  );
}
