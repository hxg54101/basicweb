import { Square, Search } from 'lucide-react';
import { ReactNode } from 'react';

interface MainLayoutProps {
  onNavigate: (page: 'login' | 'signup' | 'dlc' | 'song' | 'gamecenter') => void;
  currentPage: 'dlc' | 'song' | 'gamecenter';
  sidebar: ReactNode;
  children: ReactNode;
}

export default function MainLayout({ onNavigate, currentPage, sidebar, children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#121212]">
      <header className="bg-[#121212] border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-[#333333] rounded flex items-center justify-center">
              <Square className="text-gray-400" size={24} />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onNavigate('song')}
                className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
                  currentPage === 'song'
                    ? 'bg-[#90EE90] text-[#121212]'
                    : 'bg-[#333333] text-white hover:bg-[#444444]'
                }`}
              >
                Songs
              </button>
              <button
                onClick={() => onNavigate('dlc')}
                className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
                  currentPage === 'dlc'
                    ? 'bg-[#90EE90] text-[#121212]'
                    : 'bg-[#333333] text-white hover:bg-[#444444]'
                }`}
              >
                DLC
              </button>
              <button
                onClick={() => onNavigate('gamecenter')}
                className={`px-6 py-2 rounded text-sm font-medium transition-colors ${
                  currentPage === 'gamecenter'
                    ? 'bg-[#90EE90] text-[#121212]'
                    : 'bg-[#333333] text-white hover:bg-[#444444]'
                }`}
              >
                Arcade
              </button>
            </div>
          </div>

          <button
            onClick={() => onNavigate('login')}
            className="text-white text-sm hover:text-gray-300 transition-colors"
          >
            LOGIN
          </button>
        </div>
      </header>

      <div className="flex px-[100px]">
        <aside className="w-[30%] min-h-[calc(100vh-73px)] bg-[#121212] border-r border-gray-800 p-6">
          {sidebar}
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center bg-[#333333] rounded px-4 py-3">
              <Search className="text-gray-400 mr-3" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-white outline-none flex-1 placeholder-gray-500"
              />
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
