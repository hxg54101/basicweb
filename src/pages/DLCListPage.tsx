import { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import EventSidebar from '../components/EventSidebar';
import { Square } from 'lucide-react';

interface DLCListPageProps {
  onNavigate: (page: 'login' | 'signup' | 'dlc' | 'song' | 'gamecenter') => void;
}

interface DLCItem {
  id: number;
  rank: string;
  title: string;
  score: string;
  dlc: string;
}

export default function DLCListPage({ onNavigate }: DLCListPageProps) {
  const [dlcItems, setDlcItems] = useState<DLCItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDLCItems();
  }, []);

  const fetchDLCItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dlc');
      if (!response.ok) throw new Error('Failed to fetch DLC items');
      const data = await response.json();
      const formattedData = data.map((item: any) => ({
        id: item.id,
        rank: item.rank,
        title: item.title,
        score: item.score?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0',
        dlc: item.dlc,
      }));
      setDlcItems(formattedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setDlcItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      onNavigate={onNavigate}
      currentPage="dlc"
      sidebar={<EventSidebar showGameGrid={true} />}
    >
      <div className="space-y-4">
        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && dlcItems.length === 0 && <p className="text-gray-400">No DLC items found</p>}
        {dlcItems.map((item) => (
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
