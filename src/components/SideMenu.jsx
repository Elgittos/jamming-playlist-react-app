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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeSubmenuOpen, setIsThemeSubmenuOpen] = useState(false);
  const collapseTimeoutRef = useRef(null);

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
    return () => {
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current);
      }
    };
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

  const showLabels = isMobileOrTablet ? isMobileMenuOpen : true; // Always show on desktop

  const closeTouchMenu = () => {
    if (!isMobileOrTablet) return;
    setIsMobileMenuOpen(false);
    setIsThemeSubmenuOpen(false);
  };

  const handleHomeClick = () => {
    onHome?.();
  };

  const handleSectionNav = (sectionId) => {
    scrollToSection(sectionId);
    closeTouchMenu();
  };

  const onDesktopMouseLeave = () => {
    if (isMobileOrTablet) return;
    // Close theme submenu when mouse leaves menu area
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current);
    }
    collapseTimeoutRef.current = window.setTimeout(() => {
      setIsThemeSubmenuOpen(false);
      collapseTimeoutRef.current = null;
    }, 180);
  };

  const menuShellClass = isMobileOrTablet
    ? `fixed top-0 left-0 z-50 h-screen w-44 transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`
    : 'fixed top-3 left-3 z-40 h-[calc(100vh-1.5rem)] w-[24rem]'; // Always expanded on desktop

  return (
    <aside className="surface-panel w-full rounded-2xl p-3 text-white lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-64">
      <nav className="flex h-full flex-col gap-2">
        <button
          type="button"
          onClick={handleHomeClick}
          className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left hover:bg-white/5"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m3 11 9-7 9 7M5 10v10h14V10" />
          </svg>
          <span className="text-sm">Home</span>
        </button>

        <button
          type="button"
          onClick={() => handleSectionNav('playing-now')}
          className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left hover:bg-white/5"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m8 6 10 6-10 6V6Z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5v14" />
          </svg>
          <span className="text-sm">Playing</span>
        </button>

      <div className={menuShellClass} onMouseLeave={onDesktopMouseLeave}>
        <aside className="absolute left-0 top-0 h-full w-56 rounded-2xl border border-white/10 bg-black/65 px-2 py-3 text-white backdrop-blur-xl">
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
                <span>{option.label}</span>
                {theme === option.id && (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="m5 12 4 4 10-10" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto px-3 pt-2 text-xs text-white/55">
          Tip: Use Home to reset search.
        </div>
      </nav>
    </aside>
  );
}

export default SideMenu;




