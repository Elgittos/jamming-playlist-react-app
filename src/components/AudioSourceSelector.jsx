import { useAudio, AudioSourceType } from '../audio';

function AudioSourceSelector() {
  const { currentSource, switchSource, sources } = useAudio();

  const handleSourceChange = (e) => {
    const newSource = e.target.value;
    const success = switchSource(newSource);
    if (!success) {
      alert(`Failed to switch to ${newSource}`);
    }
  };

  // Get display names for sources
  const sourceNames = {
    [AudioSourceType.OPENVERSE]: 'Openverse (Open Licensed)',
    [AudioSourceType.ROYALFREE]: 'Jamendo (Free Music)',
    [AudioSourceType.SPOTIFY]: 'Spotify',
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
      <label htmlFor="audio-source" className="text-xs sm:text-sm text-white/80 font-medium">
        Audio Source:
      </label>
      <select
        id="audio-source"
        value={currentSource}
        onChange={handleSourceChange}
        className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-full bg-purple-900/50 border-2 border-purple-700/50 text-white text-xs sm:text-sm focus:outline-none focus:border-fuchsia-500 transition-all cursor-pointer hover:bg-purple-900/70"
        aria-label="Select audio source"
      >
        {sources.map((source) => (
          <option key={source} value={source} className="bg-purple-900 text-white">
            {sourceNames[source] || source}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AudioSourceSelector;
