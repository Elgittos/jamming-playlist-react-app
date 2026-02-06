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

function SideMenu({ theme, onThemeChange, onHome, onNavigate }) {
  const handleHomeClick = () => {
    onHome?.();
    onNavigate?.();
  };

  const handleSectionNav = (sectionId) => {
    scrollToSection(sectionId);
    onNavigate?.();
  };

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

        <button
          type="button"
          onClick={() => handleSectionNav('playlist-strip')}
          className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left hover:bg-white/5"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h10M4 17h13" />
          </svg>
          <span className="text-sm">Playlists</span>
        </button>

        <div className="mt-2 border-t border-white/10 pt-2">
          <div className="px-3 text-xs font-semibold uppercase tracking-wide text-white/70">Theme</div>
          <div className="mt-2 space-y-1">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onThemeChange(option.id)}
                className={`flex h-10 w-full items-center justify-between rounded-xl px-3 text-left text-sm transition-colors ${
                  theme === option.id
                    ? 'accent-bg accent-border border'
                    : 'border border-white/10 hover:bg-white/5'
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
        </div>

        <div className="mt-auto px-3 pt-2 text-xs text-white/55">
          Tip: Use Home to reset search.
        </div>
      </nav>
    </aside>
  );
}

export default SideMenu;




