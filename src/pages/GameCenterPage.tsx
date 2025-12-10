import { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import EventSidebar from '../components/EventSidebar';

interface GameCenterPageProps {
  onNavigate: (page: 'login' | 'signup' | 'dlc' | 'song' | 'gamecenter') => void;
}

interface GameCenter {
  id: number;
  name: string;
  location: string;
  distance: string;
  distColor: string;
}

export default function GameCenterPage({ onNavigate }: GameCenterPageProps) {
  const [gameCenters, setGameCenters] = useState<GameCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGameCenters();
  }, []);

  const fetchGameCenters = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gamecenters');
      if (!response.ok) throw new Error('Failed to fetch game centers');
      const result = await response.json();
      const data = result.data || [];
      const formattedData = data.map((center: any, index: number) => ({
        id: center.arcade_id,
        name: center.GAMECENTER_NAME,
        location: center.GAMECENTER_LOCATE,
        distance: `${(index + 1) * 0.5}km`,
        distColor: (index + 1) * 0.5 < 2 ? 'green' : 'orange',
      }));
      setGameCenters(formattedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setGameCenters([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      onNavigate={onNavigate}
      currentPage="gamecenter"
      sidebar={<EventSidebar showGameGrid={true} />}
    >
      <div className="space-y-4">
        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && gameCenters.length === 0 && <p className="text-gray-400">No game centers found</p>}
        {gameCenters.map((center) => (
          <div key={center.id} className="bg-[#333333] rounded p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-white text-xl font-semibold mb-2">{center.name}</h3>
                <p className="text-gray-400 text-sm">{center.location}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded font-medium ${
                  center.distColor === 'green'
                    ? 'bg-[#90EE90] text-[#121212]'
                    : 'bg-orange-500 text-white'
                }`}
              >
                DIST: {center.distance}
              </span>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
