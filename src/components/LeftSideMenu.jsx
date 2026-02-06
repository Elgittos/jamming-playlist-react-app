import { useState, useEffect } from 'react';

function LeftSideMenu() {
  const [isPinned, setIsPinned] = useState(() => {
    const saved = localStorage.getItem('menuPinned');
    return saved === 'true';
  });
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isPinned || isHovered;

  useEffect(() => {
    localStorage.setItem('menuPinned', isPinned);
  }, [isPinned]);

  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  const menuItems = [
    {
      id: 'home',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      label: 'Home',
    },
    {
      id: 'search',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      label: 'Search',
    },
    {
      id: 'library',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      ),
      label: 'Library',
    },
    {
      id: 'playlists',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
      ),
      label: 'Playlists',
    },
    {
      id: 'recent',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Recent',
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ${
        isExpanded ? 'w-56' : 'w-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full bg-gradient-to-b from-purple-950 via-violet-950 to-purple-950 border-r border-fuchsia-800/30 shadow-2xl shadow-fuchsia-500/10 backdrop-blur-sm">
        {/* Header with Pin Button */}
        <div className="p-4 flex items-center justify-between border-b border-fuchsia-800/30">
          <div className={`flex items-center gap-3 ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            <div className="w-6 h-6 bg-gradient-to-br from-fuchsia-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">🎵</span>
            </div>
            <span className="text-white font-bold text-sm whitespace-nowrap">Jamming</span>
          </div>
          
          {/* Pin Button - Always visible on the right */}
          <button
            onClick={togglePin}
            className={`p-1.5 rounded-lg transition-all duration-200 hover:bg-fuchsia-800/30 ${
              isPinned ? 'bg-fuchsia-800/40 text-fuchsia-400' : 'text-gray-400 hover:text-fuchsia-400'
            } ${!isExpanded ? 'ml-auto' : ''}`}
            aria-label={isPinned ? 'Unpin menu' : 'Pin menu'}
            title={isPinned ? 'Unpin menu' : 'Pin menu'}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              {isPinned ? (
                // Pinned icon (pin at angle)
                <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
              ) : (
                // Unpinned icon (upright pin)
                <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-fuchsia-800/30 transition-all duration-200 group"
              aria-label={item.label}
              onClick={() => console.log(`Navigate to ${item.label}`)}
            >
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <span
                className={`whitespace-nowrap text-sm font-medium ${
                  isExpanded ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-300`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-fuchsia-800/30">
          <button 
            className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-fuchsia-800/30 transition-all duration-200"
            aria-label="Settings"
            onClick={() => console.log('Navigate to Settings')}
          >
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
            <span
              className={`whitespace-nowrap text-sm font-medium ${
                isExpanded ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300`}
            >
              Settings
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeftSideMenu;
