import type { Spectacle } from '../types/spectacle';

interface SpectacleCardProps {
  spectacle: Spectacle;
}

export function SpectacleCard({ spectacle }: SpectacleCardProps) {
  const fallbackImageUrl = 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/06/90/08/1d/amazing-show.jpg?w=1200&h=-1&s=1';

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img
        className="w-full"
        src={fallbackImageUrl}
        alt={spectacle.title}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{spectacle.title}</div>
        <p className="text-gray-700 text-base">{spectacle.description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {new Date(spectacle.date).toLocaleDateString()}
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {spectacle.price}€
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {spectacle.availableTickets} tickets left
        </span>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={() => console.log(`Buying ${spectacle.title}`)}
        >
          Buy
        </button>
      </div>
    </div>
  );
}
