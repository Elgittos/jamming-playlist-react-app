import { useState, useEffect } from 'react';

const THEMES = {
  dark: {
    name: 'Dark',
    gradient: 'from-purple-950 via-violet-950 to-black'
  },
  light: {
    name: 'Light',
    gradient: 'from-purple-100 via-violet-100 to-white'
  },
  original: {
    name: 'Original',
    gradient: 'from-purple-950 via-violet-950 to-black'
  }
};

export default function SideMenu({ onHomeClick }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isThemesOpen, setIsThemesOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'original';
  });

  useEffect(() => {
    localStorage.setItem('app-theme', selectedTheme);
    // Apply theme to document root for potential future theme-based styling
    // Note: Currently themes only affect the main background gradient in App.jsx
    // Future enhancement: Use this data attribute for comprehensive theming across all components
    document.documentElement.setAttribute('data-theme', selectedTheme);
  }, [selectedTheme]);

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setIsThemesOpen(false);
    setIsMobileOpen(false);
  };

  const handleHome = () => {
    setIsMobileOpen(false);
    if (onHomeClick) {
      onHomeClick();
    }
  };

  return (
    <>
      {/* Hamburger Button - Mobile/Tablet Only */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-purple-900/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-purple-700/50 hover:bg-purple-800/90 transition-all"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Side Menu */}
      <nav
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-purple-900/95 via-violet-900/95 to-purple-950/95 backdrop-blur-md border-r border-purple-700/30 shadow-2xl z-40 transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          isExpanded ? 'w-48' : 'w-16'
        } lg:hover:w-48`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false);
          setIsThemesOpen(false);
        }}
      >
        <div className="flex flex-col h-full py-6 px-3">
          {/* Logo/Brand Space */}
          <div className="mb-8 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
          </div>

          {/* Menu Items */}
          <div className="flex-1 space-y-2">
            {/* Themes Menu Item */}
            <div className="relative">
              <button
                onClick={() => setIsThemesOpen(!isThemesOpen)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-purple-800/50 text-white transition-all group"
              >
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span className={`whitespace-nowrap transition-opacity ${isExpanded || isMobileOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'}`}>
                  Themes
                </span>
              </button>

              {/* Themes Submenu */}
              {isThemesOpen && (isExpanded || isMobileOpen) && (
                <div className="ml-3 mt-1 space-y-1 pl-3 border-l-2 border-purple-700/50">
                  {Object.entries(THEMES).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => handleThemeSelect(key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedTheme === key
                          ? 'bg-purple-600/50 text-white font-semibold'
                          : 'text-purple-200 hover:bg-purple-800/30 hover:text-white'
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Home Menu Item */}
            <button
              onClick={handleHome}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-purple-800/50 text-white transition-all group"
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className={`whitespace-nowrap transition-opacity ${isExpanded || isMobileOpen ? 'opacity-100' : 'opacity-0 lg:group-hover:opacity-100'}`}>
                Home
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
