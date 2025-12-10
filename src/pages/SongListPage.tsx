import { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import EventSidebar from '../components/EventSidebar';
import { Square } from 'lucide-react';

interface SongListPageProps {
  onNavigate: (page: 'login' | 'signup' | 'dlc' | 'song' | 'gamecenter') => void;
}

interface SongItem {
  id: number;
  rank: string;
  title: string;
  score: string;
  dlc: string;
}

export default function SongListPage({ onNavigate }: SongListPageProps) {
  const [songItems, setSongItems] = useState<SongItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/songs');
      if (!response.ok) throw new Error('Failed to fetch songs');
      const result = await response.json();
      const data = result.data || [];
      const formattedData = data.map((song: any) => ({
        id: song.song_id,
        rank: song.pattern_difficulty === 'Extreme' ? 'S+' : song.pattern_difficulty === 'Hard' ? 'S' : 'A+',
        title: song.song_name,
        score: song.players_best_score?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0',
        dlc: song.dlc_required_name || 'Free',
      }));
      setSongItems(formattedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setSongItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      onNavigate={onNavigate}
      currentPage="song"
      sidebar={<EventSidebar showGameGrid={true} />}
    >
      <div className="space-y-4">
        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && songItems.length === 0 && <p className="text-gray-400">No songs found</p>}
        {songItems.map((item) => (
          <div key={item.id} className="bg-[#333333] rounded p-6 flex gap-6">
            <div className="w-32 h-32 bg-[#555555] rounded flex-shrink-0 flex items-center justify-center">
              <Square className="text-gray-400" size={48} />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-white text-xl font-semibold mb-1">{item.title}</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[#90EE90] font-semibold">{item.rank}</span>
                    <span className="text-gray-400">Score: {item.score}</span>
                  </div>
                </div>
                <span className="bg-[#555555] text-gray-400 text-xs px-3 py-1 rounded">
                  UPTIME
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="bg-[#121212] rounded px-4 py-2 inline-block">
                  <span className="text-gray-400 text-sm">REQUIRE DLC: </span>
                  <span className="text-white text-sm font-medium">{item.dlc}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
