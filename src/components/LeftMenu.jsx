import { useState, useEffect } from 'react';

function LeftMenu({ theme, onThemeChange, onHomeClick }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load pinned state from localStorage
  useEffect(() => {
    const savedPinned = localStorage.getItem('menu_pinned');
    if (savedPinned === 'true') {
      setIsPinned(true);
      setIsExpanded(true);
    }
  }, []);

  const handlePinToggle = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    localStorage.setItem('menu_pinned', newPinned.toString());
    if (newPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsExpanded(false);
      setIsThemeMenuOpen(false);
    }
  };

  const handleThemeSelect = (selectedTheme) => {
    onThemeChange(selectedTheme);
    setIsThemeMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleHome = () => {
    onHomeClick();
    setIsMobileMenuOpen(false);
  };

  const themes = [
    { id: 'dark', name: 'Dark', icon: '🌙' },
    { id: 'light', name: 'Light', icon: '☀️' },
    { id: 'original', name: 'Original', icon: '🎨' }
  ];

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-[60] lg:hidden p-3 rounded-lg bg-purple-900/80 backdrop-blur-sm border border-purple-700/50 text-white hover:bg-purple-800/80 transition-all"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[45] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop menu */}
      <div
        className={`hidden lg:fixed lg:flex flex-col top-0 left-0 h-screen bg-gradient-to-b from-purple-950/95 via-violet-950/95 to-black/95 backdrop-blur-md border-r border-purple-800/30 z-50 transition-all duration-300 ${
          isExpanded || isPinned ? 'w-56' : 'w-16'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Menu Items */}
        <div className="flex-1 flex flex-col gap-2 p-3 pt-6">
          {/* Pin/Unpin button */}
          <button
            onClick={handlePinToggle}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-800/30 transition-all text-purple-300 hover:text-white group"
            title={isPinned ? "Unpin menu" : "Pin menu"}
          >
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d={isPinned ? "M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" : "M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"} />
            </svg>
            {(isExpanded || isPinned) && <span className="whitespace-nowrap">{isPinned ? 'Unpin' : 'Pin'}</span>}
          </button>

          {/* Home */}
          <button
            onClick={handleHome}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-800/30 transition-all text-purple-300 hover:text-white group"
            title="Home"
          >
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            {(isExpanded || isPinned) && <span className="whitespace-nowrap">Home</span>}
          </button>

          {/* Themes */}
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-800/30 transition-all text-purple-300 hover:text-white group"
              title="Themes"
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
              {(isExpanded || isPinned) && <span className="whitespace-nowrap">Themes</span>}
              {(isExpanded || isPinned) && (
                <svg className={`w-4 h-4 ml-auto transition-transform ${isThemeMenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Theme submenu */}
            {isThemeMenuOpen && (
              <div className={`${isExpanded || isPinned ? 'relative mt-2 ml-2' : 'absolute left-full top-0 ml-2'} bg-purple-900/95 backdrop-blur-md border border-purple-700/50 rounded-lg overflow-hidden shadow-xl min-w-[160px]`}>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleThemeSelect(t.id)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-purple-800/50 transition-all ${
                      theme === t.id ? 'bg-purple-800/30 text-fuchsia-400' : 'text-purple-200'
                    }`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span className="whitespace-nowrap">{t.name}</span>
                    {theme === t.id && (
                      <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-purple-950/98 via-violet-950/98 to-black/98 backdrop-blur-md border-r border-purple-800/30 z-50 transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-2 p-4 pt-20">
          {/* Home */}
          <button
            onClick={handleHome}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-800/30 transition-all text-purple-300 hover:text-white"
          >
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Home</span>
          </button>

          {/* Themes */}
          <div>
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-800/30 transition-all text-purple-300 hover:text-white"
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
              <span>Themes</span>
              <svg className={`w-4 h-4 ml-auto transition-transform ${isThemeMenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {isThemeMenuOpen && (
              <div className="mt-2 ml-2 bg-purple-900/50 rounded-lg overflow-hidden">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleThemeSelect(t.id)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-purple-800/50 transition-all ${
                      theme === t.id ? 'bg-purple-800/30 text-fuchsia-400' : 'text-purple-200'
                    }`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span>{t.name}</span>
                    {theme === t.id && (
                      <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftMenu;
