import { useState, useEffect } from 'react';

interface EventSidebarProps {
  showGameGrid?: boolean;
}

interface EventData {
  EVENT_TITLE: string;
  EVENT_DETAIL: string;
  EVENT_START_DATE: string;
  EVENT_END_DATE: string;
}

interface PatchData {
  PATCH_TITLE: string;
  PATCH_DETAIL: string;
  PATCH_RELEASE_DATE: string;
}

export default function EventSidebar({ showGameGrid = false }: EventSidebarProps) {
  const [activeTab, setActiveTab] = useState<'event' | 'patch'>('event');
  const [events, setEvents] = useState<EventData[]>([]);
  const [patches, setPatches] = useState<PatchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchPatches();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const result = await response.json();
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatches = async () => {
    try {
      const response = await fetch('/api/patches');
      const result = await response.json();
      if (result.success) {
        setPatches(result.data);
      }
    } catch (error) {
      console.error('Error fetching patches:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0].replace(/-/g, '.');
  };

  return (
    <div>
      {showGameGrid && (
        <div className="mb-6">
          <h3 className="text-white text-sm font-semibold mb-3">Sort By</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <button className="px-3 py-1 bg-[#333333] rounded hover:bg-[#444444] transition-colors text-xs text-white">
              Latest
            </button>
            <button className="px-3 py-1 bg-[#333333] rounded hover:bg-[#444444] transition-colors text-xs text-white">
              Score
            </button>
            <button className="px-3 py-1 bg-[#333333] rounded hover:bg-[#444444] transition-colors text-xs text-white">
              Difficulty
            </button>
            <button className="px-3 py-1 bg-[#333333] rounded hover:bg-[#444444] transition-colors text-xs text-white">
              Name
            </button>
          </div>
        </div>
      )}

      <h2 className="text-white text-xl font-semibold mb-4">이벤트</h2>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('event')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            activeTab === 'event'
              ? 'bg-[#90EE90] text-[#121212]'
              : 'bg-[#333333] text-white hover:bg-[#444444]'
          }`}
        >
          이벤트
        </button>
        <button
          onClick={() => setActiveTab('patch')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            activeTab === 'patch'
              ? 'bg-[#90EE90] text-[#121212]'
              : 'bg-[#333333] text-white hover:bg-[#444444]'
          }`}
        >
          패치 노트
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : activeTab === 'event' ? (
          events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="bg-[#333333] rounded p-4">
                <h3 className="text-white font-semibold mb-2">{event.EVENT_TITLE}</h3>
                <p className="text-gray-400 text-sm mb-3">{event.EVENT_DETAIL}</p>
                <p className="text-gray-500 text-xs">
                  {formatDate(event.EVENT_START_DATE)} - {formatDate(event.EVENT_END_DATE)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No events available</p>
          )
        ) : (
          patches.length > 0 ? (
            patches.map((patch, index) => (
              <div key={index} className="bg-[#333333] rounded p-4">
                <h3 className="text-white font-semibold mb-2">{patch.PATCH_TITLE}</h3>
                <p className="text-gray-400 text-sm mb-3">{patch.PATCH_DETAIL}</p>
                <p className="text-gray-500 text-xs">
                  {formatDate(patch.PATCH_RELEASE_DATE)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No patches available</p>
          )
        )}
      </div>
    </div>
  );
}
