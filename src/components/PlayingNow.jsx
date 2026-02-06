import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlayer } from '../hooks/usePlayer';

function PlayingNow() {
  const {
    isAuthed,
    playbackState,
    isPlaybackLoading,
    isPlaying,
    progressMs,
    durationMs,
    togglePlayPause,
    next,
    previous,
    seekToMs
  } = usePlayer();

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubMs, setScrubMs] = useState(0);
  const progressBarRef = useRef(null);
  const activePointerIdRef = useRef(null);

  const displayProgressMs = isScrubbing ? scrubMs : progressMs;
  const progressPercent = useMemo(() => {
    if (!durationMs) return 0;
    return Math.max(0, Math.min(100, (displayProgressMs / durationMs) * 100));
  }, [displayProgressMs, durationMs]);

  const loading = isPlaybackLoading;

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getMsFromClientX = (clientX) => {
    const el = progressBarRef.current;
    if (!el || !durationMs) return 0;

    const rect = el.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    return Math.round(clampedRatio * durationMs);
  };

  const handleScrubStart = (event) => {
    if (!durationMs) return;

    event.preventDefault();
    activePointerIdRef.current = event.pointerId;
    progressBarRef.current?.setPointerCapture?.(event.pointerId);
    setIsScrubbing(true);
    setScrubMs(getMsFromClientX(event.clientX));
  };

  const handleScrubMove = (event) => {
    if (!isScrubbing) return;
    if (activePointerIdRef.current !== event.pointerId) return;
    event.preventDefault();
    setScrubMs(getMsFromClientX(event.clientX));
  };

  const handleScrubEnd = async (event) => {
    if (!isScrubbing) return;
    if (activePointerIdRef.current !== event.pointerId) return;

    event.preventDefault();
    const finalMs = getMsFromClientX(event.clientX);
    setScrubMs(finalMs);
    setIsScrubbing(false);
    activePointerIdRef.current = null;

    try {
      // Spec requirement: seek and resume playback on release
      await seekToMs(finalMs, { resume: true });
    } catch (error) {
      console.error('Seek error:', error);
    }
  };

  useEffect(() => {
    if (!isScrubbing) return;
    // Keep scrub preview stable if track changes under us
    if (!durationMs) {
      setIsScrubbing(false);
    }
  }, [durationMs, isScrubbing]);

  const handleKeyDown = async (event) => {
    if (!durationMs && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) return;

    if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      try {
        await togglePlayPause();
      } catch (error) {
        console.error('Play/pause error:', error);
      }
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      try {
        await seekToMs((progressMs || 0) - 5000, { resume: true });
      } catch (error) {
        console.error('Seek error:', error);
      }
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      try {
        await seekToMs((progressMs || 0) + 5000, { resume: true });
      } catch (error) {
        console.error('Seek error:', error);
      }
    }
  };

  return (
    <div
      className="w-full bg-gradient-to-br from-fuchsia-900 via-purple-950 to-black rounded-xl shadow-xl p-3 sm:p-4 lg:p-5 h-full border border-fuchsia-800/30 flex flex-col"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Playing Now</h2>
        {/* Playing status badge moved to header */}
        {!loading && playbackState?.item && (
          <div>
            {isPlaying ? (
              <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Playing
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 bg-gray-500/20 text-gray-400 rounded-full">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                Paused
              </span>
            )}
          </div>
        )}
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fuchsia-400"></div>
        </div>
      )}

      {!loading && !playbackState?.item && (
        <p className="text-gray-400 text-center py-8 text-sm">
          {isAuthed ? 'Click any song to start playing!' : 'Login to Spotify to start playing.'}
        </p>
      )}

      {!loading && playbackState?.item && (
        <div className="flex-1 flex flex-col justify-center space-y-3">
          {/* Compact Album Art & Track Info Layout */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Album Art - Reduced size */}
            <div className="flex-shrink-0">
              <img
                src={playbackState.item.album.images[0]?.url}
                alt={playbackState.item.album.name}
                className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-lg shadow-xl object-cover"
              />
            </div>

            {/* Track Info & Metadata */}
            <div className="flex-1 space-y-2 text-center sm:text-left w-full">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white line-clamp-2">
                {playbackState.item.name}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 line-clamp-1">
                {playbackState.item.artists.map(a => a.name).join(', ')}
              </p>
              
              {/* Album & Metadata */}
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="text-gray-400 line-clamp-1">
                  <span className="text-gray-500">Album:</span> {playbackState.item.album.name}
                </p>
                {playbackState.item.album.release_date && (
                  <p className="text-gray-400">
                    <span className="text-gray-500">Year:</span> {playbackState.item.album.release_date.split('-')[0]}
                  </p>
                )}
                <p className="text-gray-400">
                  <span className="text-gray-500">Duration:</span> {formatTime(playbackState.item.duration_ms)}
                </p>
              </div>
              
              {/* Session Context */}
              <div className="pt-2 border-t border-fuchsia-700/30">
                <p className="text-xs text-gray-500">
                  {isPlaying ? '🎵 Currently playing from your library' : '⏸️ Playback paused'}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={previous}
                className="p-2 sm:p-2.5 rounded-full bg-fuchsia-800/30 hover:bg-fuchsia-700/50 text-white transition-all hover:scale-110"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>
              
              <button
                onClick={togglePlayPause}
                className="p-3 sm:p-3.5 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition-all hover:scale-110 shadow-lg"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={next}
                className="p-2 sm:p-2.5 rounded-full bg-fuchsia-800/30 hover:bg-fuchsia-700/50 text-white transition-all hover:scale-110"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 w-full max-w-6xl mx-auto">
              <div
                ref={progressBarRef}
                role="slider"
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={durationMs || 0}
                aria-valuenow={Math.floor(displayProgressMs)}
                className="h-3 bg-gray-700/90 rounded-full overflow-hidden w-full touch-none select-none cursor-pointer"
                onPointerDown={handleScrubStart}
                onPointerMove={handleScrubMove}
                onPointerUp={handleScrubEnd}
                onPointerCancel={handleScrubEnd}
              >
                <div
                  className="h-full bg-gradient-to-r from-fuchsia-600 via-purple-500 to-fuchsia-600"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(displayProgressMs || 0)}</span>
                <span>{formatTime(playbackState.item.duration_ms)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayingNow;