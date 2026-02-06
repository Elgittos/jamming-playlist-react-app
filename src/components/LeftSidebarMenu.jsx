import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function LeftSidebarMenu() {
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const isExpanded = isPinned || isHovered;

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: '/',
    },
    {
      id: 'search',
      label: 'Search',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      path: '/search',
    },
    {
      id: 'library',
      label: 'Your Library',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      path: '/library',
    },
    {
      id: 'playlists',
      label: 'Playlists',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      path: '/playlists',
    },
  ];

  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  return (
    <aside
      className={`hidden md:block fixed left-0 top-0 h-screen bg-gradient-to-b from-purple-950/95 via-violet-950/95 to-black/95 backdrop-blur-md border-r border-purple-700/30 transition-all duration-300 ease-in-out z-50 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full p-4">
        {/* Logo/Brand */}
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-2xl">🎵</span>
            <span className="text-white font-bold text-lg whitespace-nowrap">Jamming</span>
          </div>
          {!isExpanded && (
            <span className="text-2xl mx-auto">🎵</span>
          )}
        </div>

        {/* Pin/Unpin Button */}
        <button
          onClick={togglePin}
          className={`mb-6 p-2 rounded-lg transition-all duration-300 hover:bg-purple-800/50 text-purple-300 hover:text-white ${
            isExpanded ? 'self-end' : 'self-center'
          }`}
          title={isPinned ? 'Unpin menu' : 'Pin menu'}
        >
          <div className={`relative w-6 h-6 transition-transform duration-300 ${isPinned ? 'rotate-45' : 'rotate-0'}`}>
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
            </svg>
          </div>
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-fuchsia-600/30 text-fuchsia-300 shadow-lg shadow-fuchsia-500/20'
                    : 'text-purple-300 hover:bg-purple-800/30 hover:text-white'
                }`}
              >
                <div className="flex-shrink-0 w-6 h-6">
                  {item.icon}
                </div>
                <span
                  className={`whitespace-nowrap font-medium transition-all duration-300 ${
                    isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer - Pin Status Indicator */}
        <div className={`mt-auto pt-4 border-t border-purple-700/30 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2 text-xs text-purple-400">
            <div className={`w-2 h-2 rounded-full ${isPinned ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            <span>{isPinned ? 'Pinned' : 'Auto-hide'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default LeftSidebarMenu;
