import { useEffect, useState } from 'react';

const MOBILE_MEDIA_QUERY = '(max-width: 1024px)';

const THEME_OPTIONS = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'original', label: 'Original' }
];

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function SideMenu({ theme, onThemeChange, onHome }) {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
  });
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeSubmenuOpen, setIsThemeSubmenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const media = window.matchMedia(MOBILE_MEDIA_QUERY);
    const handleChange = (event) => {
      setIsMobileOrTablet(event.matches);
      setIsThemeSubmenuOpen(false);
      if (!event.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    setIsMobileOrTablet(media.matches);
    if (media.addEventListener) {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (!isMobileOrTablet || !isMobileMenuOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsThemeSubmenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen, isMobileOrTablet]);

  const showLabels = isMobileOrTablet ? isMobileMenuOpen : isDesktopExpanded;

  const closeTouchMenu = () => {
    if (!isMobileOrTablet) return;
    setIsMobileMenuOpen(false);
    setIsThemeSubmenuOpen(false);
  };

  const handleHomeClick = () => {
    onHome?.();
    closeTouchMenu();
  };

  const handleSectionNav = (sectionId) => {
    scrollToSection(sectionId);
    closeTouchMenu();
  };

  const menuShellClass = isMobileOrTablet
    ? `fixed top-0 left-0 z-50 h-screen w-44 transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`
    : `fixed top-3 left-3 z-40 h-[calc(100vh-1.5rem)] transition-[width] duration-300 ${
        isDesktopExpanded ? 'w-56' : 'w-16'
      }`;

  return (
    <>
      {isMobileOrTablet && (
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-3 left-3 z-[60] inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-black/60 text-white backdrop-blur-md"
          aria-label="Open navigation menu"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      )}

      {isMobileOrTablet && isMobileMenuOpen && (
        <button
          type="button"
          onClick={closeTouchMenu}
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
        />
      )}

      <aside
        className={`${menuShellClass} rounded-2xl border border-white/10 bg-black/65 px-2 py-3 text-white backdrop-blur-xl`}
        onMouseEnter={() => {
          if (!isMobileOrTablet) setIsDesktopExpanded(true);
        }}
        onMouseLeave={() => {
          if (!isMobileOrTablet) {
            setIsDesktopExpanded(false);
            setIsThemeSubmenuOpen(false);
          }
        }}
      >
        <nav className="relative h-full">
          <ul className="space-y-1">
            <li
              className="relative"
              onMouseEnter={() => {
                if (!isMobileOrTablet) setIsThemeSubmenuOpen(true);
              }}
              onMouseLeave={() => {
                if (!isMobileOrTablet) setIsThemeSubmenuOpen(false);
              }}
            >
              <button
                type="button"
                onClick={() => setIsThemeSubmenuOpen((prev) => !prev)}
                className="group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left hover:bg-white/10"
                aria-haspopup="menu"
                aria-expanded={isThemeSubmenuOpen}
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v2.5m0 13V21m6.36-13.36-1.77 1.77m-9.18 9.18-1.77 1.77M21 12h-2.5m-13 0H3m15.36 6.36-1.77-1.77m-9.18-9.18L5.64 5.64M12 7.25A4.75 4.75 0 1 0 16.75 12 4.75 4.75 0 0 0 12 7.25Z" />
                </svg>
                <span
                  className={`overflow-hidden whitespace-nowrap text-sm transition-all ${
                    showLabels ? 'max-w-[140px] opacity-100' : 'max-w-0 opacity-0'
                  }`}
                >
                  Themes
                </span>
              </button>

              {isThemeSubmenuOpen && (
                <div className="absolute left-full top-0 ml-1.5 w-32 rounded-xl border border-white/15 bg-black/85 p-2 shadow-2xl backdrop-blur-xl sm:w-36 sm:ml-2">
                  {THEME_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        onThemeChange(option.id);
                        if (isMobileOrTablet) {
                          setIsThemeSubmenuOpen(false);
                        }
                      }}
                      className={`mb-1 flex h-10 w-full items-center justify-between rounded-lg px-2.5 text-sm last:mb-0 ${
                        theme === option.id ? 'bg-fuchsia-600/35 text-white' : 'text-gray-200 hover:bg-white/10'
                      }`}
                    >
                      <span>{option.label}</span>
                      {theme === option.id && (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="m5 12 4 4 10-10" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </li>

            <li>
              <button
                type="button"
                onClick={handleHomeClick}
                className="group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left hover:bg-white/10"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m3 11 9-7 9 7M5 10v10h14V10" />
                </svg>
                <span
                  className={`overflow-hidden whitespace-nowrap text-sm transition-all ${
                    showLabels ? 'max-w-[140px] opacity-100' : 'max-w-0 opacity-0'
                  }`}
                >
                  Home
                </span>
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => handleSectionNav('playing-now')}
                className="group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left hover:bg-white/10"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m8 6 10 6-10 6V6Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5v14" />
                </svg>
                <span
                  className={`overflow-hidden whitespace-nowrap text-sm transition-all ${
                    showLabels ? 'max-w-[140px] opacity-100' : 'max-w-0 opacity-0'
                  }`}
                >
                  Playing
                </span>
              </button>
            </li>

            <li>
              <button
                type="button"
                onClick={() => handleSectionNav('playlist-strip')}
                className="group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left hover:bg-white/10"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h10M4 17h13" />
                </svg>
                <span
                  className={`overflow-hidden whitespace-nowrap text-sm transition-all ${
                    showLabels ? 'max-w-[140px] opacity-100' : 'max-w-0 opacity-0'
                  }`}
                >
                  Playlists
                </span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default SideMenu;
